import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order-details/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order details error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Order #{order.id}</h2>
      <p>Status: {order.order_status}</p>
      <p>Total: ₹{order.total_amount}</p>
      <p>Payment: {order.payment_method}</p>
      <p>Address: {order.address}</p>

      <h3>Products</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map(p => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>
                <img src={p.image} alt={p.name} width={50} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrderDetails;
