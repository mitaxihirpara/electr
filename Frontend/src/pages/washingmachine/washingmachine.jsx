import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./washingmachine.css";

const WashingMachineCatalog = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/washingmachines")
      .then(res => res.json())
      .then(data => setMachines(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Washing Machines</h2>

      <div className="catalog-grid">
        {machines.map((machine, index) => (
          <ProductCard key={machine.id || index} product={machine} />
        ))}
      </div>
    </div>
  );
};

export default WashingMachineCatalog;
