import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/productcard/productcard";
import "./BrandProducts.css"

const BrandProducts = () => {
  const { brand } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/brand/${brand}`)
      .then(res => res.json())
      .then(data => {
        const grouped = {};
        data.forEach(p => {
          if (!grouped[p.category]) {
            grouped[p.category] = [];
          }
          grouped[p.category].push(p);
        });
        setProducts(grouped);
      });
  }, [brand]);

  return (
   <div className="brand-page">
      <h2>{brand} Products</h2>

      {Object.keys(products).map(category => (
        <div key={category} className="category-section">
          <h3>{category.toUpperCase()}</h3>

          <div className="product-row">
            {products[category].map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandProducts;
