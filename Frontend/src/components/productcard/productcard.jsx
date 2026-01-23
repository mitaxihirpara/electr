import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./productcard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();


  //  image URL handling
   const imageSrc = product.image;
  // .startsWith("http")
  //   ? product.image
  //   : `http://localhost:5000/uploads/${product.image}`;

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      


      {/* Wishlist icon */}
      {/* <span className="wishlist-icon" onClick={() => setLiked(!liked)}> */}
      <span
        className="wishlist-icon"
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
      >
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      </span>

      {/* Product image */}
      <div className="image-wrapper">
        <img
          src={imageSrc}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no_image.png";
          }}
        />
      </div>

      {/* Product info */}
      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>

      {/* Buttons */}
      <div className="buttons">
        <button>Add to Cart</button>
        {/* <button>Wishlist</button> */}
      </div>

      {/* Optional: Stock info */}
      {/* {product.stock !== undefined && (
        <p className="stock">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
      )} */}
    </div>
  );
};

export default ProductCard;
