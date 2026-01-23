import "./cancellation.css";

const CancellationReturns= () => {
  return (
    <div className="policy-container">
      <h1>Cancellation & Returns Policy</h1>

      <p>
        At <strong>ElectroMart</strong>, customer satisfaction is our top priority.
      </p>

      <h3>Order Cancellation</h3>
      <ul>
        <li>Orders can be cancelled within 24 hours of placing the order.</li>
        <li>Once shipped, orders cannot be cancelled.</li>
        <li>Contact support with your Order ID.</li>
      </ul>

      <h3>Return Policy</h3>
      <ul>
        <li>Returns accepted within 7 days of delivery.</li>
        <li>Product must be unused and in original packaging.</li>
      </ul>

      <h3>Refund Process</h3>
      <p>
        Refunds are processed within 5–7 working days to the original payment
        method.
      </p>

      <h3>Contact Us</h3>
      <p>Email: support@electromart.com</p>
      <p>Phone: +91 98765 43210</p>
    </div>
  );
};

export default CancellationReturns;
