import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css";
import assets from "../assets/assets";

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

  const handlePrint = () => {
  const invoiceContent = document.getElementById("invoice-section").innerHTML;

  const printWindow = window.open("", "", "width=900,height=650");

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          @page {
            margin: 20mm;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            position: relative;
          }

          .invoice-container {
            padding-bottom: 80px; /* space for footer */
          }

          .invoice-header {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .invoice-logo {
            width: 100px;
            height: auto;
          }

          hr {
            margin: 20px 0;
          }

          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .invoice-table th,
          .invoice-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }

          .invoice-table th {
            background: #f2f2f2;
          }

          .invoice-summary {
            text-align: right;
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
          }

          .invoice-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: gray;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${invoiceContent}
        </div>

        <div class="invoice-footer">
          Thank you for shopping with ElectroMart ❤️ <br/>
          This is a computer generated invoice.
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

 return (
  <>
    <div className="order-details-wrapper">
      <h2>Order Details</h2>

      <div className="order-summary">
        <p><b>Order ID:</b> #{order.id}</p>
        <p><b>Status:</b> {order.order_status}</p>
        <p><b>Payment:</b> {order.payment_method}</p>
        <p><b>Date:</b> {new Date(order.order_date).toLocaleString()}</p>
        <p><b>Delivery Address:</b> {order.address}</p>
      </div>

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

            {order.order_status !== "CANCELLED" && (
        <button className="print-btn" onClick={handlePrint}>
          🖨️ Print Invoice
        </button>
)}


    </div>

    {/* ================= INVOICE SECTION ================= */}

    <div id="invoice-section" className="invoice-container">
      <div className="invoice-header">
         <img src={assets.E2} alt="ElectroMart" className="invoice-logo" />
        {/* <img src="/logo.png" alt="ElectroMart Logo" className="invoice-logo" /> */}
        <div>
          <h1>ElectroMart</h1>
          <p>Nikol,Ahmedabad,Gujarat, India</p>
          <p>Email: support@electromart.com</p>
        </div>
      </div>

      <hr />

      <div className="invoice-info">
        <p><b>Invoice No:</b> INV-{order.id}</p>
        <p><b>Order Date:</b> {new Date(order.order_date).toLocaleDateString()}</p>
        <p><b>Customer:</b> {localStorage.getItem("customer_name")}</p>
        <p><b>Address:</b> {order.address}</p>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>₹{p.price * p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-summary">
        <h3>Grand Total: ₹{order.total_amount}</h3>
      </div>

      
    </div>
  </>
);
};
export default OrderDetails;
