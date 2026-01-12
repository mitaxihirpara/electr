import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Admin Products</h2>

      {products.map(p => (
        <div key={p.id}>
          <p>Name: {p.name}</p>
          <p>Price: ₹{p.price}</p>
          <p>Stock: {p.stock}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;
