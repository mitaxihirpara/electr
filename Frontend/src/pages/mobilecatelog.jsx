// import { useEffect, useState } from "react";
// import "./mobilecatelog.css";
// import ProductCard from "../components/productcard/productcard";

// const MobileCatalog = () => {
//   const [mobiles, setMobiles] = useState([]);

//   useEffect(() => {
//   fetch("http://localhost:5000/api/mobiles")
//     .then(res => res.json())
//     .then(data => setMobiles(data))
//     .catch(err => console.error(err));
// }, []);


//   return (
//     <div className="catalog-wrapper">
//       <h2>Mobiles</h2>

//       <div className="catalog-grid">
//         {mobiles.map((mobile) => (
//           <ProductCard
//             key={mobile.id} product={mobile} />
        
//     ))}
      
//       </div>
//   </div>
//   );
// };

// export default MobileCatalog;




import { useEffect, useState } from "react";
import "./mobilecatelog.css";
import ProductCard from "../components/productcard/productcard";

const MobileCatalog = () => {
  const [mobiles, setMobiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/mobiles")
      .then(res => res.json())
      .then(data => setMobiles(data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 Group by subcategory
  const groupedMobiles = mobiles.reduce((acc, mobile) => {
    const sub = mobile.subcategory_name || " Featured Mobiles";

    if (!acc[sub]) {
      acc[sub] = [];
    }

    acc[sub].push(mobile);
    return acc;
  }, []);

  return (
    <div className="catalog-wrapper">
      <h2>Mobiles</h2>

      {Object.keys(groupedMobiles).map((sub) => (
        <div key={sub} className="subcategory-section">
          <h3 className="subcategory-title">{sub}</h3>

          <div className="catalog-grid">
            {groupedMobiles[sub].map((mobile) => (
              <ProductCard key={mobile.id} product={mobile} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileCatalog;
