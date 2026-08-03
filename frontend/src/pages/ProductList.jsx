import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    api.get(`/products?${params.toString()}`).then((res) => {
      setProducts(res.data.products);
      setPages(res.data.pages);
      setLoading(false);
    });
  }, [category, page, sort, keyword]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="container page">
      <div className="section-title">
        <h2>Product Catalog</h2>
      </div>

      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <form
          onSubmit={(e) => { e.preventDefault(); updateParam("keyword", keyword); }}
          style={{ display: "flex", gap: "0.5rem", flex: "1 1 260px" }}
        >
          <input
            placeholder="Search by name, SKU, description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ flex: 1, padding: "0.6rem 0.7rem", border: "1.5px solid var(--border)", borderRadius: "3px" }}
          />
          <button className="btn btn-primary btn-sm" type="submit">Search</button>
        </form>

        <select value={category} onChange={(e) => updateParam("category", e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">No products match your filters.</div>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "2rem", justifyContent: "center" }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline"}`}
              onClick={() => updateParam("page", p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
