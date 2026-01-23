import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./Refrigerator.css";

const RefrigeratorCatalog = () => {
  const [refrigerators, setRefrigerators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/refrigerators")
      .then(res => res.json())
      .then(data => {
        setRefrigerators(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 className="loading">Loading Refrigerators...</h2>;

  return (
    <div className="refrigerator-page">
      <h1>Refrigerators</h1>

      <div className="products-grid">
        {refrigerators.length > 0 ? (
          refrigerators.map(fridge => (
            <ProductCard key={fridge.id} product={fridge} />
          ))
        ) : (
          <p>No refrigerators available</p>
        )}
      </div>
    </div>
  );
};

export default RefrigeratorCatalog;
