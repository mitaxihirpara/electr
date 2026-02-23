import React from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faHeadset,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <div className="contact-page">

      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="subtitle">
          We're here to assist you with any queries related to your orders,
          products, or support.
        </p>

        <div className="contact-details">

          <div className="contact-row">
            <FontAwesomeIcon icon={faHeadset} className="icon" />
            <div>
              <h4>Customer Support</h4>
              <p>Mon – Sat | 9:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div className="contact-row">
            <FontAwesomeIcon icon={faPhone} className="icon" />
            <div>
              <h4>Phone</h4>
              <p>0804 584 5678</p>
            </div>
          </div>

          <div className="contact-row">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <div>
              <h4>Email</h4>
              <p>support@electromart.com</p>
            </div>
          </div>

          <div className="contact-row">
            <FontAwesomeIcon icon={faLocationDot} className="icon" />
            <div>
              <h4>Location</h4>
              <p>Ahmedabad, Gujarat, India</p>
            </div>
          </div>

          <div className="contact-row">
            <FontAwesomeIcon icon={faClock} className="icon" />
            <div>
              <h4>Working Hours</h4>
              <p>We usually respond within 24 hours.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;