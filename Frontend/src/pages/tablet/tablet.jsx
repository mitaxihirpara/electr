import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./tablet.css";

const TabletCatalog = () => {
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/tablets") // backend endpoint
      .then((res) => res.json())
      .then((data) => {
        setTablets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 className="loading-text">Loading Tablets...</h2>;
  }

  return (
    <div className="tablet-page">
      <h1 className="tablet-title">Tablets</h1>

      <div className="products-grid">
        {tablets.length > 0 ? (
          tablets.map((tablet) => (
            <ProductCard key={tablet.id} product={tablet} />
          ))
        ) : (
          <p>No tablets available</p>
        )}
      </div>
    </div>
  );
};

export default TabletCatalog;
