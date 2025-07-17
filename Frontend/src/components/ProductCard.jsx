import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const isTransport = product.name === "Cars" || product.name === "Bikes";

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.category}
        className="product-img"
      />

      <div className="product-info">
        <div className="brand-distance-row">
          <span><strong>Brand:</strong> {product.category}</span>
          {isTransport && (
            <span><strong>Distance:</strong> {product.distance} km</span>
          )}
        </div>

        {!isTransport && (
          <p>
            <strong>Used From:</strong>{" "}
            {new Date(product.usedFrom).toLocaleDateString()}
          </p>
        )}

        <p><strong>Location:</strong> {product.location}</p>
        <p className="price">₹{product.price}</p>

        <div className="actions-row">
          <Link to={`/product/${product._id}`} className="view-btn">
            View
          </Link>
          <button className="cart-btn">🛒</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
