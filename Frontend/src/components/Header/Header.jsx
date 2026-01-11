import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import assets from "../../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass, faUser,faHeart, faShieldAlt } from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {
  const { isAdmin, user, logout } = useAuth();

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/" className="nav-logo">
        <img src={assets.E2} alt="logo" className="nav-logo-img" />
      </Link>

      {/* Navigation Links + Search */}
      <ul className="nav-links">
        {/* <li><a href="#">Products</a></li>
        <li><a href="#">Categories</a></li>
        
         */}
        <li className="nav-search">
          <input type="text" placeholder="Search products..." />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        </li>

        
      </ul>

      {/* Right side: Cart + Login */}
      <div className="nav-right">
        <Link to="/orders">Orders</Link>
        <Link to="/contact">Contact us</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart" className="nav-cart-icon">
          <FontAwesomeIcon icon={faCartShopping} /> Cart
        </Link>
        {isAdmin && (
          <Link to="/admin/dashboard" className="admin-link">
            <FontAwesomeIcon icon={faShieldAlt} /> Admin Panel
          </Link>
        )}
        {user ? (
          <div className="user-menu">
            <span className="user-email">{user.email}</span>
            <button onClick={logout} className="logout-link">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-icon">
            <FontAwesomeIcon icon={faUser} /> Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
