import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./earbuds.css";

const EarbudsCatalog = () => {
  const [earbuds, setEarbuds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/earbuds")
      .then(res => res.json())
      .then(data => setEarbuds(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Earbuds</h2>

      <div className="catalog-grid">
        {earbuds.map((earbud, index) => (
          <ProductCard key={earbud.id || index} product={earbud} />
        ))}
      </div>
    </div>
  );
};

export default EarbudsCatalog;
