"use client"

import { useState } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"
import LocationPicker from "../components/LocationPicker"
import "./AddEditProduct.css"
import { toast } from "react-toastify"

const AddEditProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    usedFrom: "",
    usedTo: "",
    distance: "",
  })

  const [location, setLocation] = useState(null)
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

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
  ]

  const isTransport = form.name === "Cars" || form.name === "Bikes"

  const handleLocationSelect = (locationData) => {
    setLocation(locationData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!location) {
      toast.error("Please select a location on the map")
      return
    }

    const formData = new FormData()
    for (const key in form) {
      if (key === "distance" && !isTransport) continue
      formData.append(key, form[key])
    }

    // Add location data as JSON string
    formData.append("locationData", JSON.stringify(location))

    formData.append("image", image)

    try {
      await API.post("/products", formData)
      toast.success("Product added successfully!")
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting form or uploading image")
      console.error("Error submitting form:", error)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <select name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required>
        <option value="">Select Product Type</option>
        {productOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
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

      <LocationPicker onLocationSelect={handleLocationSelect} />

      <label>Used From:</label>
      <input name="usedFrom" type="date" onChange={(e) => setForm({ ...form, usedFrom: e.target.value })} required />

      <label>Used To:</label>
      <input name="usedTo" type="date" onChange={(e) => setForm({ ...form, usedTo: e.target.value })} required />

      {isTransport && (
        <input
          placeholder="Distance Travelled (in km)"
          name="distance"
          type="number"
          onChange={(e) => setForm({ ...form, distance: e.target.value })}
          required
        />
      )}

      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

      <button type="submit">Submit</button>
    </form>
  )
}

export default AddEditProduct
