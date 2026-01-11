import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faXTwitter,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">

      {/* Top Links */}
      <div className="footer-links">

        <div>
          <h4>Product Categories</h4>
          <ul>
            <li>Smartphones</li>
            <li>Laptops</li>
            <li>DSLR Cameras</li>
            <li>Televisions</li>
            <li>Air Conditioners</li>
            <li>Refrigerators</li>
            <li>Kitchen Appliances</li>
            <li>Accessories</li>
            <li>Personal Care & Grooming</li>
          </ul>
        </div>

        <div>
          <h4>Site Info</h4>
          <ul>
            <li>About ElectroMart</li>
            <li>Services</li>
            <li>Site Map</li>
            <li>Gift Cards</li>
            <li>Corporate Enquiries</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h4>Resource Center</h4>
          <ul>
            <li>Buying Guides</li>
            <li>Manuals</li>
            <li>How To’s</li>
            <li>Compare Products</li>
            <li>Nearest Store</li>
          </ul>
        </div>

        <div>
          <h4>Policies</h4>
          <ul>
            <li>Terms of Use</li>
            <li>FAQs</li>
            <li>Cancellation & Returns</li>
            <li>Pricing & Payments</li>
            <li>Privacy Policy</li>
            <li>E-waste Recycling</li>
            <li>EMI & Cashback T&C</li>
            <li>Loyalty Program T&C</li>
            <li>Caution Notice</li>
          </ul>
        </div>

      </div>

      {/* App + Social */}
      <div className="footer-app">
        <div className="app-left">
          <div className="app-mock">📱</div>
          <p>Experience ElectroMart app on mobile</p>
          <div className="app-buttons">
            <button>Google Play</button>
            <button>App Store</button>
          </div>
        </div>

        <div className="app-right">
          <h4>Follow us</h4>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebookF} />
            <FontAwesomeIcon icon={faXTwitter} />
            <FontAwesomeIcon icon={faYoutube} />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="footer-disclaimer">
        <h4>Disclaimer</h4>
        <p>
          Product prices, offers and availability are subject to change from
          time to time. All prices are inclusive of taxes. Product colours and
          images are for illustration purposes only and may not exactly match
          the actual product. Product specifications are subject to change
          without prior notice.
        </p>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        © 2026 ElectroMart. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
