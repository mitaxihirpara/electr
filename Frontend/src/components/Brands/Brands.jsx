import React from "react";
import "./Brands.css";
import assets from "../../assets/assets";

const brands = [
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Sony_logo.svg" },
  { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg" },
  { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
  { name: "OnePlus", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/OnePlus_logo.svg" },
  { name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Realme_logo.svg" },
  { name: "Vivo", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Vivo_Logo.svg" },
  { name: "Oppo", logo: <img src={assets.oppo}></img>},
  { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" },
  { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
  { name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Lenovo_logo_2015.svg" },
  { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" },
  { name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_Logo.svg" }
];


const BrandsBar = () => {
  return (
    <div className="brands-section">
      <h2>Top Brands</h2>

      <div className="brands-bar">
        {brands.map((brand, index) => (
          <div className="brand-card" key={index}>
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsBar;
