import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <p className="loading">Loading...</p>;

  const isTransport = product.name === "Cars" || product.name === "Bikes";

  return (
    <div className="product-detail-container">
      <button className="back-btn" onClick={() => navigate("/")}>← Back to Products</button>

      <div className="product-card">
        <img className="product-detail-image" src={product.image} alt={product.name} />

        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p><strong>Brand:</strong> {product.category}</p>
          <p><strong>Location:</strong> {product.location}</p>
          <p><strong>Condition:</strong> {product.condition}</p>
          <p><strong>Price:</strong> ₹{product.price.toLocaleString()}</p>

          {isTransport ? (
            <p><strong>Distance Travelled:</strong> {product.distance.toLocaleString()} km</p>
          ) : (
            <>
              <p><strong>Used From:</strong> {new Date(product.usedFrom).toLocaleDateString()}</p>
              <p><strong>Used To:</strong> {new Date(product.usedTo).toLocaleDateString()}</p>
            </>
          )}

          {product.postedBy && (
            <>
              <p><strong>Seller:</strong> {product.postedBy.name}</p>
              <p><strong>Contact:</strong> +91-{product.postedBy.phone}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
