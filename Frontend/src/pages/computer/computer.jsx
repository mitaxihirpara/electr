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

  return (
    <div className="computer-page">
      <h2 className="page-title">Desktop Computers</h2>

      <div className="computer-grid">
        {computers.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ComputerCatalog;
