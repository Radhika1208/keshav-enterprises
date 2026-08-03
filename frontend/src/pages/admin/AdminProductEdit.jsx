import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminNav from "./AdminNav";

const empty = {
  name: "", sku: "", description: "", category: "", brand: "Keshav Enterprises",
  price: "", mrp: "", unit: "piece", stock: "", images: "", isSterile: false, isReusable: true, isFeatured: false,
};

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    if (!isNew) {
      api.get(`/products/${id}`).then((res) => {
        const p = res.data;
        setForm({
          ...p,
          category: p.category?._id || p.category,
          images: (p.images || []).join(", "),
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
      images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    try {
      if (isNew) {
        await api.post("/products", payload);
      } else {
        await api.put(`/products/${id}`, payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="container page">
      <h2>Admin Dashboard</h2>
      <div className="admin-shell">
        <AdminNav />
        <div className="admin-content">
          <h3>{isNew ? "Add Product" : "Edit Product"}</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit} style={{ maxWidth: "560px" }}>
            <div className="form-row">
              <div className="form-group"><label>Name</label><input name="name" required value={form.name} onChange={handleChange} /></div>
              <div className="form-group"><label>SKU</label><input name="sku" required disabled={!isNew} value={form.sku} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label>Description</label><textarea name="description" rows={3} required value={form.description} onChange={handleChange} /></div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" required value={form.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Unit</label><input name="unit" value={form.unit} onChange={handleChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Price (₹)</label><input type="number" name="price" required min="0" value={form.price} onChange={handleChange} /></div>
              <div className="form-group"><label>MRP (₹)</label><input type="number" name="mrp" required min="0" value={form.mrp} onChange={handleChange} /></div>
              <div className="form-group"><label>Stock</label><input type="number" name="stock" required min="0" value={form.stock} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label>Image URLs (comma separated)</label><input name="images" value={form.images} onChange={handleChange} /></div>
            <div className="form-group" style={{ display: "flex", gap: "1.2rem" }}>
              <label style={{ fontWeight: 400, display: "flex", gap: "0.3rem" }}><input type="checkbox" name="isSterile" checked={form.isSterile} onChange={handleChange} /> Sterile</label>
              <label style={{ fontWeight: 400, display: "flex", gap: "0.3rem" }}><input type="checkbox" name="isReusable" checked={form.isReusable} onChange={handleChange} /> Reusable</label>
              <label style={{ fontWeight: 400, display: "flex", gap: "0.3rem" }}><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured</label>
            </div>
            <button className="btn btn-primary" type="submit">{isNew ? "Create Product" : "Save Changes"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
