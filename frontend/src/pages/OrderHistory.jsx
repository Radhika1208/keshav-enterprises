import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine").then((res) => { setOrders(res.data); setLoading(false); });
  }, []);

  if (loading) return <div className="container page">Loading...</div>;

  return (
    <div className="container page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="sku">{o._id.slice(-8).toUpperCase()}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>₹{o.totalPrice.toFixed(2)}</td>
                  <td>{o.isPaid ? "Paid" : "Unpaid"}</td>
                  <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
                  <td><Link to={`/orders/${o._id}`} className="btn btn-sm btn-outline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
