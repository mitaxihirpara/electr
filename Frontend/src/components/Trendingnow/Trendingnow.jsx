import React from "react";
import ProductCard from "../productcard/productcard";
import "./TrendingNow.css"; 

const TrendingNow = ({ products }) => {
  if (!Array.isArray(products)) {
    return <p style={{ padding: "20px" }}>No trending products</p>;
  }

  if (products.length === 0) {
    return <p style={{ padding: "20px" }}>Loading trending products...</p>;
  }

  return (
    <div className="trending-section">
      <h2 className="trending-title">Trending Now</h2>
      <div className="trending-row">
        {products.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default TrendingNow;
