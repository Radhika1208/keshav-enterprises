import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products?featured=true&limit=8").then((res) => setFeatured(res.data.products));
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">Wholesale &amp; Institutional Supply</div>
          <h1>Surgical instruments and disposables, stocked and dispatched with precision.</h1>
          <p>
            Keshav Enterprises supplies hospitals, clinics and distributors with sterile
            disposables, reusable instruments and OT essentials — backed by verified stock
            and GST-compliant billing.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.8rem" }}>
            <Link to="/products" className="btn btn-accent">Browse Catalog</Link>
            <Link to="/register" className="btn btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              Create Trade Account
            </Link>
          </div>
          <div className="hero-stats">
            <div><strong>500+</strong><span>SKUs in stock</span></div>
            <div><strong>18%</strong><span>GST invoiced</span></div>
            <div><strong>24-48h</strong><span>Dispatch window</span></div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="section-title">
          <h2>Shop by Category</h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/products?category=${c._id}`}
              className="product-card"
              style={{ padding: "1.1rem" }}
            >
              <div className="sku">{c.slug}</div>
              <div className="product-name" style={{ minHeight: "auto" }}>{c.name}</div>
              <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", margin: 0 }}>{c.description}</p>
            </Link>
          ))}
        </div>

        {featured.length > 0 && (
          <>
            <div className="section-title">
              <h2>Featured Products</h2>
              <Link to="/products" className="view-all">View all &rarr;</Link>
            </div>
            <div className="grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
