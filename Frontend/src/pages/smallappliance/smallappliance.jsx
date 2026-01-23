import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./smallappliance.css";

const SmallApplianceCatalog = () => {
  const [appliances, setAppliances] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/smallappliances")
      .then(res => res.json())
      .then(data => setAppliances(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="small-appliance-page">
      <h2 className="page-title">Small Appliances</h2>

      <div className="small-appliance-grid">
        {appliances.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default SmallApplianceCatalog;
