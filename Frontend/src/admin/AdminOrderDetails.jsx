// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./AdminOrderDetails.css";

// function AdminOrderDetails() {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/order-details/${orderId}`);
//         console.log("Order details response:", res.data);
//         setOrder(res.data);
//       } catch (err) {
//         console.error("Order details error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   if (loading) return <p>Loading order details...</p>;
//   if (!order) return <p>Order not found</p>;

//   return (
//     <div className="order-details-container" style={{ padding: 20 }}>
//       <h2>Order #{order.id}</h2>
//       <p>Status: {order.order_status}</p>
//       <p>Total: ₹{order.total_amount}</p>
//       <p>Payment: {order.payment_method}</p>
//       <p>Address: {order.address}</p>

//       <h3>Products</h3>
//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Image</th>
//           </tr>
//         </thead>
//         <tbody>
//            {order.products.length > 0 ? (
//              order.products.map((p,index) => (
//             <tr key={p.name}>
//               <td>{p.name}</td>
//               <td>{p.quantity}</td>
//               <td>₹{p.price}</td>
//               <td>
//                 <img src={`http://localhost:5000/uploads/${p.category}/${p.image}`} alt={p.name} width={50} />
//               </td>
//             </tr>
//           ))

//         ):(
//            <tr><td colSpan={4}>No products found</td></tr>)}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AdminOrderDetails;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AdminOrderDetails.css";

function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order-details/${orderId}`);
        console.log("Order details response:", res.data);
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
    <div className="order-details-container">
      <h2>Order #{order.id}</h2>
      <div className="order-summary">
        <p><strong>Status:</strong> {order.order_status}</p>
        <p><strong>Total:</strong> ₹{order.total_amount}</p>
        <p><strong>Payment:</strong> {order.payment_method}</p>
        <p><strong>Address:</strong> {order.address}</p>
      </div>

      <h3>Products</h3>
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {order.products.length > 0 ? (
              order.products.map((p, index) => (
                <tr key={index}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <img
                    src={p.image}
                      // src={`http://localhost:5000/uploads/${p.category}/${p.image}`}
                      alt={p.name}
                      className="product-image"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderDetails;
