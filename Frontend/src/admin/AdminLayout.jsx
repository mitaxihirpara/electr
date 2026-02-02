import { Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      
      {/* LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <h2 className="logo">ElectroMart</h2>

        <nav>
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/admin/add-product")}>Add Product</button>
          <button onClick={() => navigate("/admin/products")}> Manage Products</button>
          <button onClick={() => navigate("/admin/orders")}> Manage Orders</button>
          <button onClick={() => navigate("/admin/customers")}>Manage Customers</button>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
