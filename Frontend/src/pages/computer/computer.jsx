import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./computer.css";

const ComputerCatalog = () => {
  const [computers, setComputers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/computers")
      .then(res => res.json())
      .then(data => setComputers(data))
      .catch(err => console.error(err));
  }, []);
const groupedComputers = computers.reduce((acc, computer) => {
  const sub = computer.subcategory_name || "All Computers";

  if (!acc[sub]) {
    acc[sub] = [];
  }

  acc[sub].push(computer);
  return acc;
}, {});

 return (
    <div className="catalog-wrapper">
      <h2>Computers</h2>

      {Object.keys(groupedComputers).map((sub) => (
        <div key={sub} className="subcategory-section">
          <h3 className="subcategory-title">{sub}</h3>

          <div className="catalog-grid">
            {groupedComputers[sub].map((computer) => (
              <ProductCard key={computer.id} product={computer} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default ComputerCatalog;
