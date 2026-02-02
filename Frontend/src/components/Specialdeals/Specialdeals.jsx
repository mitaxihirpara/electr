import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SpecialDeals.css";

const SpecialDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:5000/api/deals")
      .then(res => {
        if (!res.ok) throw new Error("Backend not running");
        return res.json();
      })
      .then(data => {
        setDeals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="deals-section">
        <h2>Special Deals</h2>
        <p>Loading deals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deals-section">
        <h2>Special Deals</h2>
        <p style={{ color: "red" }}>
          Deals are unavailable. Backend server is not running.
        </p>
      </div>
    );
  }

  return (
    <div className="deals-section">
      <h2>Special Deals</h2>

      <div className="deals-grid">
        {deals.map(deal => (
          
          <div
          className="deal-card"
          key={deal.id}
         onClick={() => navigate(`/product/${deal.product_id}`)}


          style={{ cursor: "pointer" }}
        >
          <img src={deal.image_url} alt={deal.title} />
          <h3>{deal.title}</h3>
          <p className="price">
            ₹{deal.price} <span>₹{deal.old_price}</span>
          </p>
          <p className="discount">{deal.discount_text}</p>
        </div>

        ))}
      </div>
    </div>
  );
};

export default SpecialDeals;
