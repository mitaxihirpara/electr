import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const customerId = Number(localStorage.getItem("customer_id"));
  const customer_name = localStorage.getItem("customer_name");

  // Function to calculate total and save in localStorage
  const updateCartTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem("cart_total", total);
  };

  // Fetch cart items
  const fetchCart = () => {
    if (!customerId) return;

    fetch(`http://localhost:5000/api/cart/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setCartItems(data.cart_items);
        updateCartTotal(data.cart_items); // update total on every fetch
      });
  };

  useEffect(() => {
    fetchCart();
  }, [customerId]);

  if (!customerId) return <h3>Please login to view cart</h3>;
  if (cartItems.length === 0) return <h3>Your cart is empty</h3>;

  const updateQty = (cart_id, action) => {
    fetch("http://localhost:5000/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_id, action })
    }).then(() => fetchCart());
  };

  const removeItem = (cart_id) => {
    fetch(`http://localhost:5000/api/cart/remove/${cart_id}`, {
      method: "DELETE"
    }).then(() => fetchCart());
  };

  return (
    <div className="cart-page">
      <h2>My Cart</h2>

      {cartItems.map(item => (
        <div className="cart-item" key={item.cart_id}>
          <img src={item.image_url} alt={item.name} />

          <div className="cart-details">
            <h4>{item.name}</h4>
            <p className="price">₹{item.price}</p>

            <div className="qty-box">
              <button onClick={() => updateQty(item.cart_id, "decrement")}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.cart_id, "increment")}>+</button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeItem(item.cart_id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-footer">
        <p><b>Total:</b> ₹{localStorage.getItem("cart_total")}</p>
        <button
          className="place-order-btn"
          onClick={() => navigate("/checkout")}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
