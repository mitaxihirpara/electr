import { useState, useEffect } from "react";
import "./AddProduct.css";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    subcategory_id: "",
    brand: "",
    stock: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setForm({
      ...form,
      category_id: id,
      subcategory_id: "" // reset subcategory
    });

    fetch(`http://localhost:5000/subcategories/${id}`)
      .then(res => res.json())
      .then(data => setSubCategories(data))
      .catch(err => console.log(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   console.log("Form state:", form);
   console.log("Image:", image);

    // Validation
    if (!form.name || !form.price || !form.category_id || !form.subcategory_id || !form.stock || !image) {
      alert("Please fill all fields");
      return;
    }

    const stockValue = Number(form.stock);
    if (stockValue < 1 || stockValue > 1000) {
      alert("Stock must be between 1 and 1000");
      return;
    }

    // Create FormData
    const formData = new FormData();
    // Object.keys(form).forEach(key => formData.append(key, form[key]));
    // formData.append("image", image);
    formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("brand", form.brand);
      // formData.append("category", form.category);       // string name
      formData.append("category_id", form.category_id); // numeric id
      formData.append("subcategory_id", form.subcategory_id);
      formData.append("image", image);

    // Debug: log FormData
    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0], ":", pair[1]);
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/admin/add-product", {
        method: "POST",
        body: formData
      });

      console.log("Response status:", res.status);

      const result = await res.json();
      console.log("Response JSON:", result);

      if (!res.ok) {
        alert(result.message || "Failed to add product");
        return;
      }

      alert(result.message || "Product added successfully");

      setForm({
        name: "",
        price: "",
        category_id: "",
        subcategory_id: "",
        brand: "",
        stock: ""
      });
      setImage(null);
      setSubCategories([]);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Something went wrong. Check console for details.");
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
          <input name="name" value={form.name} onChange={handleChange} placeholder="Enter product name" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Brand</label>
          <select name="brand" value={form.brand} onChange={handleChange} >
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

        {/* <div className="form-group">
          <label>Category</label> */}
          {/* <select name="category" value={form.category} onChange={handleChange}>
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
            <option value="ac">Air Conditioner</option> */}
            {/* <option value="camera">Camera</option>
            <option value="computer">Computer</option>
            <option value="gamingconsole">Gaming Console</option>
          </select>
        </div> */}

        <div className="form-group">
          <label>Category</label>
          <select value={form.category_id} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sub Category</label>
          <select name="subcategory_id" value={form.subcategory_id} onChange={handleChange} disabled={!subCategories.length} required>
            <option value="">Select Sub Category</option>
            {subCategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        </div>

        <button disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
      </form>
    </div>
  );
};

export default AddProduct;
