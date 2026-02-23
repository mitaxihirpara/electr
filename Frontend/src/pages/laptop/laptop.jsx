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

  const groupedLaptops = laptops.reduce((acc, laptop) => {
  const sub = laptop.subcategory_name || "All Laptops";

  if (!acc[sub]) {
    acc[sub] = [];
  }

  acc[sub].push(laptop);
  return acc;
}, {});
  return (
    <div className="catalog-wrapper">
      {/* <h2>Laptops</h2> */}

      {Object.keys(groupedLaptops).map((sub) => (
        <div key={sub} className="subcategory-section">
          <h3 className="subcategory-title">{sub}</h3>

          <div className="catalog-grid">
            {groupedLaptops[sub].map((laptop) => (
              <ProductCard key={laptop.id} product={laptop} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};



export default LaptopCatalog;
