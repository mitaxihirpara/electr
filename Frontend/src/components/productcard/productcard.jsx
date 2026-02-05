// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
// import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
// import "./productcard.css";
// import { useNavigate } from "react-router-dom";

// const ProductCard = ({ product }) => {

// if (!product) return null; 

//   const [liked, setLiked] = useState(false);
//   const navigate = useNavigate();

  
//   const handleAddToCart = async () => {
//   const userId = localStorage.getItem("customer_id"); 


//   if (!userId) {
//     alert("Please login first");
//     return;
//   }

//   await fetch("http://localhost:5000/api/cart/add", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       user_id: userId,
//       product_id: product.id
//     })
//   });

//   alert("Added to cart 🛒");
// };

  
//    const imageSrc = product.image;

//   return (
//     <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      
//         <span
//         className="wishlist-icon"
//         onClick={(e) => {
//           e.stopPropagation();
//           setLiked(!liked);
//         }}
//       >
//         <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
//       </span>

//       {/* Product image */}
//       <div className="image-wrapper">
//         <img
//           src={imageSrc}
//           alt={product.name}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = "/no_image.png";
//           }}
//         />
//       </div>

//       {/* Product info */}
//       <h3>{product.name}</h3>
//       <p className="price">₹{product.price}</p>

//       {/* Buttons */}
//           <button
//         className="add-cart-btn"
//         onClick={(e) => {
//           e.stopPropagation();
//           handleAddToCart();
//         }}
//       >
//         Add to Cart
//       </button>



     
//     </div>
//   );
// };

// export default ProductCard;

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
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <span className={`wishlist-icon ${liked ? "active" : ""}`} 
      onClick={(e) => {
      e.stopPropagation();
      //  setLiked(!liked); // 🚨 important
      handleToggleWishlist(product.id); // DB toggle
    }}
  >
        <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      </span>

      <div className="image-wrapper">
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

      <button className="add-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

