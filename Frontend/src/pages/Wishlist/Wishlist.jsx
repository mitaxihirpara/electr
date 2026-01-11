import React from "react";
import "./Wishlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">My Wishlist</h2>

      <div className="empty-wishlist-card">
        <div className="wishlist-icon">
          <FontAwesomeIcon icon={faHeart} />
        </div>

        <h3>Your Wishlist is Empty</h3>
        <p>Save your favorite items and they'll appear here</p>

        <button className="continue-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
