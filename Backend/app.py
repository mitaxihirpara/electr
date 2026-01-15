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
    database="electromart"
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
        "SELECT * FROM admins WHERE email=%s AND password=%s",
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
    deals = [
         {
            "id": 1,
            "title": "LED smart Tv",
            "price": 40499,
             "old_price": 45999,
            "discount_text": "12% OFF",
            "image_url": "http://127.0.0.1:5000/uploads/tv.png"
        },
        {
            "id": 2,
            "title": "Android Smartphone",
            "price": 11499,
             "old_price": 13999,
            "discount_text": "18% OFF",
            "image_url": "http://127.0.0.1:5000/uploads/mobile.png"
        },
        {
            "id": 3,
            "title": "Air Fryer",
            "price": 4799,
            "old_price": 5999,
            "discount_text": "20% OFF",
            "image_url": "http://127.0.0.1:5000/uploads/airfryer.png"
        },
        {
            "id": 4,
            "title": "Apple AirPods",
            "price": 12499,
            "old_price": 15999,
            "discount_text": "22% OFF",
            "image_url": "http://127.0.0.1:5000/uploads/airpods.png"
              }
    ]
    return jsonify(deals)


#mobilecatelog
@app.route("/api/mobiles")
def mobiles():
    return jsonify([
        {"id": 1,"name": "Samsung Galaxy S23","price": 69999,"image": "samsung.png"},
        {"id": 2,"name": "iPhone 14",
            "price": 79999,
            "image": "apple.png"
        },
        {
            "id": 3,
            "name": "OnePlus 11",
            "price": 47998,
            "image": "oneplus.png"
        },
        {
            "id": 4,
            "name": "Oppo X9 5G",
            "price": 56999,
            "image": "oppo.png"
        },
        {
            "id": 5,
            "name": "redmi xi",
            "price": 21999,
            "image": "mi.png"
        },
        {
            "id": 6,
            "name": "realme NARZO 80",
            "price": 12799,
            "image": "realme.png"
        },
        {
            "id": 7,
            "name": "Vivo V300 ",
            "price": 35799,
            "image": "vivo.png"
        },
        {
            "id": 8,
            "name": "Motorola Edge 60 5G",
            "price": 21998,
            "image": "moto.png"
        },
        {
            "id": 9,
            "name": "Oppo Reno 14",
            "price": 56999,
            "image": "oppo5g.png"
        },
        {
            "id": 10,
            "name": "samsung Galaxy S25 Ultra 5G ",
            "price": 129999,
            "image": "sam1.png"
        },
        {
            "id": 11,
            "name": "POCO C71 ",
            "price": 56999,
            "image": "pococ71.jpeg"
        },
        {
            "id": 12,
            "name": "Pixel 8 Pro XL",
            "price": 39999,
            "image": "google.jpeg"
        }
    ])
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
        FROM product
        WHERE category = 'tv'
    """)
    tvs = cursor.fetchall()

    for tv in tvs:
        tv["image"] = f"http://localhost:5000/uploads/{tv['image']}"

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
