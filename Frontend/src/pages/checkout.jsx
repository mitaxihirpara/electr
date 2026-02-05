

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  // Get customer info from localStorage
  const customer_id = Number(localStorage.getItem("customer_id"));
  const customer_name = localStorage.getItem("customer_name");
  const cart_total = Number(localStorage.getItem("cart_total") || 0);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const confirmOrder = async () => {
    // Validation
    if (!customer_id || !customer_name) {
      alert("Please login first to place an order");
      navigate("/login");
      return;
    }

    if (cart_total <= 0) {
      alert("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    setLoading(true);

    try {
      // Post order to backend
      const res = await axios.post("http://localhost:5000/api/place-order", {
        customer_id,
        customer_name,
        address,
        total_amount: cart_total,
        payment_method: paymentMethod,
      });

      if (res.data.success) {
        alert("Order placed successfully 🎉");
        // Clear cart after order
        localStorage.setItem("cart_total", 0);
        navigate("/orders");
      } else {
        alert("Order could not be placed. Please try again");
      }
    } catch (err) {
      console.error("ORDER ERROR:", err.response || err);
      alert("Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-section">
        <h3>Delivery Address</h3>
        <textarea
          placeholder="House no, Street, City, Pincode"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="checkout-section">
        <h3>Payment Method</h3>
        <label className="radio-row">
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>
      </div>

      <div className="checkout-footer">
        <p><b>Total Amount:</b> ₹{cart_total}</p>
        <button
          className="confirm-order-btn"
          onClick={confirmOrder}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
