import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./tvcatelog.css";

const TvCatelog = () => {
  const [tvs, setTvs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/tvs")
      .then(res => res.json())
      .then(data => setTvs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Televisions</h2>

      <div className="catalog-grid">
        {tvs.map(tv => (
          <ProductCard key={tv.id} product={tv} />
        ))}
      </div>
    </div>
  );
};

export default TvCatelog;
