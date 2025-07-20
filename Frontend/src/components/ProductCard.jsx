"use client"

import { Link } from "react-router-dom"
import "./ProductCard.css"
import { FaShoppingCart } from "react-icons/fa"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import API from "../api/axios"
import { toast } from "react-toastify"

const ProductCard = ({ product, showDistance = false }) => {
  const { user } = useContext(AuthContext)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const isTransport = product.name === "Cars" || product.name === "Bikes"

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add products to cart")
      return
    }

    setIsAddingToCart(true)
    try {
      await API.post("/cart/add", { productId: product._id })
      toast.success("Product added to cart!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Format location display
  const getLocationDisplay = () => {
    if (product.location?.city && product.location?.state) {
      return `${product.location.city}, ${product.location.state}`
    }
    return product.location?.address || product.location || "Location not specified"
  }

  return (
    <div className="product-card">
      <img src={product.image || "/placeholder.svg"} alt={product.category} className="product-img" />

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="detail-row">
          <strong>Brand:</strong>
          <span>{product.category}</span>
        </div>

        {isTransport && (
          <div className="detail-row">
            <strong>Distance:</strong>
            <span>{product.distance} km</span>
          </div>
        )}

        {!isTransport && (
          <div className="detail-row">
            <strong>Used From:</strong>
            <span>{new Date(product.usedFrom).toLocaleDateString()}</span>
          </div>
        )}

        <div className="detail-row">
          <strong>Location:</strong>
          <span>{getLocationDisplay()}</span>
        </div>

        {showDistance && product.distanceFromUser && (
          <div className="distance-info">
            <strong>Distance from you:</strong>
            <span>{product.distanceFromUser} km</span>
          </div>
        )}

        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString()}</span>
        </div>

        <div className="actions-row">
          <Link to={`/product/${product._id}`} className="view-btn">
            View
          </Link>
          <button className="cart-btn" onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? "Adding..." : <FaShoppingCart />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
