import { useEffect, useState } from "react";
import "./AdminProducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all products
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // delete product
  // const handleDelete = (id) => {
  //   if (!window.confirm("Are you sure you want to delete this product?")) return;

  //   fetch(`http://localhost:5000/api/products/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then(() => {
  //       setProducts(products.filter(p => p.id !== id));
  //     })
  //     .catch(err => console.error(err));
  // };

  if (loading) return <p>Loading products...</p>;

  const toggleStatus = (id, currentStatus) => {
  fetch(`http://localhost:5000/api/products/${id}/status`, {
    method: "PUT",
  })
    .then(res => res.json())
    .then(() => {
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_active: !currentStatus } : p
      ));
    })
    .catch(err => console.error(err));
};

  return (
    <div className="admin-products">
      <h2>Admin - Products</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>
                <td>{product.is_active ? "Active" : "Inactive"}</td>
              
              <td>
                 <button
                    className={product.is_active ? "deactivate-btn" : "activate-btn"}
                    onClick={() => toggleStatus(product.id, product.is_active)}
                  >
                    {product.is_active ? "Deactivate" : "Activate"}
                  </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default AdminProducts;
