import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./ac.css";

const ACCatalog = () => {
  const [acs, setAcs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/airconditioners")
      .then(res => res.json())
      .then(data => setAcs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Air Conditioners</h2>

      <div className="catalog-grid">
        {acs.map((ac) => (
          <ProductCard key={ac.id} product={ac} />
        ))}
      </div>
    </div>
  );
};

export default ACCatalog;
