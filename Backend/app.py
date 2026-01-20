from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os


app = Flask(__name__)
CORS(app, supports_credentials=True)
# for image folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="electromart",
    port=3307
)

@app.route("/")
def home():
    return "Backend is running!"


# login
@app.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    email = data["email"]
    password = data["password"]

    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM admin WHERE email=%s AND password=%s",
        (email, password)
    )

    admin = cursor.fetchone()

    if admin:
        return jsonify({
            "success": True,
            "role": admin["role"]
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401
    
    
# is_trending
@app.route("/api/trending")
def trending():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE is_trending = 1")
    data = cursor.fetchall()
    return jsonify(data)



# deals
@app.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


#deals
@app.route("/api/deals", methods=["GET"])
def get_deals():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM deals")  # database table se fetch
    deals = cursor.fetchall()

    # image column ko full URL me convert karna
    for deal in deals:
        deal["image_url"] = f"http://localhost:5000/uploads/{deal['image']}"

    return jsonify(deals)
    



@app.route("/api/product/<int:id>")
def get_product(id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, description, image, category
        FROM products
        WHERE id=%s
    """, (id,))
    product = cursor.fetchone()

    if product and product["image"]:
        category_folder_map = {
            "mobile": "mobile",
            "tv": "tv",
            "Tablet": "tablet",
            "earbuds": "earbuds",
            "laptop": "laptop",
            "washingmachine": "washingmachine",
            "smartwatch": "smartwatch",
            "Refrigerator": "refrigerator",
            "Camera": "camera",
            "ac": "ac",
            "Computer": "computer","Speaker": "speaker","gamingconsole": "gamingconsole","smallaplliance": "smallappliance"

        }

        folder = category_folder_map.get(product["category"], "")
        product["image"] = f"http://localhost:5000/uploads/{folder}/{product['image']}"

    return jsonify(product)

#smallappliances
@app.route("/api/smallappliances", methods=["GET"])
def get_small_appliances():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE category='smallaplliance'")
    appliances = cursor.fetchall()

    for product in appliances:
        if product["image"]:
            product["image"] = f"http://localhost:5000/uploads/smallappliance/{product['image']}"

    return jsonify(appliances)



#gaming console
@app.route("/api/gamingconsoles", methods=["GET"])
def get_gaming_consoles():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE category='gamingconsole'")
    consoles = cursor.fetchall()

    for product in consoles:
        if product["image"]:
            product["image"] = f"http://localhost:5000/uploads/gamingconsole/{product['image']}"

    return jsonify(consoles)

# speakers
@app.route("/api/speakers", methods=["GET"])
def get_speakers():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE category='speaker'")
    speakers = cursor.fetchall()

    for product in speakers:
        if product["image"]:
            product["image"] = f"http://localhost:5000/uploads/speaker/{product['image']}"

    return jsonify(speakers)

# computers
@app.route("/api/computers", methods=["GET"])
def get_computers():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE category = 'computer'")
    computers = cursor.fetchall()

    for product in computers:
        if product["image"]:
            product["image"] = f"http://localhost:5000/uploads/computer/{product['image']}"

    return jsonify(computers)

# refrigerator
@app.route("/api/refrigerators", methods=["GET"])
def get_refrigerators():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='Refrigerator'
    """)
    refrigerators = cursor.fetchall()

    for fridge in refrigerators:
        if fridge["image"]:
            fridge["image"] = f"http://localhost:5000/uploads/refrigerator/{fridge['image']}"

    return jsonify(refrigerators)

#mobilecatelog
@app.route("/api/mobiles")
def mobiles():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, price, image FROM products WHERE category='mobile'")
    mobiles = cursor.fetchall()

    for m in mobiles:
        m["image"] = f"http://localhost:5000/uploads/mobile/{m['image']}"

    return jsonify(mobiles)
    
       
# catelog
@app.route("/api/products/<category>")
def get_category_products(category):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, price, image FROM products WHERE category=%s",
        (category,)
    )
    products = cursor.fetchall()

    for p in products:
        p["image"] = f"http://localhost:5000/uploads/{p['image']}"

    return jsonify(products)

    

#tv
@app.route("/api/tvs", methods=["GET"])
def get_tvs():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category = 'tv'
    """)
    tvs = cursor.fetchall()

    for tv in tvs:
        tv["image"] = f"http://localhost:5000/uploads/tv/{tv['image']}"

    return jsonify(tvs)


# ACs
@app.route("/api/airconditioners", methods=["GET"])
def get_airconditioners():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='ac'
    """)
    acs = cursor.fetchall()

    for ac in acs:
        if ac["image"]:
            ac["image"] = f"http://localhost:5000/uploads/ac/{ac['image']}"

    return jsonify(acs)

# cameras
@app.route("/api/cameras", methods=["GET"])
def get_cameras():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='camera'
    """)
    cameras = cursor.fetchall()

    for camera in cameras:
        if camera["image"]:
            camera["image"] = f"http://localhost:5000/uploads/camera/{camera['image']}"

    return jsonify(cameras)

# tablet
@app.route("/api/tablets", methods=["GET"])
def get_tablets():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='Tablet'
    """)
    tablets = cursor.fetchall()

    # image path fix
    for tablet in tablets:
        if tablet["image"]:
            tablet["image"] = f"http://localhost:5000/uploads/tablet/{tablet['image']}"

    return jsonify(tablets)


# washing machines
@app.route("/api/washingmachines", methods=["GET"])
def get_washingmachines():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='washingmachine'
    """)
    machines = cursor.fetchall()

    # Add image path
    for machine in machines:
        machine["image"] = f"http://localhost:5000/uploads/washingmachine/{machine['image']}"

    return jsonify(machines)

# laptops
@app.route("/api/laptops", methods=["GET"])
def get_laptops():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='laptop'
    """)
    laptops = cursor.fetchall()

    # Add image path
    for laptop in laptops:
        laptop["image"] = f"http://localhost:5000/uploads/laptop/{laptop['image']}"

    return jsonify(laptops)


# earbuds
@app.route("/api/earbuds", methods=["GET"])
def get_earbuds():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='earbuds'
    """)
    earbuds = cursor.fetchall()

    for earbud in earbuds:
        earbud["image"] = f"http://localhost:5000/uploads/earbuds/{earbud['image']}"

    return jsonify(earbuds)

# smartwatches
@app.route("/api/smartwatches", methods=["GET"])
def get_smartwatches():
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, name, price, image
        FROM products
        WHERE category='smartwatch'
    """)
    smartwatches = cursor.fetchall()

    # Add image path
    for watch in smartwatches:
        watch["image"] = f"http://localhost:5000/uploads/smartwatch/{watch['image']}"

    return jsonify(smartwatches)

# Add product API
@app.route("/add-product", methods=["POST"])
def add_product():
    data = request.json
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO products (name, price, stock) VALUES (%s, %s, %s)",
        (data["name"], data["price"], data["stock"])
    )
    db.commit()
    return jsonify({"message": "Product added successfully"})



if __name__ == "__main__":
    app.run(debug=True, port=5000)
