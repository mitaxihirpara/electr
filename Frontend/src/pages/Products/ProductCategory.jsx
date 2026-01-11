import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductCategory.css";

const mobileProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop",
    price: "₹1,34,900"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop",
    price: "₹79,999"
  },
  {
    id: 3,
    name: "OnePlus 12",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop",
    price: "₹64,999"
  },
  {
    id: 4,
    name: "Xiaomi 14 Pro",
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&h=200&fit=crop",
    price: "₹74,999"
  },
  {
    id: 5,
    name: "Google Pixel 8",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop",
    price: "₹75,999"
  },
  {
    id: 6,
    name: "Realme GT 5 Pro",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop",
    price: "₹49,999"
  },
  {
    id: 7,
    name: "Vivo X100 Pro",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop",
    price: "₹89,999"
  },
  {
    id: 8,
    name: "Oppo Find X7",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop",
    price: "₹69,999"
  }
];

const categoryInfo = {
  mobiles: {
    name: "Mobiles",
    description: "Discover the latest smartphones with cutting-edge technology and features"
  },
  laptops: {
    name: "Laptops",
    description: "High-performance laptops for work, gaming, and creativity"
  },
  televisions: {
    name: "Televisions",
    description: "Experience entertainment like never before with our range of smart TVs"
  },
  "washing-machine": {
    name: "Washing Machines",
    description: "Efficient and feature-rich washing machines for your home"
  },
  earbuds: {
    name: "Earbuds",
    description: "Wireless earbuds with superior sound quality and comfort"
  },
  tablet: {
    name: "Tablets",
    description: "Portable tablets perfect for work, entertainment, and creativity"
  },
  "air-conditioner": {
    name: "Air Conditioners",
    description: "Stay cool with energy-efficient air conditioning solutions"
  },
  "small-appliances": {
    name: "Small Appliances",
    description: "Essential kitchen and home appliances for everyday convenience"
  },
  camera: {
    name: "Cameras",
    description: "Capture life's moments with professional and consumer cameras"
  },
  refrigerator: {
    name: "Refrigerators",
    description: "Keep your food fresh with our range of modern refrigerators"
  },
  computer: {
    name: "Computers",
    description: "Desktop computers and workstations for all your computing needs"
  },
  "smart-watch": {
    name: "Smart Watches",
    description: "Stay connected and track your fitness with smart wearable devices"
  },
  speakers: {
    name: "Speakers",
    description: "Premium audio speakers for immersive sound experiences"
  },
  "gaming-console": {
    name: "Gaming Consoles",
    description: "Next-generation gaming consoles and accessories for gamers"
  }
};

const ProductCategory = () => {
  const { category } = useParams();
  const [showMobileCatalog, setShowMobileCatalog] = useState(false);
  const info = categoryInfo[category] || {
    name: "Products",
    description: "Browse our wide range of products"
  };

  const isMobileCategory = category === "mobiles";

  return (
    <div className="product-category-page">
      <div className="category-header">
        <h1>{info.name}</h1>
        <p>{info.description}</p>
        {isMobileCategory && (
          <button 
            className="show-catalog-btn"
            onClick={() => setShowMobileCatalog(!showMobileCatalog)}
          >
            {showMobileCatalog ? "Hide Catalog" : "View Mobile Catalog"}
          </button>
        )}
      </div>

      <div className="products-container">
        {isMobileCategory && showMobileCatalog ? (
          <div className="mobile-catalog">
            <h2 className="catalog-title">Popular Mobile Phones</h2>
            <div className="mobile-catalog-grid">
              {mobileProducts.map((mobile) => (
                <div key={mobile.id} className="mobile-catalog-item">
                  <div className="mobile-catalog-image">
                    <img src={mobile.image} alt={mobile.name} />
                  </div>
                  <div className="mobile-catalog-info">
                    <h4>{mobile.name}</h4>
                    <p className="mobile-catalog-price">{mobile.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-products-card">
            <div className="products-icon">
              📦
            </div>
            <h3>Products Coming Soon</h3>
            <p>We're working on adding amazing products in this category. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
