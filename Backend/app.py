from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
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

@app.route("/")
def home():
    return "Backend is running!"

# ---------------- ADMIN LOGIN ------------
    

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # 1️⃣ check admin
    cursor.execute(
        "SELECT id FROM admin WHERE email=%s AND password=%s",
        (email, password)
    )
    admin = cursor.fetchone()

    if admin:
        db.close()
        return jsonify({"success": True, "role": "admin"})

    # 2️⃣ check customer
    cursor.execute(
        "SELECT id FROM customers WHERE email=%s AND password=%s",
        (email, password)
    )
    customer = cursor.fetchone()

    db.close()

    if customer:
        return jsonify({"success": True, "role": "customer"})

    # 3️⃣ new customer → register
    return jsonify({
        "success": False,
        "register": True,
        "message": "Customer not registered"
    }), 404


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
        INSERT INTO products (name, price, category, stock, image)
        VALUES (%s,%s,%s,%s,%s)
    """, (name, price, category, stock, image.filename))

    db.commit()
    db.close()

    return jsonify({"success": True, "message": "Product added successfully"})


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

#search
@app.route("/search-suggestions", methods=["GET"])
def search_suggestions():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({"products": []}), 400

    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Fetch matching products (only name + id + optional slug or category)
        sql = "SELECT id, name FROM products WHERE name LIKE %s LIMIT 10"
        cursor.execute(sql, (f"%{query}%",))
        products = cursor.fetchall()

        return jsonify({"products": products}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"products": []}), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


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

# ---------------- DEALS ----------------
@app.route("/api/deals")
def deals():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM deals")
    deals = cursor.fetchall()

    for d in deals:
        d["image_url"] = f"http://localhost:5000/uploads/{d['image']}"

    db.close()
    return jsonify(deals)

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
        "SELECT id, name, price, image FROM products WHERE category='mobile'"
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

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='tv'")
    tvs = cursor.fetchall()

    for tv in tvs:
        tv["image"] = f"http://localhost:5000/uploads/tv/{tv['image']}"

    db.close()
    return jsonify(tvs)

@app.route("/api/laptops")
def laptops():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='laptop'")
    laptops = cursor.fetchall()

    for l in laptops:
        l["image"] = f"http://localhost:5000/uploads/laptop/{l['image']}"

    db.close()
    return jsonify(laptops)

@app.route("/api/smartwatches")
def smartwatches():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='smartwatch'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/smartwatch/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/smallappliances")
def small_appliances():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='smallaplliance'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/smallappliance/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/washingmachines")
def washing_machines():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='washingmachine'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/washingmachine/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/refrigerators")
def refrigerators():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='refrigerator'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/refrigerator/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/speakers")
def speakers():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='speaker'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/speaker/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/computers")
def computers():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='computer'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/computer/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/tablets")
def tablets():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='tablet'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/tablet/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/earbuds")
def earbuds():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='earbuds'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/earbuds/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/cameras")
def cameras():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='camera'")
    items = cursor.fetchall()

    for p in items:
        p["image"] = f"http://localhost:5000/uploads/camera/{p['image']}"

    db.close()
    return jsonify(items)

@app.route("/api/airconditioners")
def airconditioners():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id, name, price, image FROM products WHERE category='ac'")
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
        "SELECT id, name, price, image FROM products WHERE category='gamingconsole'"
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

@app.route("/api/products/<int:id>", methods=["DELETE"])
def admin_delete_product(id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM products WHERE id=%s", (id,))
    db.commit()

    db.close()
    return jsonify({"success": True})

# ---------------- IMAGE SERVE ----------------
@app.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
