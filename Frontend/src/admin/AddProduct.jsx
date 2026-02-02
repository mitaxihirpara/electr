import { useState } from "react";
import "./AddProduct.css";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: ""
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


     const stockValue = Number(form.stock);


  if (stockValue < 1 || stockValue > 1000) {
    alert("Stock must be between 1 and 1000");
    return;
  }
    if (!form.name || !form.price || !form.category || !form.brand || !form.stock || !image) {
      alert("Please fill all fields");
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    data.append("image", image);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/admin/add-product", {
        method: "POST",
        body: data
      });

      const result = await res.json();
      alert(result.message);

      setForm({ name: "", price: "", category: "", stock: "" });
      setImage(null);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
        <label>Brand</label>
        <select name="brand" value={form.brand} onChange={handleChange}>
          <option value="">Select Brand</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="LG">LG</option>
          <option value="Sony">Sony</option>
          <option value="Dell">Dell</option>
          <option value="HP">HP</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Asus">Asus</option>
          <option value="OnePlus">OnePlus</option>
          <option value="Oppo">Oppo</option>
          <option value="Vivo">Vivo</option>
        </select>
      </div>


        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="mobile">Mobile</option>
            <option value="tv">TV</option>
            <option value="laptop">Laptop</option>
            <option value="smallappliance">Small Appliance</option>
            <option value="tablet">Tablet</option>
            <option value="washingmachine">Washing Machine</option>
            <option value="smartwatch">Smart Watch</option>
            <option value="earbuds">Earbuds</option>
            <option value="refrigerator">Refrigerator</option>
            <option value="ac">Air Conditioner</option>
            <option value="camera">Camera</option>
            <option value="computer">Computer</option>
            <option value="gamingconsole">Gaming Console</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <button disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
