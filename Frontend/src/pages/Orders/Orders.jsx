
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const customer_id = localStorage.getItem("customer_id"); // number
  const customer_name = localStorage.getItem("customer_name"); // string

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getStatusText = (status) => {
  switch (status) {
    case "PLACED":
      return "🟢 Order Placed";
    case "SHIPPED":
      return "🚚 Shipped (Out for delivery)";
    case "DELIVERED":
      return "✅ Delivered";
    case "CANCELLED":
      return "❌ Cancelled";
    default:
      return status;
  }
};


const cancelOrder = async (orderId) => {
  try {
    await axios.put(
      `http://localhost:5000/api/orders/cancel/${orderId}`
    );
    alert("Order cancelled successfully");

    // refresh orders
    const res = await axios.get(
      `http://localhost:5000/api/orders/${customer_id}`
    );
    setOrders(res.data.orders || []);

  } catch (err) {
    alert(err.response?.data?.message || "Cancel failed");
  }
};

  useEffect(() => {
    if (!customer_id) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/orders/${customer_id}`)
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => console.error("Orders fetch error:", err))
      .finally(() => setLoading(false));
  }, [customer_id]);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found</p>;

  return (
    <div className="orders-wrapper">
      <h2>My Orders</h2>
      <div className="orders-list">

        {orders.map((order) => (
          <div className="order-card" key={order.id}>

  {/* LEFT SIDE – Product Image */}
  <div className="order-left">
    <img
      src={order.products[0]?.image}
      alt={order.products[0]?.name}
      className="order-main-image"
    />
  </div>

  {/* RIGHT SIDE – Order Details */}
  <div className="order-right">
    <p><b>Order ID:</b> #{order.id}</p>

    <p className="product-name"  onClick={() => navigate(`/orders/${order.id}`)}  style={{ cursor: "pointer", color: "#0d6efd" }}>
      {order.products[0]?.name}
      {order.products.length > 1 && ` + ${order.products.length - 1} more`}
    </p>

    <p><b>Total:</b> ₹{order.total_amount}</p>
    <p><b>Payment:</b> {order.payment_method}</p>
    <p><b>Status:</b> {getStatusText(order.order_status)}</p>
    <p><b>Date:</b> {new Date(order.order_date).toLocaleString()}</p>

    {order.order_status === "PLACED" && (
      <button
        className="cancel-btn"
        onClick={() => cancelOrder(order.id)}
      >
        Cancel Order
      </button>
    )}
  </div>

</div>

     ))}
        </div>
        </div>
  );
};

export default Orders;

