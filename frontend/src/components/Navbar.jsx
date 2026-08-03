import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalQty } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Keshav Enterprises
          <span className="tag">Surgical Instruments &amp; Disposables</span>
        </Link>
        <nav className="nav-links">
          <Link to="/products">Catalog</Link>
          <Link to="/cart">
            Cart{totalQty > 0 && <span className="cart-pill">{totalQty}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button
                className="btn btn-sm btn-outline"
                style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-accent">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
