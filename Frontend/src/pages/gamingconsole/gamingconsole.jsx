import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./gamingconsole.css";

const GamingConsoleCatalog = () => {
  const [consoles, setConsoles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/gamingconsoles")
      .then(res => res.json())
      .then(data => setConsoles(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="gaming-console-page">
      <h2 className="page-title">Gaming Consoles</h2>

      <div className="gaming-console-grid">
        {consoles.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default GamingConsoleCatalog;
