from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="electromart",
        port=3307
    )

def get_category_id(slug):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id FROM categories WHERE slug=%s", (slug,))
    row = cur.fetchone()
    cur.close()
    db.close()
    return row[0] if row else None

@app.route("/")
def home():
    return "Backend is running!"

# ---------------- ADMIN LOGIN ------------
    
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # 🔐 Admin check
        cursor.execute("""
            SELECT id, name
            FROM admin
            WHERE email=%s AND password=%s
        """, (email, password))
        admin = cursor.fetchone()

        if admin:
            cursor.close()
            conn.close()
            return jsonify({
                "type": "admin",
                "admin_id": admin["id"],
                "admin_name": admin["name"]
            }), 200

        # 👤 Customer check
        cursor.execute("""
            SELECT id, username
            FROM customers
            WHERE email=%s AND password=%s AND is_active=1
        """, (email, password))
        customer = cursor.fetchone()

        cursor.close()
        conn.close()

        if customer:
            return jsonify({
                "type": "customer",
                "customer_id": customer["id"],
                "customer_name": customer["username"]
            }), 200

        # Invalid credentials
        return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"message": "Server error"}), 500



#register
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "All fields required"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # 🔍 check already exists
    cursor.execute("SELECT id FROM customers WHERE email=%s", (email,))
    existing = cursor.fetchone()

    if existing:
        db.close()
        return jsonify({"message": "User already exists"}), 409

    # ✅ insert new user
    cursor.execute(
        "INSERT INTO customers (username, email, password) VALUES (%s,%s,%s)",
        (username, email, password)
    )
    db.commit()
    db.close()

    return jsonify({"success": True, "message": "Registration successful"}), 201



#addproduct
@app.route("/admin/add-product", methods=["POST"])
def admin_add_product():
    name = request.form.get("name")
    price = request.form.get("price")
    category = request.form.get("category")
    stock = request.form.get("stock")
    image = request.files.get("image")

    if not all([name, price, category, stock, image]):
        return jsonify({"message": "All fields required"}), 400

    # folder create
    folder_path = os.path.join(UPLOAD_FOLDER, category)
    os.makedirs(folder_path, exist_ok=True)

    image_path = os.path.join(folder_path, image.filename)
    image.save(image_path)

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO products (name, price, category,  category_id,stock, image)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (name, price, category, stock, image.filename))

    db.commit()
    db.close()

    return jsonify({"success": True, "message": "Product added successfully"})

#admin manage customer 
@app.route("/api/admin/customers", methods=["GET"])
def get_customers():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            id,
            username,
            email,
            is_active
        FROM customers
        ORDER BY id DESC
    """)
    customers = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(customers)

#ACTIVATE / DEACTIVATE API
@app.route("/api/admin/customers/<int:id>/status", methods=["PUT"])
def toggle_customer_status(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE customers
        SET is_active = NOT is_active
        WHERE id = %s
    """, (id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Customer status updated"})

#Admin – Get Single Customer
@app.route("/api/admin/customers/<int:id>", methods=["GET"])
def get_single_customer(id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            id,
            username,
            email,
            is_active
        FROM customers
        WHERE id=%s
    """, (id,))

    customer = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(customer)

#Admin – Activate / Deactivate Customer
@app.route("/api/admin/customers/status", methods=["PUT"])
def update_customer_status():
    data = request.json
    customer_id = data.get("id")
    is_active = data.get("is_active")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE customers
        SET is_active=%s
        WHERE id=%s
    """, (is_active, customer_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"success": True, "message": "Customer status updated"})

#orders admin
@app.route("/api/admin/orders", methods=["GET"])
def get_orders():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            id,
            customer_name,
            total_amount,
            payment_status,
            order_status
        FROM orders
        ORDER BY id DESC
    """)

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(orders)

#feedback
@app.route("/api/feedback/<int:product_id>", methods=["GET"])
def get_product_feedback(product_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            customer_name,
            comment,
            created_at
        FROM feedback
        WHERE id = %s
        ORDER BY id DESC
    """, (product_id,))

    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks)

#addfeedback
@app.route("/api/feedback", methods=["POST"])
def add_feedback():
    try:
            data = request.json

            conn = get_db()
            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO feedback
                (id, customer_name, comment)
                VALUES (%s, %s, %s)
            """, (
                data["id"],
                data.get("customer_name", "Guest"),
                data["comment"]
            ))

            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({"message": "Feedback added successfully"}),201

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


#admin manage feedback
@app.route("/api/admin/feedback", methods=["GET"])
def get_all_feedback():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            pf.id,
            p.name AS product_name,
            pf.customer_name,
            pf.comment,
            pf.created_at
        FROM feedback pf
        JOIN products p ON pf.product_id = p.id
        ORDER BY pf.id DESC
    """)

    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks)

#deactivate product 
@app.route("/api/products/<int:id>/status", methods=["PUT"])
def toggle_product_status(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE products
        SET is_active = NOT is_active
        WHERE id = %s
    """, (id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Product status updated"})

#search
@app.route("/search-suggestions", methods=["GET"])
def search_suggestions():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({"results": []})

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT 
                p.id,
                p.name,
                'product' AS type,
                c.slug
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.name LIKE %s

            UNION

            SELECT 
                c.id,
                c.name,
                'category' AS type,
                c.slug
            FROM categories c
            WHERE c.name LIKE %s

            LIMIT 10
        """, (f"%{query}%", f"%{query}%"))

        results = cursor.fetchall()
        return jsonify({"results": results})

    except Exception as e:
        print("Search error:", e)
        return jsonify({"results": []}), 500

    finally:
        cursor.close()
        db.close()




#change password
@app.route("/change-password", methods=["POST"])
def change_password():
    data = request.json
    email = data.get("email")
    new_password = data.get("newPassword")

    if not email or not new_password:
        return jsonify({"message": "Email and password required"}), 400

    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # admin check
        cursor.execute("SELECT id FROM admin WHERE email=%s", (email,))
        admin = cursor.fetchone()

        if admin:
            cursor.execute(
                "UPDATE admin SET password=%s WHERE email=%s",
                (new_password, email)
            )
            db.commit()
            return jsonify({"message": "Admin password changed"}), 200

        # customer check
        cursor.execute("SELECT id FROM customers WHERE email=%s", (email,))
        customer = cursor.fetchone()

        if customer:
            cursor.execute(
                "UPDATE customers SET password=%s WHERE email=%s",
                (new_password, email)
            )
            db.commit()
            return jsonify({"message": "Customer password changed"}), 200

        return jsonify({"message": "Email not registered"}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "Server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


# TRENDING 
@app.route("/api/trending")
def trending():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE is_trending=1")
    products = cursor.fetchall()

    for p in products:
        folder = p["category"]
        if folder == "smallaplliance":
            folder = "smallappliance"
        p["image"] = f"http://localhost:5000/uploads/{folder}/{p['image']}"

    db.close()
    return jsonify(products)


#add_cart
# @app.route("/api/cart/add", methods=["POST", "OPTIONS"])
# def add_to_cart():
#     if request.method == "OPTIONS":
#         return jsonify({"status": "ok"}), 200

#     data = request.get_json()

#     user_id = data.get("user_id")
#     product_id = data.get("product_id")

#     conn = get_db()
#     cursor = conn.cursor(dictionary=True)

#     cursor.execute(
#         "SELECT * FROM cart WHERE user_id=%s AND product_id=%s",
#         (user_id, product_id)
#     )
#     item = cursor.fetchone()

#     if item:
#         cursor.execute(
#             "UPDATE cart SET quantity = quantity + 1 WHERE id=%s",
#             (item["id"],)
#         )
#     else:
#         cursor.execute(
#             "INSERT INTO cart (user_id, product_id, quantity) VALUES (%s,%s,1)",
#             (user_id, product_id)
#         )

#     conn.commit()
#     cursor.close()
#     conn.close()

#     return jsonify({"message": "Added to cart"}), 200

@app.route("/api/cart/add", methods=["POST", "OPTIONS"])
def add_to_cart():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    data = request.get_json()

    customer_id = int(data.get("user_id"))  # 🔥 MAP user_id → customer_id
    product_id = int(data.get("product_id"))

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # check already exists
    cursor.execute(
        "SELECT * FROM cart WHERE customer_id=%s AND product_id=%s",
        (customer_id, product_id)
    )
    item = cursor.fetchone()

    if item:
        cursor.execute(
            "UPDATE cart SET quantity = quantity + 1 WHERE id=%s",
            (item["id"],)
        )
    else:
        cursor.execute(
            "INSERT INTO cart (customer_id, product_id, quantity) VALUES (%s,%s,1)",
            (customer_id, product_id)
        )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Added to cart"}), 200



#fetch api

@app.route("/api/cart/<int:user_id>")
def get_cart(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT cart.id, cart.quantity, products.name, products.price, products.image
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = %s
    """, (user_id,))

    data = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(data)


# ---------------- DEALS ---------------

@app.route("/api/deals")
def deals():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # Join deals with products to get correct product info
        cursor.execute("""
            SELECT 
                d.id as deal_id,
                p.id as product_id,
                p.name as title,
                p.category,
                p.price,
                p.stock,
                p.description,
                p.image as image_filename,
                d.discount_text
            FROM deals d
            JOIN products p ON d.product_id = p.id
        """)
        deals = cursor.fetchall()

        for d in deals:
            folder = d.get("category", "unknown")
            d["image_url"] = f"http://localhost:5000/uploads/{folder}/{d['image_filename']}"
        
        return jsonify(deals)

    except Exception as e:
        print("Deals API Error:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()

# ---------------- GENERIC CATEGORY ----------------
@app.route("/api/category/<category>")
def category_products(category):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE category=%s", (category,))
    products = cursor.fetchall()

    for p in products:
        p["image"] = f"http://localhost:5000/uploads/{category}/{p['image']}"

    db.close()
    return jsonify(products)

 #mobilecatelog
@app.route("/api/mobiles")
def mobiles():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, name, price, image FROM products WHERE category='mobile'AND is_active=1"
    )
    mobiles = cursor.fetchall()

    for m in mobiles:
        m["image"] = f"http://localhost:5000/uploads/mobile/{m['image']}"

    db.close()
    return jsonify(mobiles)

@app.route("/api/tvs")
def tvs():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='tv'AND is_active=1")
    tvs = cursor.fetchall()

    for tv in tvs:
        tv["image"] = f"http://localhost:5000/uploads/tv/{tv['image']}"

    db.close()
    return jsonify(tvs)

@app.route("/api/laptops")
def laptops():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='laptop'AND is_active=1")
    laptops = cursor.fetchall()

    for l in laptops:
        l["image"] = f"http://localhost:5000/uploads/laptop/{l['image']}"

    db.close()
    return jsonify(laptops)

@app.route("/api/smartwatches")
def smartwatches():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='smartwatch'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/smartwatch/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/smallappliances")
def small_appliances():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='smallaplliance'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/smallappliance/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/washingmachines")
def washing_machines():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='washingmachine'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/washingmachine/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/refrigerators")
def refrigerators():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='refrigerator'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/refrigerator/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/speakers")
def speakers():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='speaker'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/speaker/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/computers")
def computers():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='computer'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/computer/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/tablets")
def tablets():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='tablet'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/tablet/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/earbuds")
def earbuds():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='earbuds'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/earbuds/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/cameras")
def cameras():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='camera'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/camera/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/airconditioners")
def airconditioners():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='ac'AND is_active=1")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/ac/{p['image']}"

    db.close()
    return jsonify(items)


@app.route("/api/gamingconsoles")
def gaming_consoles():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, name, price, image FROM products WHERE category='gamingconsole'AND is_active=1"
    )
    products = cursor.fetchall()

    for p in products:
        p["image"] = f"http://localhost:5000/uploads/gamingconsole/{p['image']}"

    db.close()
    return jsonify(products)



# ---------------- PRODUCT DETAIL ----------------
@app.route("/api/product/<int:id>")
def get_product(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products WHERE id=%s", (id,))
    product = cursor.fetchone()

    if product:
        folder = product["category"]
        if folder == "smallaplliance":
            folder = "smallappliance"
        product["image"] = f"http://localhost:5000/uploads/{folder}/{product['image']}"

    db.close()
    return jsonify(product)


@app.route("/api/products", methods=["GET"])
def admin_get_products():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, name, category, price, stock FROM products"
    )
    products = cursor.fetchall()

    db.close()
    return jsonify(products)


#brands
@app.route("/api/brand/<brand_name>")
def brand_products(brand_name):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM products
        WHERE brand=%s AND is_active=1
    """, (brand_name,))

    products = cursor.fetchall()

    for p in products:
        folder = p["category"]
        p["image"] = f"http://localhost:5000/uploads/{folder}/{p['image']}"

    db.close()
    return jsonify(products)





# @app.route("/api/products/<int:id>", methods=["DELETE"])
# def admin_delete_product(id):
#     db = get_db()
#     cursor = db.cursor()

#     cursor.execute("DELETE FROM products WHERE id=%s", (id,))
#     db.commit()

#     db.close()
#     return jsonify({"success": True})

# ---------------- IMAGE SERVE ----------------
@app.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
