import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNav from "./AdminNav";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const load = () => api.get("/categories").then((res) => setCategories(res.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/categories", form);
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create category");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div className="container page">
      <h2>Admin Dashboard</h2>
      <div className="admin-shell">
        <AdminNav />
        <div className="admin-content">
          <h3>Categories</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit} style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <input placeholder="Category name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: "0.6rem", border: "1.5px solid var(--border)", borderRadius: "3px" }} />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: "0.6rem", border: "1.5px solid var(--border)", borderRadius: "3px", flex: 1 }} />
            <button className="btn btn-primary btn-sm" type="submit">Add Category</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th></th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td className="sku">{c.slug}</td>
                    <td>{c.description}</td>
                    <td><button className="btn btn-sm btn-danger" onClick={() => remove(c._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
