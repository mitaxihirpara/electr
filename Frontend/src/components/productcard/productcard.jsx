import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./productcard.css";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);


   const imageSrc = product.image?.startsWith("http")
    ? product.image
    : `http://localhost:5000/uploads/${product.image}`;

  return (
    <div className="product-card">

      {/* Wishlist icon */}
      <span
        className="wishlist-icon"
        onClick={() => setLiked(!liked)}
      >
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      </span>

      <img
        src={imageSrc}
        alt={product.name}
        style={{ width: "200px", border: "2px solid red" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/no_image.png";
        }}
      />

      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
