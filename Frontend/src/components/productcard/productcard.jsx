import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./productcard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const navigate = useNavigate();
  const userId = localStorage.getItem("customer_id");

  const handleBuyNow = () => {
  if (!userId) return alert("Please login first");

  navigate("/checkout", {
    state: {
      buyNowItem: {
        product_id: product.id,
        price: product.price,
        quantity: 1
      }
    }
  });
};
  const [liked, setLiked] = useState(false);

  // check if product is already in wishlist
  useEffect(() => {
  const fetchWishlistStatus = async () => {
    const customer_id = localStorage.getItem("customer_id");
    if (!customer_id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${customer_id}`);
      const items = await res.json();
      const isLiked = items.some(item => item.id === product.id);
      setLiked(isLiked);
    } catch (err) {
      console.error(err);
    }
  };
  fetchWishlistStatus();
}, [product.id]);   

  const handleToggleWishlist = async (productId) => {
    const customer_id = localStorage.getItem("customer_id");
  if (!customer_id) {
    alert("Please login first");
    return;
  }
   try {
    const res = await fetch("http://localhost:5000/api/wishlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id, product_id: productId }),
    });
    const data = await res.json();
    if (data.status === "added") setLiked(true);
    if (data.status === "removed") setLiked(false);
  } catch (err) {
    console.error("Wishlist toggle error:", err);
  }
};
   

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!userId) return alert("Please login first");

    await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: product.id }),
    });

    alert("Added to cart 🛒");
  };

  return (
    <div className="product-card" 
    // onClick={() => navigate(`/product/${product.id}`)}
    >
      <span className={`wishlist-icon ${liked ? "active" : ""}`} 
      onClick={(e) => {
      e.stopPropagation();
      //  setLiked(!liked); // 🚨 important
      handleToggleWishlist(product.id); // DB toggle
    }}
  >
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      </span>

      <div className="image-wrapper"
      onClick={() => navigate(`/product/${product.id}`)}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no_image.png";
          }}
        />
      </div>

      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>

      {/* <button className="add-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button> */}
      <div className="button-group">
  <button
    className="cart-btn"
    onClick={(e) => {
      handleAddToCart(e);
    }}
  >
    Add to Cart
  </button>

  { <button
    className="buy-btn"
    onClick={(e) => {
      e.stopPropagation();
      handleBuyNow();
    }}
  >
    Buy Now
  </button> }
 
</div>
    </div>
  );
};

export default ProductCard;

