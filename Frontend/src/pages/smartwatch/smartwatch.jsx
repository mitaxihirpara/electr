import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./smartwatch.css";

const SmartWatchCatalog = () => {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/smartwatches")
      .then(res => res.json())
      .then(data => setWatches(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Smart Watches</h2>

      <div className="catalog-grid">
        {watches.map((watch, index) => (
          <ProductCard key={watch.id || index} product={watch} />
        ))}
      </div>
    </div>
  );
};

export default SmartWatchCatalog;
