import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-thumb">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          "No image"
        )}
      </div>
      <div className="product-body">
        <span className="sku">{product.sku}</span>
        <div className="product-name">{product.name}</div>
        <div className="badges">
          {product.isSterile && <span className="badge badge-sterile">Sterile</span>}
          {product.isReusable && <span className="badge badge-reusable">Reusable</span>}
        </div>
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {product.mrp > product.price && <span className="mrp">₹{product.mrp}</span>}
          <span className="unit">/ {product.unit}</span>
        </div>
      </div>
    </Link>
  );
}
