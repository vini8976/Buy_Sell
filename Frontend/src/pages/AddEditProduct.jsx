import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./AddEditProduct.css";

const AddEditProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    location: "",
    usedFrom: "",
    usedTo: "",
    distance: "",
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const productOptions = [
    "Cars",
    "Bikes",
    "Mobiles",
    "Laptops",
    "Furniture",
    "Clothing",
    "Books",
    "Appliances",
    "Accessories",
    "Real Estate",
    "Sports Equipment",
    "Toys",
  ];

  const isTransport = form.name === "Cars" || form.name === "Bikes";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      if (key === "distance" && !isTransport) continue;
      formData.append(key, form[key]);
    }
    formData.append("image", image);

    try {
      await API.post("/products", formData);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <select
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      >
        <option value="">Select Product Type</option>
        {productOptions.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <input
        placeholder="Brand Name"
        name="category"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      />

      <input
        placeholder="Price"
        name="price"
        type="number"
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        required
      />

      <input
        placeholder="Location"
        name="location"
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />

      <label>Used From:</label>
      <input
        name="usedFrom"
        type="date"
        onChange={(e) => setForm({ ...form, usedFrom: e.target.value })}
        required
      />

      <label>Used To:</label>
      <input
        name="usedTo"
        type="date"
        onChange={(e) => setForm({ ...form, usedTo: e.target.value })}
        required
      />

      {isTransport && (
        <input
          placeholder="Distance Travelled (in km)"
          name="distance"
          type="number"
          onChange={(e) => setForm({ ...form, distance: e.target.value })}
          required
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddEditProduct;
