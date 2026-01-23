import "./Dashboard.css";
import AdminCharts from "./admincharts"; 
import { useNavigate } from "react-router-dom";




const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="card-grid">
        <div className="card">
          Total Products <span>120</span>
        </div>
        <div className="card">
          Total Orders <span>45</span>
        </div>
        <div className="card">
          Total Users <span>32</span>
        </div>
        <div className="card">
          Revenue <span>₹1,25,000</span>
        </div>
      </div>

      {/*  CHARTS SECTION */}
      <h2>Analytics Overview</h2>
      <AdminCharts />

      {/* Quick Actions */}
      {/* <div className="admin-actions">
         <button onClick={() => navigate("/admin/add-product")}>
          Add Product
        </button>

        <button onClick={() => navigate("/admin/products")}>
          View Products
        </button>

        <button onClick={() => navigate("/admin/orders")}>
          Manage Orders
        </button>
      </div> */}

      {/* Recent Orders */}
      <h2>Recent Orders</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#101</td>
            <td>Amit</td>
            <td>Samsung TV</td>
            <td>Delivered</td>
          </tr>
          <tr>
            <td>#102</td>
            <td>Neha</td>
            <td>iPhone</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
