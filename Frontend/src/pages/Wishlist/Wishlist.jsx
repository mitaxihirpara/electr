// import React from "react";
// import "./Wishlist.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-solid-svg-icons";

// const Wishlist = () => {
//   return (
//     <div className="wishlist-page">
//       <h2 className="wishlist-title">My Wishlist</h2>

//       <div className="empty-wishlist-card">
//         <div className="wishlist-icon">
//           <FontAwesomeIcon icon={faHeart} />
//         </div>

//         <h3>Your Wishlist is Empty</h3>
//         <p>Save your favorite items and they'll appear here</p>

//         <button className="continue-btn">
//           Continue Shopping
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const customer_id = localStorage.getItem("customer_id");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!customer_id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/wishlist/${customer_id}`);
        const data = await res.json();
        setWishlistItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [customer_id]);

  const handleRemove = async (product_id) => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id, product_id })
      });
      const result = await res.json();
      if (result.status === "removed") {
        setWishlistItems(wishlistItems.filter(item => item.id !== product_id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <h2 className="wishlist-title">My Wishlist</h2>
        <div className="empty-wishlist-card">
          <div className="wishlist-icon">
            <FontAwesomeIcon icon={faHeart} />
          </div>
          <h3>Your Wishlist is Empty</h3>
          <p>Save your favorite items and they'll appear here</p>
          <button className="continue-btn">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">My Wishlist</h2>

      <div className="wishlist-grid">
        {wishlistItems.map(item => (
          <div className="wishlist-card" key={item.id}>
            <div className="wishlist-image">
              <img src={`http://localhost:5000/uploads/${item.category}/${item.image}`} alt={item.name} />
              <span className="remove-icon" onClick={() => handleRemove(item.id)}>
                <FontAwesomeIcon icon={faHeart} />
              </span>
            </div>
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
