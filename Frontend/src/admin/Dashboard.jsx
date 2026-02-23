// import "./Dashboard.css";
// import AdminCharts from "./admincharts"; 
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// const [topProducts, setTopProducts] = useState([]);
// const [orderStatus, setOrderStatus] = useState([]);




// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//   products: 0,
//   orders: 0,
//   users: 0,
//   revenue: 0
// });
//  useEffect(() => {
//   useEffect(() => {
//   axios.get("http://localhost:5000/api/admin/dashboard/top-products")
//     .then(res => setTopProducts(res.data));

//   axios.get("http://localhost:5000/api/admin/dashboard/order-status")
//     .then(res => setOrderStatus(res.data));


//   axios.get("http://localhost:5000/api/admin/dashboard")
//     .then(res => {
//       setData(res.data);
//     })
//     .catch(err => console.log(err));
// }, []);


//   return (
//     <div className="admin-dashboard">
//       <h1>Admin Dashboard</h1>

//       {/* Summary Cards */}
//       <div className="card-grid">
//         <div className="card">
//           Total Products <span>{data.products}</span>
//         </div>
//         <div className="card">
//           Total Orders <span>{data.orders}</span>
//         </div>
//         <div className="card">
//           Total Users <span>{data.users}</span>
//         </div>
//         <div className="card">
//           Revenue <span>₹{data.revenue}</span>
//         </div>
//       </div>

//       {/*  CHARTS SECTION */}
//       <h2>Analytics Overview</h2>
//       <AdminCharts />

//       {/* Quick Actions */}
//       {/* <div className="admin-actions">
//          <button onClick={() => navigate("/admin/add-product")}>
//           Add Product
//         </button>

//         <button onClick={() => navigate("/admin/products")}>
//           View Products
//         </button>

//         <button onClick={() => navigate("/admin/orders")}>
//           Manage Orders
//         </button>
//       </div> */}

//       <h2>Quick Insights</h2>

// <div className="dashboard-lists">

//   {/* Top Selling */}
//   <div className="list-box">
//     <h3>Top Selling Products</h3>
//     {topProducts.map((item, i) => (
//       <div key={i} className="list-row">
//         <span>{item.name}</span>
//         <strong>{item.total_sold}</strong>
//       </div>
//     ))}
//   </div>

//   {/* Order Status */}
//   <div className="list-box">
//     <h3>Order Status Summary</h3>
//     {orderStatus.map((item, i) => (
//       <div key={i} className="list-row">
//         <span>{item.status}</span>
//         <strong>{item.total}</strong>
//       </div>
//     ))}
//   </div>

// </div>

//     </div>
//   );
// };

// export default AdminDashboard;

import "./Dashboard.css";
import AdminCharts from "./admincharts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ ALL STATES INSIDE COMPONENT
  const [data, setData] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  // ✅ SINGLE useEffect
  useEffect(() => {

    axios.get("http://localhost:5000/api/admin/dashboard/top-products")
      .then(res => setTopProducts(res.data))
      .catch(err => console.log(err));

    axios.get("http://localhost:5000/api/admin/dashboard/order-status")
      .then(res => setOrderStatus(res.data))
      .catch(err => console.log(err));

    axios.get("http://localhost:5000/api/admin/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));

  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="card-grid">
        <div className="card">
          Total Products <span>{data.products}</span>
        </div>
        <div className="card">
          Total Orders <span>{data.orders}</span>
        </div>
        <div className="card">
          Total Users <span>{data.users}</span>
        </div>
        <div className="card">
          Revenue <span>₹{data.revenue}</span>
        </div>
      </div>

      {/* Charts */}
      <h2>Analytics Overview</h2>
      <AdminCharts />

      {/* Quick Insights */}
      <h2>Quick Insights</h2>

      <div className="dashboard-lists">

        {/* Top Selling */}
        <div className="list-box">
          <h3>Top Selling Products</h3>
          {topProducts.map((item, i) => (
            <div key={i} className="list-row">
              <span>{item.name}</span>
              <strong>{item.total_sold}</strong>
            </div>
          ))}
        </div>

        {/* Order Status */}
        <div className="list-box">
          <h3>Order Status Summary</h3>
          {orderStatus.map((item, i) => (
            <div key={i} className="list-row">
              <span>{item.status}</span>
              <strong>{item.total}</strong>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
