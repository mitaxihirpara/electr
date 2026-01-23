import { useEffect, useState } from "react";
import "./mobilecatelog.css";
import ProductCard from "../components/productcard/productcard";

const MobileCatalog = () => {
  const [mobiles, setMobiles] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/mobiles")
    .then(res => res.json())
    .then(data => setMobiles(data))
    .catch(err => console.error(err));
}, []);


  return (
    <div className="catalog-wrapper">
      <h2>Mobiles</h2>

      <div className="catalog-grid">
        {mobiles.map((mobile) => (
          <ProductCard
            key={mobile.id} product={mobile} />
        
    ))}
      
      </div>
  </div>
  );
};

export default MobileCatalog;


