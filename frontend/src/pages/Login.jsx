import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Sign in</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-group"><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="form-group"><label>Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? "Signing in..." : "Sign in"}</button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        New here? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>Create an account</Link>
      </p>
      <p style={{ fontSize: "0.75rem", color: "var(--ink-soft)", marginTop: "0.6rem" }}>
        Admin demo: admin@keshaventerprises.com / Admin@12345 (after running the seeder)
      </p>
    </div>
  );
}
