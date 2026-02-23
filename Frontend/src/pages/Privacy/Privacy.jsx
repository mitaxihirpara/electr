
import "./privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">

        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <p className="updated-date">Last updated: January 2026</p>
          <p className="privacy-subtitle">
            At <strong>ElectroMart</strong>, your privacy and data security are our priority.
          </p>
        </div>

        <div className="privacy-card">
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information such as name, email address,
            phone number, shipping address, and payment details when you
            create an account or place an order.
          </p>
        </div>

        <div className="privacy-card">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process orders and payments</li>
            <li>To deliver products and services</li>
            <li>To improve website performance</li>
            <li>To send updates and support information</li>
          </ul>
        </div>

        <div className="privacy-card">
          <h2>3. Data Protection</h2>
          <p>
            We use secure servers, encryption technologies, and strict
            access controls to protect your personal data.
          </p>
        </div>

        <div className="privacy-card">
          <h2>4. Cookies</h2>
          <p>
            We use cookies to improve browsing experience and analyze
            website traffic. You can disable cookies in browser settings.
          </p>
        </div>

        <div className="privacy-card">
          <h2>5. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal data. Information is
            shared only with trusted payment gateways and delivery partners.
          </p>
        </div>

        <div className="privacy-card">
          <h2>6. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your data
            by contacting our support team.
          </p>
        </div>

        <div className="contact-box">
          <h3>Need Help?</h3>
          <p>Email: support@electromart.com</p>
          <p>Phone: +91 98765 434343</p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;
