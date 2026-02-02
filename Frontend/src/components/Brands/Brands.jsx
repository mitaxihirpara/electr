import React from "react";
import "./Brands.css";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";

const brands = [
   { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg" },
   { name: "Vivo", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Vivo_Logo.svg" },
  { name: "Oppo", logo: assets.oppo},
  { name: "OnePlus", logo: assets.oneplus},

  { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" },
  { name: "Samsung", logo: assets.samsung},
 
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
  { name: "Sony", logo: assets.sony},
  { name: "Lenovo", logo: assets.lenovo},
  { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" }


 
];


const BrandsBar = () => {
    const navigate = useNavigate();
  return (
    <div className="brands-section">
      <h2>Top Brands</h2>

      <div className="brands-bar">
        {brands.map((brand, index) => (
          <div className="brand-card" key={index}
          onClick={() => navigate(`/brand/${brand.name}`)}

          >
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsBar;
