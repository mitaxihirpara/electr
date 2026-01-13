from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import send_from_directory
import os


app = Flask(__name__)
CORS(app)
# for image folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

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
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory('uploads', filename)



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
@app.route("/products")
def get_products():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    return jsonify(cursor.fetchall())

if __name__ == "__main__":
    app.run(debug=True, port=5000)
