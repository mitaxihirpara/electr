import React from "react";
import "./Cart.css";

const Cart = () => {
  return (
    <div className="cart-page">
      <h2 className="cart-title">My Cart</h2>

      <div className="empty-cart-card">
        <div className="cart-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
          />
        </div>

        <h3>Empty Cart</h3>
        <p>Browse items and add them to your cart</p>

        <button className="continue-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;
    