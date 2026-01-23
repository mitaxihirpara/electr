import React from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEnvelope,faPhone,faLocationDot,faHeadset} from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <h1>We’re Here to Help ⚡</h1>
        <p>
          Questions about gadgets, orders, warranty, or repairs?
          Our electronics support team is always ready.
        </p>
      </div>

      {/* Content */}
      <div className="contact-wrapper">
        <div className="contact-info">
          <h2>ElectroMart Support</h2>

          <div className="info-item">
            <FontAwesomeIcon icon={faHeadset} />
            <div>
              <h4>Customer Support</h4>
              <p>Mon–Sat | 9:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div className="info-item">
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <h4>Call Us</h4>
              <p>0804 584 5678</p>
            </div>
          </div>

          <div className="info-item">
            <FontAwesomeIcon icon={faEnvelope} />
            <div>
              <h4>Email</h4>
              <p>support@electromart.com</p>
            </div>
          </div>

          <div className="info-item">
            <FontAwesomeIcon icon={faLocationDot} />
            <div>
              <h4>Store Location</h4>
              <p>Ahmedabad, Gujarat, India</p>
            </div>
          </div>

          <div className="support-note">
            <strong>Fast Support:</strong>  
            Most queries resolved within 24 hours.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
