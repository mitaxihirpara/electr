from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask import render_template_string
import mysql.connector
import os

# app = Flask(__name__)
app = Flask(
    __name__,
    static_folder="uploads",
    static_url_path="/uploads"
)
CORS(app)


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
        WHERE product_id = %s
        ORDER BY id DESC
    """, (product_id,))

    feedbacks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(feedbacks)

@app.route("/api/feedback", methods=["POST"])
def add_feedback():
    try:
        data = request.json

        if not data.get("customer_id"):
            return jsonify({"message": "Login required"}), 401

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO feedback (product_id, customer_id, customer_name, comment)
            VALUES (%s, %s, %s, %s)
        """, (
            data["product_id"],
            data["customer_id"],
            data["customer_name"],
            data["comment"]
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Feedback added successfully"}), 201

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Server error"}), 500


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


# ---------------- CART ----------------

@app.route("/api/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            cart.id AS cart_id,
            cart.quantity,
            p.id AS product_id,
            p.name,
            p.price,
            p.category,
            p.image
        FROM cart
        JOIN products p ON cart.product_id = p.id
        WHERE cart.customer_id = %s
    """, (user_id,))

    cart_items = cursor.fetchall()
    cursor.close()
    conn.close()

    for item in cart_items:
        folder = item["category"]
        if folder == "smallaplliance":
            folder = "smallappliance"

        item["image_url"] = f"http://localhost:5000/uploads/{folder}/{item['image']}"

    total_count = sum(item["quantity"] for item in cart_items)

    return jsonify({
        "cart_items": cart_items,
        "total_count": total_count
    })


@app.route("/api/cart/add", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    customer_id = int(data["user_id"])
    product_id = int(data["product_id"])

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT id FROM cart WHERE customer_id=%s AND product_id=%s",
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


@app.route("/api/cart/update", methods=["POST"])
def update_cart():
    data = request.get_json()
    cart_id = int(data["cart_id"])
    action = data["action"]

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT quantity FROM cart WHERE id=%s", (cart_id,))
    item = cursor.fetchone()

    if not item:
        return jsonify({"message": "Item not found"}), 404

    qty = item["quantity"]

    if action == "increment":
        qty += 1
    elif action == "decrement":
        qty -= 1

    if qty <= 0:
        cursor.execute("DELETE FROM cart WHERE id=%s", (cart_id,))
    else:
        cursor.execute("UPDATE cart SET quantity=%s WHERE id=%s", (qty, cart_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Cart updated"})


@app.route("/api/cart/remove/<int:cart_id>", methods=["DELETE"])
def remove_cart_item(cart_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cart WHERE id=%s", (cart_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Item removed"})

#subcategory
@app.route("/categories")
def get_categories():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM categories")
    return jsonify(cur.fetchall())

@app.route("/subcategories/<int:category_id>")
def get_subcategories(category_id):
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute(
        "SELECT * FROM subcategories WHERE category_id=%s",
        (category_id,)
    )
    return jsonify(cur.fetchall())



#add_product
@app.route("/admin/add-product", methods=["POST"])
def add_product():
    name = request.form.get("name")
    price = request.form.get("price")
    stock = request.form.get("stock")
    brand = request.form.get("brand") or None
    category_id = request.form.get("category_id")
    subcategory_id = request.form.get("subcategory_id")
    image = request.files.get("image")

    if not all([name, price, stock,category_id, subcategory_id, image]):
        return jsonify({"message": "All fields required"}), 400

    db = get_db()
    cur = db.cursor(dictionary=True)

    # validate subcategory belongs to category
    cur.execute(
        "SELECT category_id FROM subcategories WHERE id=%s",
        (subcategory_id,)
    )
    sub = cur.fetchone()

    if not sub or str(sub["category_id"]) != str(category_id):
        cur.close()
        db.close()
        return jsonify({"message": "Category & SubCategory mismatch"}), 400


        # get category slug/name using category_id
    cur.execute("SELECT slug FROM categories WHERE id=%s", (category_id,))
    cat = cur.fetchone()
    category = cat["slug"] if cat else None

    filename = image.filename
    image.save(os.path.join(UPLOAD_FOLDER, filename))

    cur = db.cursor()
    cur.execute("""
        INSERT INTO products
        (name, price, stock, brand,category, category_id, subcategory_id, image)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (name, price, stock, brand, category, category_id, subcategory_id, filename))

    db.commit()
    cur.close()
    db.close()

    return jsonify({"message": "Product added successfully"}), 200


#deactivate product 
# @app.route("/api/products/<int:id>/status", methods=["PUT"])
# def toggle_product_status(id):
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute("""
#         UPDATE products
#         SET is_active = NOT is_active
#         WHERE id = %s
#     """, (id,))
#     db.commit()
#     cursor.close()
#     db.close()
#     return jsonify({"message": "Product status updated"})

# Flask example
@app.route("/api/products/<int:id>/status", methods=["PUT"])
def toggle_product_status(id):
    db = get_db()
    cursor = db.cursor()

    # toggle status in DB
    cursor.execute("SELECT is_active FROM products WHERE id=%s", (id,))
    current = cursor.fetchone()
    if current is None:
        return jsonify({"error": "Product not found"}), 404

    new_status = 0 if current[0] == 1 else 1
    cursor.execute("UPDATE products SET is_active=%s WHERE id=%s", (new_status, id))
    db.commit()

    return jsonify({"id": id, "is_active": new_status})


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

    cursor.execute("""
        SELECT 
            p.id,
            p.name,
            p.price,
            p.image,
            p.category,
            s.name AS subcategory_name
        FROM products p
        LEFT JOIN subcategories s ON p.subcategory_id = s.id
        WHERE p.category='mobile'
        AND p.is_active=1
        ORDER BY s.name
    """)

    mobiles = cursor.fetchall()

    for m in mobiles:
        folder = m["category"]
        if folder == "smallaplliance":
            folder = "smallappliance"
        m["image"] = f"http://localhost:5000/uploads/{folder}/{m['image']}"

    cursor.close()

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
    cursor.execute("""
        SELECT 
            p.id,
            p.name,
            p.price,
            p.image,
            p.category,
            s.name AS subcategory_name
        FROM products p
        LEFT JOIN subcategories s ON p.subcategory_id = s.id
        WHERE p.category='laptop'
        AND p.is_active=1
        ORDER BY s.name
    """)

    laptops = cursor.fetchall()

    for l in laptops:
        folder = l["category"]
        l["image"] = f"http://localhost:5000/uploads/{folder}/{l['image']}"

    cursor.close()
    # cursor.execute("SELECT id, name, price, image FROM products WHERE category='laptop'AND is_active=1")
    # laptops = cursor.fetchall()

    # for l in laptops:
    #     l["image"] = f"http://localhost:5000/uploads/laptop/{l['image']}"

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
    cursor.execute("""
        SELECT 
            p.id,
            p.name,
            p.price,
            p.image,
            p.category,
            s.name AS subcategory_name
        FROM products p
        LEFT JOIN subcategories s ON p.subcategory_id = s.id
        WHERE p.category='computer'
        AND p.is_active=1
        ORDER BY s.name
    """)

    computers = cursor.fetchall()

    for c in computers:
        folder = c["category"]
        c["image"] = f"http://localhost:5000/uploads/{folder}/{c['image']}"

    cursor.close()
    # cursor.execute("SELECT id, name, price, image FROM products WHERE category='computer'AND is_active=1")
    # items = cursor.fetchall()

    # for p in items:
    #     p["image"] = f"http://localhost:5000/uploads/computer/{p['image']}"

    db.close()
    return jsonify(computers)

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
        "SELECT id, name, category, price, stock,is_active FROM products"
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





#orders
@app.route("/api/orders/<int:customer_id>")
def get_cust_orders(customer_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
           SELECT 
            o.id AS order_id,
            o.customer_name,
            o.total_amount,
            o.payment_method,
            o.order_status,
            o.order_date,
            od.product_id,
            od.product_name,
            od.quantity,
            p.image,
            p.category
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        WHERE o.customer_id = %s
        ORDER BY o.order_date DESC   
    """, (customer_id,)) 
    rows = cursor.fetchall()

    # group by order_id
    orders = {}
    for row in rows:
        oid = row["order_id"]
        if oid not in orders:
            orders[oid] = {
                "id": oid,
                "customer_name": row["customer_name"],
                "total_amount": row["total_amount"],
                "payment_method": row["payment_method"],
                "order_status": row["order_status"],
                "order_date": row["order_date"],
                "products": []
            }
            folder = row["category"]
            if folder == "smallaplliance":
                    folder = "smallappliance"

            image_url = f"http://localhost:5000/uploads/{folder}/{row['image']}"
  
        # image_url = f"http://localhost:5000/uploads/{row['category']}/{row['image']}"
        orders[oid]["products"].append({
            "name": row["product_name"],
            "quantity": row["quantity"],
            "image": image_url
        })

    cursor.close()
    db.close()

    return jsonify({"orders": list(orders.values())})

       

#update order 
# @app.route("/api/admin/order/status", methods=["PUT"])
# def update_order_status():
#     data = request.json
#     order_id = data.get("order_id")
#     status = data.get("status")

#     if status not in ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"]:
#         return jsonify({"message": "Invalid status"}), 400

#     db = get_db()
#     cursor = db.cursor()

#     cursor.execute("""
#         UPDATE orders
#         SET order_status=%s
#         WHERE id=%s
#     """, (status, order_id))

    # db.commit()
    # cursor.close()
    # db.close()

    # return jsonify({"message": "Order status updated"})


#cancel order customer 
@app.route("/api/orders/cancel/<int:order_id>", methods=["PUT"])
def cancel_order(order_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT order_status FROM orders WHERE id=%s", (order_id,))
    order = cursor.fetchone()

    if not order:
        return jsonify({"message": "Order not found"}), 404

    if order["order_status"] != "PLACED":
        return jsonify({"message": "Cannot cancel order now"}), 400

    cursor.execute("""
        UPDATE orders
        SET order_status='CANCELLED'
        WHERE id=%s
    """, (order_id,))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Order cancelled successfully"})



@app.route("/api/order/<int:order_id>")
def get_single_order(order_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
             SELECT 
            o.id AS order_id,
            o.total_amount,
            o.payment_method,
            o.order_status,
            o.order_date,
            o.address,

            # p.id AS product_id,
            p.name AS product_name,
            p.image,
            oi.quantity,
            oi.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.id = %s
    """, (order_id,))       
    

    rows = cursor.fetchall()

    if not rows:
        return jsonify({"message": "Order not found"}), 404

    order = {
        "id": rows[0]["order_id"],
        # "customer_name": rows[0]["customer_name"],
        "address": rows[0]["address"],
        "total_amount": rows[0]["total_amount"],
        "payment_method": rows[0]["payment_method"],
        "order_status": rows[0]["order_status"],
        "order_date": rows[0]["order_date"],
        "products": []
    }
    for r in rows:
         order["products"].append({
        # "product_id": r["product_id"],
        "name": r["product_name"],
        "image": f"http://localhost:5000/uploads/{r['image']}",
        "price": r["price"],
        "quantity": r["quantity"]
    })
         
    return jsonify(order)


# @app.route("/api/order-details/<int:order_id>")
# def get_order_details(order_id):
#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     cursor.execute("""
#         SELECT 
#             o.id AS order_id,
#             o.total_amount,
#             o.payment_method,
#             o.order_status,
#             o.order_date,
    #         o.address,

    #         p.name AS product_name,
    #         p.image,
    #         p.category,
    #         od.quantity,
    #         od.price
    #     FROM orders o
    #     JOIN order_details od ON o.id = od.order_id
    #     JOIN products p ON od.product_id = p.id
    #     WHERE o.id = %s
    # """, (order_id,))

    # rows = cursor.fetchall()

    # if not rows:
    #     cursor.close()
    #     db.close()
    #     return jsonify({"message": "Order not found"}), 404

    # order = {
    #     "id": rows[0]["order_id"],
    #     "order_status": rows[0]["order_status"],
    #     "payment_method": rows[0]["payment_method"],
    #     "order_date": rows[0]["order_date"],
    #     "address": rows[0]["address"],
    #     "total_amount": rows[0]["total_amount"],
    #     "products": []
    # }

    # for r in rows:
    #     folder = r["category"]
    #     if folder == "smallaplliance":
    #                 folder = "smallappliance"

    #     image_url = f"http://localhost:5000/uploads/{folder}/{r['image']}"

    #        # image_url = f"http://localhost:5000/uploads/{r['category']}/{r['image']}"
    #     order["products"].append({
    #         "name": r["product_name"],
    #         "image": image_url,
    #         "quantity": r["quantity"],
    #         "price": r["price"]
    #     })

    # cursor.close()
    # db.close()

    # return jsonify(order)



@app.route("/api/order-details/<int:order_id>", methods=["GET"])
def order_details(order_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # 1️⃣ Get order info
        cursor.execute("SELECT * FROM orders WHERE id=%s", (order_id,))
        order = cursor.fetchone()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        # 2️⃣ Get products in the order
        cursor.execute("""
            SELECT p.name, p.price, p.image,p.category, od.quantity
            FROM order_details od
            JOIN products p ON od.product_id = p.id
            WHERE od.order_id = %s
        """, (order_id,))
        products = cursor.fetchall()
        for p in products:
                    folder = p["category"]
                    if folder == "smallaplliance":
                        folder = "smallappliance"
                    p["image"] = f"http://localhost:5000/uploads/{folder}/{p['image']}"
   
        # 3️⃣ Merge products into order
        order['products'] = products

        return jsonify(order)
    
    except Exception as e:
        print("Order details error:", e)
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cursor.close()
        db.close()

@app.route("/api/admin/chart/orders-week")
def chart_orders_week():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
           w.week AS week,
          COALESCE(COUNT(o.id), 0) AS orders
        FROM (
          SELECT WEEK(CURDATE()) - 3 AS week UNION
          SELECT WEEK(CURDATE()) - 2 UNION
          SELECT WEEK(CURDATE()) - 1 UNION
          SELECT WEEK(CURDATE())
        ) w
        LEFT JOIN orders o 
          ON WEEK(o.order_date) = w.week
          AND MONTH(o.order_date) = MONTH(CURDATE())
          AND YEAR(o.order_date) = YEAR(CURDATE())
        GROUP BY w.week
        ORDER BY w.week
    """)

    data = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(data)


@app.route("/api/admin/chart/revenue-week")
def chart_revenue_week():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
           w.week AS week,
          COALESCE(SUM(o.total_amount), 0) AS revenue
        FROM (
          SELECT WEEK(CURDATE()) - 3 AS week UNION
          SELECT WEEK(CURDATE()) - 2 UNION
          SELECT WEEK(CURDATE()) - 1 UNION
          SELECT WEEK(CURDATE())
        ) w
        LEFT JOIN orders o 
          ON WEEK(o.order_date) = w.week
          AND MONTH(o.order_date) = MONTH(CURDATE())
          AND YEAR(o.order_date) = YEAR(CURDATE())
          AND o.order_status = 'DELIVERED'
        GROUP BY w.week
        ORDER BY w.week
    """)

    data = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(data)


@app.route("/api/admin/chart/category-orders")
def category_wise_orders():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.category AS name,
            SUM(od.quantity) AS value
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        JOIN orders o ON od.order_id = o.id
        WHERE MONTH(o.order_date) = MONTH(CURDATE())
        AND YEAR(o.order_date) = YEAR(CURDATE())
        GROUP BY p.category
        ORDER BY value DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(data)

@app.route("/api/admin/dashboard/top-products")
def top_selling_products():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.name,
            SUM(od.quantity) AS total_sold
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        GROUP BY od.product_id
        ORDER BY total_sold DESC
        LIMIT 5
    """)

    data = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(data)

@app.route("/api/admin/dashboard/order-status")
def order_status_summary():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT order_status AS status, COUNT(*) AS total
        FROM orders
        GROUP BY order_status
    """)

    data = cursor.fetchall()
    cursor.close()
    db.close()

    return jsonify(data)



@app.route("/api/admin/dashboard")
def admin_dashboard():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total_products FROM products")
    products = cursor.fetchone()["total_products"]

    cursor.execute("SELECT COUNT(*) AS total_orders FROM orders")
    orders = cursor.fetchone()["total_orders"]

    cursor.execute("SELECT COUNT(*) AS total_users FROM customers")
    users = cursor.fetchone()["total_users"]

    cursor.execute("SELECT SUM(total_amount) AS revenue FROM orders")
    revenue = cursor.fetchone()["revenue"] or 0

    cursor.close()
    db.close()

    return jsonify({
        "products": products,
        "orders": orders,
        "users": users,
        "revenue": revenue
    })


# @app.route("/api/admin/orders", methods=["GET"])
# def admin_orders():
#     db = get_db()
#     cursor = db.cursor(dictionary=True)

#     cursor.execute("""
#         SELECT 
#             id AS order_id,
#             customer_name,
#             total_amount,
#             order_status,
#             order_date
#         FROM orders
#         ORDER BY id DESC
#     """)

#     orders = cursor.fetchall()

#     cursor.close()
#     db.close()

#     return jsonify({"orders": orders})




@app.route("/api/admin/order-status/<int:order_id>", methods=["PUT"])
def update_order_status(order_id):
    data = request.json
    status = data.get("status")

    if status not in ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"]:
        return jsonify({"message": "Invalid status"}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "UPDATE orders SET order_status=%s WHERE id=%s",
        (status, order_id)
    )

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Status updated"})




#wishlist
# Add this to your Flask app

@app.route("/api/wishlist/toggle", methods=["POST"])
def toggle_wishlist():
    data = request.json
    customer_id = data.get("customer_id")
    product_id = data.get("product_id")

    if not customer_id or not product_id:
        return jsonify({"error": "Missing fields"}), 400

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Check if already in wishlist
    cursor.execute(
        "SELECT * FROM wishlist WHERE customer_id=%s AND product_id=%s",
        (customer_id, product_id)
    )
    item = cursor.fetchone()

    if item:
        cursor.execute(
            "DELETE FROM wishlist WHERE customer_id=%s AND product_id=%s",
            (customer_id, product_id)
        )
        conn.commit()
        return jsonify({"status": "removed"})
    else:
        cursor.execute(
            "INSERT INTO wishlist (customer_id, product_id) VALUES (%s, %s)",
            (customer_id, product_id)
        )
        conn.commit()
        return jsonify({"status": "added"})


@app.route("/api/wishlist/<int:customer_id>", methods=["GET"])
def get_wishlist(customer_id):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.* FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.customer_id=%s
    """, (customer_id,))
    items = cursor.fetchall()
    return jsonify(items)


#place order

@app.route("/api/place-order", methods=["POST"])
def place_order():
    data = request.json
    print("ORDER DATA RECEIVED:", data)

    customer_id = data.get("customer_id")
    customer_name = data.get("customer_name")
    address = data.get("address")
    total_amount = data.get("total_amount")
    payment_method = data.get("payment_method", "COD")

    if not customer_id or not customer_name or not address or not total_amount:
        return jsonify({"message": "Missing required fields"}), 400

    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # 1️⃣ Insert into orders
        cursor.execute("""
            INSERT INTO orders
            (customer_id, customer_name, address, total_amount, payment_method, payment_status, order_status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            customer_id,
            customer_name,
            address,
            total_amount,
            payment_method,
            "Pending" if payment_method == "COD" else "Paid",
            "PLACED"
        ))

        order_id = cursor.lastrowid

        # 2️⃣ Fetch cart items
        cursor.execute("""
            SELECT c.product_id, c.quantity, p.name, p.price 
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.customer_id=%s
        """, (customer_id,))
        cart_items = cursor.fetchall()

        if not cart_items:
            return jsonify({"message": "Cart is empty"}), 400

        # 3️⃣ Insert order details
        for item in cart_items:
            subtotal = item['price'] * item['quantity']
            cursor.execute("""
                INSERT INTO order_details
                (order_id, product_id, product_name, quantity, price, total)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                order_id,
                item['product_id'],
                item['name'],
                item['quantity'],
                item['price'],
                subtotal
            ))

        # 4️⃣ Clear cart
        cursor.execute("DELETE FROM cart WHERE customer_id=%s", (customer_id,))

        conn.commit()
        return jsonify({"success": True, "message": "Order placed successfully", "order_id": order_id}), 201

    except Exception as e:
        if conn:
            conn.rollback()
        print("PLACE ORDER ERROR:", e)
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

    finally:
        if conn:
            cursor.close()
            conn.close()



@app.route("/api/order-details/<int:order_id>", methods=["GET"])
def get_order_details(order_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # 1️⃣ Fetch order main info
        cursor.execute("SELECT * FROM orders WHERE id=%s", (order_id,))
        order_info = cursor.fetchone()

        if not order_info:
            return jsonify({"error": "Order not found"}), 404

        # 2️⃣ Fetch products from order_details table
        cursor.execute("""
            SELECT p.name, p.price, p.image, od.quantity
            FROM order_details od
            JOIN products p ON od.product_id = p.id
            WHERE od.order_id = %s
        """, (order_id,))
        products = cursor.fetchall()

        # 3️⃣ Attach products to order info
        order_info['products'] = products

        return jsonify(order_info)

    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({"error": "Database query failed"}), 500

    finally:
        cursor.close()
        db.close()




@app.route("/api/invoice/<int:order_id>")
def generate_invoice(order_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Get Order
    cursor.execute("SELECT * FROM orders WHERE id=%s", (order_id,))
    order = cursor.fetchone()

    if not order:
        return "Invoice not found", 404

    # Get Products
    cursor.execute("""
        SELECT p.name, p.price, p.image, p.category, od.quantity
        FROM order_details od
        JOIN products p ON od.product_id = p.id
        WHERE od.order_id=%s
    """, (order_id,))
    products = cursor.fetchall()

    grand_total = 0
    for p in products:
        p["subtotal"] = p["price"] * p["quantity"]
        grand_total += p["subtotal"]

    cursor.close()
    db.close()

    # Simple HTML Invoice Template
    html = """
    <html>
    <head>
        <title>Invoice</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 10px; text-align: center; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; }
            .print-btn { margin-top: 20px; }
        </style>
    </head>
    <body>

        <h2>ElectroMart Invoice</h2>

        <p><strong>Order ID:</strong> {{order.id}}</p>
        <p><strong>Name:</strong> {{order.customer_name}}</p>
        <p><strong>Address:</strong> {{order.address}}</p>
        <p><strong>Date:</strong> {{order.order_date}}</p>

        <table>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
            </tr>

            {% for p in products %}
            <tr>
                <td>{{p.name}}</td>
                <td>₹{{p.price}}</td>
                <td>{{p.quantity}}</td>
                <td>₹{{p.subtotal}}</td>
            </tr>
            {% endfor %}
        </table>

        <div class="total">
            <strong>Total: ₹{{grand_total}}</strong>
        </div>

        <button onclick="window.print()" class="print-btn">
            Print Invoice
        </button>

    </body>
    </html>
    """

    return render_template_string(
        html,
        order=order,
        products=products,
        grand_total=grand_total
    )


@app.route("/admin/reports")
def admin_reports():
    # month = request.args.get("month")
    # year = request.args.get("year")
    month = int(request.args.get("month"))
    year = int(request.args.get("year"))


    db = get_db()
    cur = db.cursor(dictionary=True)

    # Total Orders
    cur.execute("""
        SELECT COUNT(*) as total_orders,
               SUM(total_amount) as total_revenue
        FROM orders
        WHERE MONTH(order_date)=%s AND YEAR(order_date)=%s
    """, (month, year))
    summary = cur.fetchone()

    # Products Sold
    cur.execute("""
    SELECT SUM(oi.quantity) as total_products
    FROM order_details oi
    JOIN orders o ON oi.order_id = o.id
    WHERE MONTH(o.order_date)=%s AND YEAR(o.order_date)=%s
""", (month, year))

    product_data = cur.fetchone()

    # Weekly Breakdown
    cur.execute("""
        SELECT WEEK(order_date) as week,
               SUM(total_amount) as revenue
        FROM orders
        WHERE MONTH(order_date)=%s AND YEAR(order_date)=%s
        GROUP BY week
    """, (month, year))
    weekly = cur.fetchall()

    # Category Wise
    cur.execute("""
    SELECT p.category,
           SUM(oi.quantity) as total_sold
    FROM order_details oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE MONTH(o.order_date)=%s AND YEAR(o.order_date)=%s
    GROUP BY p.category
""", (month, year))

    category = cur.fetchall()

    cur.close()
    db.close()

    return jsonify({
        "total_orders": summary["total_orders"] or 0,
        "total_revenue": summary["total_revenue"] or 0,
        "total_products": product_data["total_products"] or 0,
        "avg_order_value": (summary["total_revenue"] or 0) / (summary["total_orders"] or 1),
        "weekly_data": weekly,
        "category_data": category
    })

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
