import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./productcard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {

if (!product) return null; 

  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  
  const handleAddToCart = async () => {
  const userId = localStorage.getItem("customer_id"); 


  if (!userId) {
    alert("Please login first");
    return;
  }

  await fetch("http://localhost:5000/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      product_id: product.id
    })
  });

  alert("Added to cart 🛒");
};

  
   const imageSrc = product.image;

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      
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
          <button
        className="add-cart-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart();
        }}
      >
        Add to Cart
      </button>



     
    </div>
  );
};

export default ProductCard;
