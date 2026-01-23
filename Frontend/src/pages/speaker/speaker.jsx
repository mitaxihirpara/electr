import { useEffect, useState } from "react";
import ProductCard from "../../components/productcard/productcard";
import "./speaker.css";

const SpeakerCatalog = () => {
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/speakers")
      .then(res => res.json())
      .then(data => setSpeakers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="speaker-page">
      <h2 className="page-title">Speakers</h2>

      <div className="speaker-grid">
        {speakers.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default SpeakerCatalog;
