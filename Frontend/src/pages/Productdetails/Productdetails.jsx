import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Productdetails.css";
import Feedback from "../../components/feedback/feedback";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <h2 className="loading">Loading...</h2>;

  return (
    <>
      <div className="details-page">
        <div className="details-container">

          {/* LEFT IMAGE */}
          <div className="details-image">
            <img src={product.image} alt={product.name} />
          </div>

          {/* RIGHT INFO */}
          <div className="details-info">

            <h1 className="product-title">{product.name}</h1>

            <div className="price-section">
              <span className="price">₹{product.price}</span>
              <span className="tax">Inclusive of all taxes</span>
            </div>

            <div className="short-desc">
              <p>{product.description}</p>
            </div>

            {/* STOCK STATUS */}
            <div className="stock">
              <span className="in-stock">✔ In Stock</span>
            </div>

            {/* BUTTONS */}
            <div className="action-row">
              <button
                className="add-cart"
                onClick={async () => {
                  const userId = localStorage.getItem("customer_id");
                  if (!userId) {
                    alert("Please login first");
                    return;
                  }

                  await fetch("http://127.0.0.1:5000/api/cart/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      user_id: userId,
                      product_id: product.id,
                    }),
                  });

                  alert("Added to cart 🛒");
                }}
              >
                Add to Cart
              </button>

              <button
                className="buy-now"
                onClick={() => {
                  navigate("/checkout", {
                    state: {
                      buyNowItem: {
                        product_id: product.id,
                        price: product.price,
                        quantity: 1
                      }
                    }
                  });
                }}
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* EXTRA DETAILS SECTION */}
        <div className="extra-details">
          <h2>Product Details</h2>
          <p>{product.description}</p>
        </div>

      {/* </div> */}

    {/* REVIEW SECTION */}
        <div className="review-section">
          <Feedback productId={id} />
        </div>
{/* </div> */}
</div> 

    </>
  );
};

export default ProductDetails;