import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Productdetails.css";
import Feedback from "../../components/feedback/feedback";


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
              <button type="button"
          className="add-cart"
          onClick={async () => {
            const userId = localStorage.getItem("customer_id");
            if (!userId) {
              alert("Please login first");
              return;
            }

            // await fetch("http://localhost:5000/api/cart/add", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({
            //     user_id: userId,
            //     product_id: product.id,
            //   }),
            // });

            try {
              const res = await fetch("http://127.0.0.1:5000/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: userId,
                  product_id: product.id,
                }),
              });

              const data = await res.json();
              console.log(data);

            } catch (err) {
              console.error("FETCH ERROR 👉", err);
            }

            alert("Added to cart 🛒");
                 }}
            >
              Add to Cart
            </button>

    </div>
  </div>
     <Feedback productId={id} />
   </div>


  );
};




export default ProductDetails;
