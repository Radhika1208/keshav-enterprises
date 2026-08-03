import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNav from "./AdminNav";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  const load = () => {
    const q = filter ? `?status=${filter}` : "";
    api.get(`/orders${q}`).then((res) => setOrders(res.data));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="container page">
      <h2>Admin Dashboard</h2>
      <div className="admin-shell">
        <AdminNav />
        <div className="admin-content">
          <div className="section-title" style={{ margin: "0 0 1rem" }}>
            <h2 style={{ fontSize: "1.1rem" }}>Orders ({orders.length})</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Paid</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="sku">{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name}<br /><span style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>{o.user?.email}</span></td>
                    <td>₹{o.totalPrice.toFixed(2)}</td>
                    <td>{o.isPaid ? "Yes" : "No"}</td>
                    <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
                    <td>
                      <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
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
