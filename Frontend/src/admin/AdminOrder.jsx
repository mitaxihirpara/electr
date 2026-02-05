import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  // console.log("🔥 AdminOrders component loaded");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
    headers: {
       role: "admin"
      }
  }
      );
      console.log("🔥 AdminOrders responses:",res.data);

      setOrders(res.data || []);
    } catch (err) {
      console.error("Admin orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/order-status/${orderId}`,
        { status }
      );
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    
    <div style={{ padding: 20 }}>
      <h2>Admin – Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.id}</td>
                <td>{order.customer_name}</td>
                <td>₹{order.total_amount}</td>
                <td>{order.order_status}</td>

                <td>
                  <select
                    value={order.order_status}
                    onChange={e =>
                      changeStatus(order.order_id, e.target.value)
                    }
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() =>
                      navigate(`/admin/order/${order.order_id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;
