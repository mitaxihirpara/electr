import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const customer_id = Number(localStorage.getItem("customer_id"));
  const customer_name = localStorage.getItem("customer_name");

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [cartTotal, setCartTotal] = useState(0);

  // 🔥 Check if Buy Now data exists
  const buyNowItem = location.state?.buyNowItem;

  useEffect(() => {
    if (!customer_id) return;

    // ✅ If Buy Now
    if (buyNowItem) {
      const total = buyNowItem.price * buyNowItem.quantity;
      setCartTotal(total);
    } 
    // ✅ Normal Cart Flow
    else {
      fetch(`http://localhost:5000/api/cart/${customer_id}`)
        .then(res => res.json())
        .then(data => {
          const items = data.cart_items || [];

          const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          setCartTotal(total);
        })
        .catch(err => console.error(err));
    }
  }, [customer_id, buyNowItem]);

  const confirmOrder = () => {
    if (!customer_id || !customer_name) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (cartTotal <= 0) {
      alert("Cart is empty");
      navigate("/cart");
      return;
    }

    if (!address.trim()) {
      alert("Enter delivery address");
      return;
    }

    navigate("/payment", {
      state: {
        customer_id,
        customer_name,
        address,
        total_amount: cartTotal,
        payment_method: paymentMethod,
        buyNowItem: buyNowItem || null
      }
    });
  };

  if (!customer_id) return <h3>Please login</h3>;

  return (
    <div className="checkout-page">
      <h2>Review & Pay</h2>

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

        <label>
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            checked={paymentMethod === "ONLINE"}
            onChange={() => setPaymentMethod("ONLINE")}
          />
          Online Payment
        </label>
      </div>

      <div className="checkout-footer">
        <p><b>Total Amount:</b> ₹{cartTotal}</p>

        <button onClick={confirmOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;