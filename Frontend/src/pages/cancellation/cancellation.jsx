
import "./cancellation.css";

const CancellationReturns = () => {
  return (
    <div className="policy-wrapper">
      <div className="policy-container">

        <h1 className="policy-title">Cancellation & Returns Policy</h1>
        <p className="policy-subtitle">
          At <strong>ElectroMart</strong>, your satisfaction is our priority.
        </p>

        <div className="policy-card">
          <h3>🛒 Order Cancellation</h3>
          <ul>
            <li>Orders can be cancelled within 24 hours of placing the order.</li>
            <li>Once shipped, orders cannot be cancelled.</li>
            <li>Contact support with your Order ID for assistance.</li>
          </ul>
        </div>

        <div className="policy-card">
          <h3>📦 Return Policy</h3>
          <ul>
            <li>Returns accepted within 7 days of delivery.</li>
            <li>Product must be unused and in original packaging.</li>
          </ul>
        </div>

        <div className="policy-card">
          <h3>💰 Refund Process</h3>
          <p>
            Refunds are processed within 5–7 working days to the original payment method.
          </p>
        </div>

        <div className="policy-card contact-card">
          <h3>📞 Contact Us</h3>
          <p>Email: support@electromart.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

      </div>
    </div>
  );
};

export default CancellationReturns;