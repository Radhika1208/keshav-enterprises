import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <div className="container page">Loading...</div>;

  return (
    <div className="container page">
      <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
      <span className={`status-pill status-${order.status}`}>{order.status}</span>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem", marginTop: "1.5rem" }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
            <tbody>
              {order.orderItems.map((i, idx) => (
                <tr key={idx}><td>{i.name}</td><td>₹{i.price}</td><td>{i.qty}</td><td>₹{(i.price * i.qty).toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Shipping Address</h3>
          <p>
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}, {order.shippingAddress.line2}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            Phone: {order.shippingAddress.phone}
          </p>
          <h3>Payment</h3>
          <p>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"} — {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Unpaid"}</p>
          <h3>Total</h3>
          <table>
            <tbody>
              <tr><td>Items</td><td>₹{order.itemsPrice.toFixed(2)}</td></tr>
              <tr><td>Shipping</td><td>₹{order.shippingPrice.toFixed(2)}</td></tr>
              <tr><td>GST</td><td>₹{order.taxPrice.toFixed(2)}</td></tr>
              <tr><td><strong>Total</strong></td><td><strong>₹{order.totalPrice.toFixed(2)}</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
