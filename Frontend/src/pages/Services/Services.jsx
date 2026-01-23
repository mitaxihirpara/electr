import "./services.css";

const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>

      <p className="intro">
        At <strong>ElectroMart</strong>, we go beyond selling products. Our
        services are designed to provide a smooth, reliable, and satisfying
        shopping experience.
      </p>

      <div className="service-box">
        <h2>🛒 Online Shopping</h2>
        <p>
          Browse and purchase the latest electronics including smartphones,
          smart TVs, laptops, and accessories from the comfort of your home.
        </p>
      </div>

      <div className="service-box">
        <h2>🚚 Fast & Secure Delivery</h2>
        <p>
          We ensure safe packaging and timely delivery of your products with
          real-time order tracking.
        </p>
      </div>

      <div className="service-box">
        <h2>🔒 Secure Payments</h2>
        <p>
          Multiple payment options with high-level security to keep your
          transactions safe and hassle-free.
        </p>
      </div>

      <div className="service-box">
        <h2>🔁 Easy Returns</h2>
        <p>
          Simple and transparent return policy to make sure you shop with
          confidence.
        </p>
      </div>

      <div className="service-box">
        <h2>📞 Customer Support</h2>
        <p>
          Our support team is always ready to help you with orders, returns, and
          product-related queries.
        </p>
      </div>

      <div className="service-box">
        <h2>🛠 Product Support & Warranty</h2>
        <p>
          All products come with manufacturer warranty and after-sales support.
        </p>
      </div>
    </div>
  );
};

export default Services;

