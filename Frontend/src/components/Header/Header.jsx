import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Searchbar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass, faUser,faHeart, faShieldAlt } from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {
     const navigate = useNavigate();
     const [search, setSearch] = useState("");
  
  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/" className="nav-logo">
        <img src={assets.E2} alt="logo" className="nav-logo-img" />
      </Link>

      {/* Navigation Links + Search */}
      <ul className="nav-links">
        
        <li className="nav-search">
           <div className="search-wrapper">
              <SearchBar />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            </div></li>
      </ul>

      
      <div className="nav-right">
        <Link to="/orders">Orders</Link>
        <Link to="/contact">Contact us</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart" className="nav-cart-icon">
        
          <FontAwesomeIcon icon={faCartShopping} /> Cart
        </Link>
       
          <Link to="/login" className="login-icon">
            <FontAwesomeIcon icon={faUser} /> Login
          </Link>
        
      </div>
    </div>
  );
};

export default Navbar;
