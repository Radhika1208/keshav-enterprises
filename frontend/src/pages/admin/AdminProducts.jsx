import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminNav from "./AdminNav";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/products?limit=1000").then((res) => { setProducts(res.data.products); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="container page">
      <h2>Admin Dashboard</h2>
      <div className="admin-shell">
        <AdminNav />
        <div className="admin-content">
          <div className="section-title" style={{ margin: "0 0 1rem" }}>
            <h2 style={{ fontSize: "1.1rem" }}>Products ({products.length})</h2>
            <Link to="/admin/products/new" className="btn btn-primary btn-sm">+ Add Product</Link>
          </div>
          {loading ? <p>Loading...</p> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="sku">{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.category?.name}</td>
                      <td>₹{p.price}</td>
                      <td style={{ color: p.stock < 20 ? "var(--danger)" : "inherit" }}>{p.stock}</td>
                      <td style={{ display: "flex", gap: "0.4rem" }}>
                        <Link to={`/admin/products/${p._id}`} className="btn btn-sm btn-outline">Edit</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Deactivate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
