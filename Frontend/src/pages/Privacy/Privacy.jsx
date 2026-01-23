import "./privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="updated-date">Last updated: January 2026</p>

        <section>
          <p>
            At <strong>ElectroMart</strong>, we value your privacy and are committed
            to protecting your personal information. This Privacy Policy explains
            how we collect, use, and safeguard your data when you use our website.
          </p>
        </section>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address,
            phone number, shipping address, and payment details when you place an
            order or create an account.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process orders and payments</li>
            <li>To deliver products and services</li>
            <li>To improve our website and user experience</li>
            <li>To communicate updates, offers, and support information</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Protection</h2>
          <p>
            We use industry-standard security measures to protect your personal
            data from unauthorized access, loss, or misuse.
          </p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            ElectroMart uses cookies to enhance your browsing experience. You can
            disable cookies in your browser settings at any time.
          </p>
        </section>

        <section>
          <h2>5. Sharing of Information</h2>
          <p>
            We do not sell or rent personal data. Information is shared only with
            trusted service providers such as payment gateways and delivery
            partners.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            information by contacting our support team.
          </p>
        </section>

        <section className="contact-box">
          <h3>Need Help?</h3>
          <p>Email: support@electromart.com</p>
          <p>Phone: +91 98765 434343</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
