import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNav from "./AdminNav";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data));
    api.get("/products?limit=1000").then((res) => setProducts(res.data.products));
  }, []);

  const revenue = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <div className="container page">
      <h2>Admin Dashboard</h2>
      <div className="admin-shell">
        <AdminNav />
        <div className="admin-content">
          <div className="stat-cards">
            <div className="stat-card"><strong>{orders.length}</strong><span>Total orders</span></div>
            <div className="stat-card"><strong>₹{revenue.toFixed(0)}</strong><span>Paid revenue</span></div>
            <div className="stat-card"><strong>{pending}</strong><span>Pending orders</span></div>
            <div className="stat-card"><strong>{products.length}</strong><span>Active products</span></div>
            <div className="stat-card"><strong>{lowStock}</strong><span>Low stock (&lt;20 units)</span></div>
          </div>

          <h3>Recent Orders</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o._id}>
                    <td className="sku">{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name}</td>
                    <td>₹{o.totalPrice.toFixed(2)}</td>
                    <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
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
