import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Productdetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="details-container">
      {/* LEFT IMAGE */}
      <div className="details-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* RIGHT INFO */}
      <div className="details-info">
    <h1 className="product-title">{product.name}</h1>

    <div className="price-row">
      <span className="price">₹{product.price}</span>
      <span className="tax">inclusive of all taxes</span>
    </div>

    <p className="description">{product.description}</p>

    <div className="action-row">
      <button className="add-cart">Add to Cart</button>
    </div>
  </div>
   </div>
  );
};

export default ProductDetails;
