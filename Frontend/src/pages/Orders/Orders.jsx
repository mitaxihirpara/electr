import React, { useState } from "react";
import "./Orders.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("online");
  const [subTab, setSubTab] = useState("recent");

  return (
    <div className="orders-wrapper">
      {/* Sidebar */}
      <aside className="orders-sidebar">
        <div className="profile-box">
          <div className="avatar"></div>
        </div>

        <ul className="menu">
          <li>My Profile</li>
          <li className="active">My Order</li>
          <li>Delivery Addresses</li>
          <li>PAN & GST Information</li>
          <li>ROne Loyalty Points</li>
          <li>My Credit (Jio Wallet)</li>
          <li>My Wishlist</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="orders-content">
        <p className="breadcrumb">Home Page &gt; My Account &gt; My Order</p>

        <h2>My Orders</h2>

        {/* Top Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "online" ? "active" : ""}
            onClick={() => setActiveTab("online")}
          >
            Online Orders
          </button>
          <button
            className={activeTab === "instore" ? "active" : ""}
            onClick={() => setActiveTab("instore")}
          >
            In-store
          </button>
          <button
            className={activeTab === "warranty" ? "active" : ""}
            onClick={() => setActiveTab("warranty")}
          >
            Warranty Orders
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="sub-tabs">
          <button
            className={subTab === "recent" ? "active" : ""}
            onClick={() => setSubTab("recent")}
          >
            Recent Orders
          </button>
          <button
            className={subTab === "past" ? "active" : ""}
            onClick={() => setSubTab("past")}
          >
            Past Orders
          </button>
          <button
            className={subTab === "pending" ? "active" : ""}
            onClick={() => setSubTab("pending")}
          >
            Pending/Failed Orders
          </button>
        </div>

        {/* Empty Orders Card */}
        <div className="empty-orders">
          <div className="icon-box">📦</div>
          <h3>There are no current orders</h3>
          <p>You have no orders to show</p>
          <button className="continue-btn">Continue Shopping</button>
        </div>
      </main>
    </div>
  );
};

export default Orders;
