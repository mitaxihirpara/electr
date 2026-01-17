from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import send_from_directory
import os


app = Flask(__name__)
CORS(app)
# for image folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="Electromart",
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

    if admin and admin["role"] == "admin":
       return jsonify({
        "success": True,
        "role": "admin"
    })
    else:
        return jsonify({"success": False}), 401
    
    


# deals
@app.route("/uploads/<path:filename>")
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)



@app.route("/api/deals", methods=["GET"])
def get_deals():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM deals")  # database table se fetch
    deals = cursor.fetchall()

    # image column ko full URL me convert karna
    for deal in deals:
        deal["image_url"] = f"http://localhost:5000/uploads/{deal['image']}"

    return jsonify(deals)
    


#mobilecatelog
@app.route("/api/mobiles")
def mobiles():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, price, image FROM products WHERE category='mobile'")
    mobiles = cursor.fetchall()

    for m in mobiles:
        m["image"] = f"http://localhost:5000/uploads/{m['image']}"

    return jsonify(mobiles)
    
       
# catelog
@app.route("/api/products/<category>")
def get_category_products(category):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, price, image FROM product WHERE category=%s",
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


#tvcatelog
# @app.route("/api/tvs")
# def get_tvs():
#     return jsonify([


#   {
#     "id": 201,
#     "name": "OnePlus y Series smart Tv",
#     "price": 38999,
#     "image": "1+tv.jpg"
#   },
#   {
#     "id": 202,
#     "name": "LG 55 inch OLED Smart TV",
#     "price": 89999,
#     "image": "1plus led.png"
#   },
#   {
#     "id": 203,
#     "name": "Sony Bravia 50 inch 4K TV",
#     "price": 62999,
#     "image": "smart tv mi.jpg"
#   },
#   {
#     "id": 204,
#     "name": "OnePlus Y Series 43 inch TV",
#     "price": 27999,
#     "image": "1+tv.jpg"
#   }
# ])



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

# Get products
# @app.route("/products")
# def get_all_products():
#     cursor = db.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM products")
#     return jsonify(cursor.fetchall())

if __name__ == "__main__":
    app.run(debug=True, port=5000)
