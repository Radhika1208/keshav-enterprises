import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQty, removeItem, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Browse the catalog to add surgical instruments and disposables.</p>
          <Link to="/products" className="btn btn-primary">Browse Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h2>Shopping Cart</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.product}>
                <td>{i.name}</td>
                <td>₹{i.price} / {i.unit}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={i.stock}
                    value={i.qty}
                    onChange={(e) => updateQty(i.product, Math.max(1, Math.min(i.stock, Number(e.target.value))))}
                    style={{ width: "60px", padding: "0.4rem", border: "1.5px solid var(--border)", borderRadius: "3px" }}
                  />
                </td>
                <td>₹{(i.price * i.qty).toFixed(2)}</td>
                <td><button className="btn btn-sm btn-outline" onClick={() => removeItem(i.product)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
        <div style={{ width: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem", fontWeight: 600 }}>
            <span>Subtotal</span><span>₹{itemsPrice.toFixed(2)}</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>Shipping and 18% GST calculated at checkout.</p>
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate(user ? "/checkout" : "/login?redirect=/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
