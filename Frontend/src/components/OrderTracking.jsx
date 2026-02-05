import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderTracking.css";

const statusSteps = ["PLACED", "SHIPPED", "DELIVERED"];

const OrderTracking = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch order details
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>No order found</p>;

  return (
    <div className="tracking-container">
      <h2>Order ID: {order.id}</h2>
      <p>Status: {order.order_status}</p>

      <div className="tracking-steps">
        {statusSteps.map((status, index) => (
          <div key={index} className="step">
            <div
              className={`circle ${
                statusSteps.indexOf(order.order_status) >= index ? "active" : ""
              }`}
            >
              {index + 1}
            </div>
            <span className={statusSteps.indexOf(order.order_status) >= index ? "active" : ""}>
              {status}
            </span>
            {index < statusSteps.length - 1 && <div className="line"></div>}
          </div>
        ))}
        {order.order_status === "CANCELLED" && (
          <div className="cancelled">
            <p>Order Cancelled ❌</p>
          </div>
        )}
      </div>

      <h3>Products</h3>
      <ul>
        {order.products.map((p, i) => (
          <li key={i}>
            <img src={p.image} alt={p.name} width={50} />
            {p.name} x {p.quantity} - ₹{p.price * p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTracking;
