import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="container page">Loading...</div>;

  return (
    <div className="container page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
        <div className="product-thumb" style={{ aspectRatio: "4/3", borderRadius: "3px", border: "1px solid var(--border)" }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : "No image available"}
        </div>

        <div>
          <span className="sku">{product.sku} · {product.category?.name}</span>
          <h1 style={{ fontSize: "1.6rem", marginTop: "0.4rem" }}>{product.name}</h1>
          <div className="badges" style={{ marginBottom: "0.8rem" }}>
            {product.isSterile && <span className="badge badge-sterile">Sterile</span>}
            {product.isReusable && <span className="badge badge-reusable">Reusable</span>}
          </div>

          <div className="price-row" style={{ marginBottom: "1rem" }}>
            <span className="price" style={{ fontSize: "1.6rem" }}>₹{product.price}</span>
            {product.mrp > product.price && <span className="mrp">₹{product.mrp}</span>}
            <span className="unit">/ {product.unit}</span>
          </div>

          <p style={{ color: "var(--ink-soft)" }}>{product.description}</p>

          {product.specifications?.length > 0 && (
            <div style={{ margin: "1rem 0" }}>
              <table style={{ width: "100%" }}>
                <tbody>
                  {product.specifications.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, width: "40%" }}>{s.key}</td>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p style={{ fontSize: "0.85rem", color: product.stock > 0 ? "var(--primary)" : "var(--danger)" }}>
            {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
          </p>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginTop: "1rem" }}>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              style={{ width: "70px", padding: "0.6rem", border: "1.5px solid var(--border)", borderRadius: "3px" }}
            />
            <button
              className="btn btn-primary"
              disabled={product.stock === 0}
              onClick={() => { addItem(product, qty); setAdded(true); }}
            >
              Add to Cart
            </button>
            <button className="btn btn-accent" disabled={product.stock === 0} onClick={() => { addItem(product, qty); navigate("/cart"); }}>
              Buy Now
            </button>
          </div>
          {added && <p className="alert alert-success" style={{ marginTop: "1rem" }}>Added to cart.</p>}
        </div>
      </div>
    </div>
  );
}
