import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./admin_customer.css";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/customers/${id}`)
      .then(res => res.json())
      .then(data => setCustomer(data));
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>Customer Details</h2>

      <div className="detail-card">
        <p><b>ID:</b> {customer.id}</p>
        <p><b>Username:</b> {customer.username}</p>
        <p><b>Email:</b> {customer.email}</p>
        <p>
          <b>Status:</b>{" "}
          <span className={customer.is_active ? "active" : "inactive"}>
            {customer.is_active ? "Active" : "Deactivated"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomerDetails;
