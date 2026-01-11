import React, { useRef, useState } from "react";
import "./Ads.css";
import assets from "../../assets/assets";

const AdCarousel = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ads = [
    assets.Ad4,
    assets.Ad3,
    assets.Ad1,
    assets.Ad2
  ];

  const scrollToIndex = (index) => {
    const width = carouselRef.current.firstChild.offsetWidth;
    carouselRef.current.scrollTo({ left: width * index, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const scrollLeft = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(currentIndex + 1, ads.length - 1);
    scrollToIndex(newIndex);
  };

  // Update dots on manual scroll (optional)
  const handleScroll = () => {
    const width = carouselRef.current.firstChild.offsetWidth;
    const index = Math.round(carouselRef.current.scrollLeft / width);
    setCurrentIndex(index);
  };

  return (
    <div className="ad-carousel-container">
      <button className="scroll-btn left" onClick={scrollLeft}>
        &#8249;
      </button>

      <div
        className="ad-carousel"
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {ads.map((ad, index) => (
          <div className="ad-item" key={index}>
            <img src={ad} alt={`Ad ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="scroll-btn right" onClick={scrollRight}>
        &#8250;
      </button>

      {/* Pagination Dots */}
      <div className="carousel-dots">
        {ads.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
