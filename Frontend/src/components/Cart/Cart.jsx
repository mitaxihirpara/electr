import { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const customerId = localStorage.getItem("customer_id");

    if (!customerId) {
  return <h3>Please login to view cart</h3>;
}

  useEffect(() => {
   fetch(`http://localhost:5000/api/cart/${customerId}`)
      .then(res => res.json())
      .then(data => setCart(data));
  }, []);

  return (
    <div>
      <h2>My Cart</h2>

      {cart.map(item => (
        <div key={item.id}>
          <img src={item.image} width="80" />
          <h4>{item.name}</h4>
          <p>₹{item.price}</p>
          <p>Qty: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default Cart;
