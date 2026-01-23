import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./camera.css";

const CameraCatalog = () => {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/cameras")
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="catalog-container">
      <h2>Cameras</h2>

      <div className="catalog-grid">
        {cameras.map(camera => (
          <ProductCard key={camera.id} product={camera} />
        ))}
      </div>
    </div>
  );
};

export default CameraCatalog;

