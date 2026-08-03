import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const { items, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: user?.name || "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = itemsPrice > 5000 ? 0 : 150;
  const tax = Math.round(itemsPrice * 0.18 * 100) / 100;
  const total = Math.round((itemsPrice + shipping + tax) * 100) / 100;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const orderPayload = {
        orderItems: items.map((i) => ({ product: i.product, name: i.name, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      };
      const { data: order } = await api.post("/orders", orderPayload);

      if (paymentMethod === "cod") {
        clearCart();
        navigate(`/orders/${order._id}`);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Could not load Razorpay checkout. Please check your connection and try again.");
        setLoading(false);
        return;
      }

      const { data: rpOrder } = await api.post("/payments/razorpay/order", { orderId: order._id });

      const rzp = new window.Razorpay({
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "Keshav Enterprises",
        description: `Order #${order._id}`,
        order_id: rpOrder.razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post("/payments/razorpay/verify", {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/orders/${order._id}`);
          } catch (err) {
            setError("Payment verification failed. Contact support with your order ID.");
          }
        },
        prefill: { name: address.fullName, contact: address.phone, email: user?.email },
        theme: { color: "#0B3D3A" },
      });
      rzp.on("payment.failed", () => setError("Payment failed. You can retry from My Orders."));
      rzp.open();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="container page"><div className="empty-state">Your cart is empty.</div></div>;
  }

  return (
    <div className="container page">
      <h2>Checkout</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem" }}>
        <form onSubmit={placeOrder} className="form-page" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: "1rem" }}>Shipping Address</h3>
          <div className="form-group"><label>Full name</label><input name="fullName" required value={address.fullName} onChange={handleChange} /></div>
          <div className="form-group"><label>Phone</label><input name="phone" required value={address.phone} onChange={handleChange} /></div>
          <div className="form-group"><label>Address line 1</label><input name="line1" required value={address.line1} onChange={handleChange} /></div>
          <div className="form-group"><label>Address line 2</label><input name="line2" value={address.line2} onChange={handleChange} /></div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input name="city" required value={address.city} onChange={handleChange} /></div>
            <div className="form-group"><label>State</label><input name="state" required value={address.state} onChange={handleChange} /></div>
          </div>
          <div className="form-group"><label>Pincode</label><input name="pincode" required value={address.pincode} onChange={handleChange} /></div>

          <h3 style={{ margin: "1.2rem 0 0.6rem" }}>Payment Method</h3>
          <div className="form-group">
            <label style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontWeight: 400 }}>
              <input type="radio" name="pm" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
              Pay online (Razorpay - Cards / UPI / Netbanking)
            </label>
            <label style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontWeight: 400, marginTop: "0.4rem" }}>
              <input type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              Cash on Delivery
            </label>
          </div>

          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </button>
        </form>

        <div>
          <h3>Order Summary</h3>
          <div className="table-wrap">
            <table>
              <tbody>
                {items.map((i) => (
                  <tr key={i.product}><td>{i.name} × {i.qty}</td><td>₹{(i.price * i.qty).toFixed(2)}</td></tr>
                ))}
                <tr><td>Subtotal</td><td>₹{itemsPrice.toFixed(2)}</td></tr>
                <tr><td>Shipping</td><td>{shipping === 0 ? "Free" : `₹${shipping}`}</td></tr>
                <tr><td>GST (18%)</td><td>₹{tax.toFixed(2)}</td></tr>
                <tr><td><strong>Total</strong></td><td><strong>₹{total.toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
