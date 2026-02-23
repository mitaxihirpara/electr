
import "./about.css";

const About = () => {
  return (
    <div className="about-wrapper">

      {/* HERO */}
      <section className="about-hero">
        <h1>About ElectroMart</h1>
        <p>
          Delivering innovation, quality, and trust in every electronic product.
        </p>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-main">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="electronics"
          />
        </div>

        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            ElectroMart is your trusted online electronics store offering
            smartphones, laptops, smart TVs, and accessories at competitive
            prices. Our platform ensures secure transactions and reliable
            delivery.
          </p>

          <div className="highlight-points">
            <div>✔ Genuine Products</div>
            <div>✔ Secure Payments</div>
            <div>✔ Fast Delivery</div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="about-strip">
        <div>1000+ Products</div>
        <div>5000+ Customers</div>
        <div>24/7 Support</div>
      </section>

    </div>
  );
};

export default About;