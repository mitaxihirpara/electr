import "./services.css";

const Services = () => {
  return (
    <div className="services-wrapper">

      {/* Header Section */}
      <section className="services-hero">
        <h1>Our Services</h1>
        <p>
          At <strong>ElectroMart</strong>, we provide reliable services that
          ensure a smooth and secure shopping experience for every customer.
        </p>
      </section>

      {/* Services Grid */}
      <section className="services-grid">

        <div className="service-card">
          <span className="icon">🛒</span>
          <h3>Online Shopping</h3>
          <p>
            Shop the latest smartphones, laptops, smart TVs, and accessories
            anytime from anywhere.
          </p>
        </div>

        <div className="service-card">
          <span className="icon">🚚</span>
          <h3>Fast Delivery</h3>
          <p>
            Safe packaging and timely delivery with real-time tracking.
          </p>
        </div>

        <div className="service-card">
          <span className="icon">🔒</span>
          <h3>Secure Payments</h3>
          <p>
            Multiple secure payment options with advanced protection.
          </p>
        </div>

        <div className="service-card">
          <span className="icon">🔁</span>
          <h3>Easy Returns</h3>
          <p>
            Transparent return policies to ensure stress-free shopping.
          </p>
        </div>

        <div className="service-card">
          <span className="icon">📞</span>
          <h3>Customer Support</h3>
          <p>
            Dedicated support team available to assist you anytime.
          </p>
        </div>

        <div className="service-card">
          <span className="icon">🛠</span>
          <h3>Warranty Support</h3>
          <p>
            Genuine products backed by manufacturer warranty.
          </p>
        </div>

      </section>

    </div>
  );
};

export default Services;