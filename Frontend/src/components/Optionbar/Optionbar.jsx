import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Optionbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreen, faLaptop,faTv,faSnowflake,
  faSoap,
  faHeadphones,
  faTabletScreenButton,
  faWind, faBlender,faCamera ,faDesktop,
  faClock,
  faVolumeHigh,
  faGamepad } from "@fortawesome/free-solid-svg-icons";

const laptopProducts = [
  {
    id: 1,
    name: "HP Pavilion 15",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
    price: "₹45,999"
  },
  {
    id: 2,
    name: "Dell Inspiron 14",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200&h=200&fit=crop",
    price: "₹52,990"
  },
  {
    id: 3,
    name: "Lenovo IdeaPad 3",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop",
    price: "₹38,999"
  },
  {
    id: 4,
    name: "ASUS VivoBook 15",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop",
    price: "₹42,990"
  },
  {
    id: 5,
    name: "Acer Aspire 5",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=200&h=200&fit=crop",
    price: "₹39,999"
  },
  {
    id: 6,
    name: "MacBook Air M2",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop",
    price: "₹99,900"
  }
];

const OptionBar = () => {
  const [showLaptopCatalog, setShowLaptopCatalog] = useState(false);

  return (
    <div className="option-bar">
      <ul className="option-list">
       <li>
          <Link to="/products/mobiles" className="option-item">
            <FontAwesomeIcon icon={faMobileScreen} />
            <span>Mobiles</span>
          </Link>
        </li>
        
       <li 
          className="laptop-menu-item"
          onMouseEnter={() => setShowLaptopCatalog(true)}
          onMouseLeave={() => setShowLaptopCatalog(false)}
        >
          <Link to="/products/laptops" className="option-item">
            <FontAwesomeIcon icon={faLaptop} />
            <span>Laptops</span>
          </Link>
          {showLaptopCatalog && (
            <div className="laptop-catalog-dropdown">
              <div className="catalog-header">
                <h3>Popular Laptops</h3>
                <Link to="/products/laptops" className="view-all-link">View All →</Link>
              </div>
              <div className="catalog-grid">
                {laptopProducts.map((laptop) => (
                  <Link 
                    key={laptop.id} 
                    to="/products/laptops" 
                    className="catalog-item"
                  >
                    <div className="catalog-image">
                      <img src={laptop.image} alt={laptop.name} />
                    </div>
                    <div className="catalog-info">
                      <h4>{laptop.name}</h4>
                      <p className="catalog-price">{laptop.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </li>
        <li>
          <Link to="/products/televisions" className="option-item">
            <FontAwesomeIcon icon={faTv} />
            <span>Televisions</span>
          </Link>
        </li>
        
        <li>
          <Link to="/products/washing-machine" className="option-item">
            <FontAwesomeIcon icon={faSoap} />
            <span>Washing Machine</span>
          </Link>
        </li>

        <li>
          <Link to="/products/earbuds" className="option-item">
            <FontAwesomeIcon icon={faHeadphones} />
            <span>Earbuds</span>
          </Link>
        </li>

        <li>
          <Link to="/products/tablet" className="option-item">
            <FontAwesomeIcon icon={faTabletScreenButton} />
            <span>Tablet</span>
          </Link>
        </li>

        <li>
          <Link to="/products/air-conditioner" className="option-item">
            <FontAwesomeIcon icon={faWind} />
            <span>Air Conditioner</span>
          </Link>
        </li>
         <li>
          <Link to="/products/small-appliances" className="option-item">
            <FontAwesomeIcon icon={faBlender} />
            <span>Small Appliances</span>
          </Link>
        </li>
        <li>
          <Link to="/products/camera" className="option-item">
            <FontAwesomeIcon icon={faCamera} />
            <span>Camera</span>
          </Link>
        </li>
        <li>
          <Link to="/products/refrigerator" className="option-item">
            <FontAwesomeIcon icon={faSnowflake} />
            <span>Refrigerator</span>
          </Link>
        </li>
        <li>
          <Link to="/products/computer" className="option-item">
            <FontAwesomeIcon icon={faDesktop} />
            <span>Computer</span>
          </Link>
        </li>
        <li>
          <Link to="/products/smart-watch" className="option-item">
            <FontAwesomeIcon icon={faClock} />
            <span>Smart Watch</span>
          </Link>
        </li>
        <li>
          <Link to="/products/speakers" className="option-item">
            <FontAwesomeIcon icon={faVolumeHigh} />
            <span>Speakers</span>
          </Link>
        </li>
        <li>
          <Link to="/products/gaming-console" className="option-item">
            <FontAwesomeIcon icon={faGamepad} />
            <span>Gaming Console</span>
          </Link>
        </li>
 
      </ul>
    </div>
  );
};

export default OptionBar;
