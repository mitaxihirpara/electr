import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({ products:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/order-details/${id}`)
      .then((res)=> {
            // console.log("ORDER DETAILS RESPONSE 👉", res.data);
            setOrder(res.data);
   })
      .catch(() => alert("Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order found</p>;


  const statusSteps = ["PLACED", "SHIPPED", "DELIVERED"];

  return (
    <div className="order-details-wrapper">
      <h2>Order Details</h2>

      <div className="order-summary">
        <p><b>Order ID:</b> #{order.id}</p>
        <p><b>Status:</b> {order.order_status}</p>
        <p><b>Payment:</b> {order.payment_method}</p>
        <p><b>Date:</b> {new Date(order.order_date).toLocaleString()}</p>
        <p><b>Delivery Address:</b> {order.address}</p>
      </div>


 {/* Tracking Timeline */}
      <h3>Order Tracking</h3>
      <div className="tracking-timeline">
        {statusSteps.map((step) => (
          <div
            key={step}
            className={`timeline-step ${
              order.order_status === step ||
              statusSteps.indexOf(order.order_status) >
                statusSteps.indexOf(step)
                ? "done"
                : ""
            }`}
          >
            {step === "PLACED" && "🟢 Placed"}
            {step === "SHIPPED" && "🚚 Shipped"}
            {step === "DELIVERED" && "✅ Delivered"}
          </div>
        ))}
        {order.order_status === "CANCELLED" && (
          <div className="timeline-step cancelled">❌ Cancelled</div>
        )}
      </div>




      <h3>Products</h3>

      {order.products?.map((p, i) => (
        <div className="order-item" key={i}>
          <img src={p.image} alt={p.name} />
          <div>
            <p className="name">{p.name}</p>
            <p>Qty: {p.quantity}</p>
            <p>Price: ₹{p.price}</p>
          </div>
        </div>
      ))}

      <h3 className="total">Total: ₹{order.total_amount}</h3>
    </div>
  );
};

export default OrderDetails;
