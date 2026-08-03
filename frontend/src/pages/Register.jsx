import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h2>Create a trade account</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-group"><label>Full name</label><input name="name" required value={form.name} onChange={handleChange} /></div>
        <div className="form-group"><label>Email</label><input type="email" name="email" required value={form.email} onChange={handleChange} /></div>
        <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} /></div>
        <div className="form-group"><label>Password</label><input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} /></div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">{loading ? "Creating..." : "Create account"}</button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}
