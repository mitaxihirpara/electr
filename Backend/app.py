from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

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
    
    
if __name__ == "__main__":
    app.run(debug=True)


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
    app.run(debug=True)
