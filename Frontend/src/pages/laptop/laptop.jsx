import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./laptop.css";

const LaptopCatalog = () => {
  const [laptops, setLaptops] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/laptops")
      .then(res => res.json())
      .then(data => setLaptops(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Laptops</h2>

      <div className="catalog-grid">
        {laptops.map((laptop, index) => (
          <ProductCard key={laptop.id || index} product={laptop} />
        ))}
      </div>
    </div>
  );
};

export default LaptopCatalog;
