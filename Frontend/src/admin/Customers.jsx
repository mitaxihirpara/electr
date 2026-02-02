import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin_customer.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  const toggleStatus = (id) => {
  fetch(`http://localhost:5000/api/admin/customers/${id}/status`, {
    method: "PUT",
  })
    .then(res => res.json())
    .then(() => {
      setCustomers(prev =>
        prev.map(c =>
          c.id === id ? { ...c, is_active: !c.is_active } : c
        )
      );
    });
};

  return (
    <div className="admin-container">
      <h2>Customers</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.username}</td>
              <td>{c.email}</td>
              <td>{c.is_active ? "Active" : "Inactive"}</td>
              <td>
                <button
                    className="btn-view"
                    onClick={() => navigate(`/admin/customers/${c.id}`)}>
                    View
                </button>
            
                 <button
                    className={c.is_active ? "btn-deactivate" : "btn-activate"}
                    onClick={() => toggleStatus(c.id)}
                >
                    {c.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
