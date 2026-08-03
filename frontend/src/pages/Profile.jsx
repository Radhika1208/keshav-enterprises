import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/profile").then((res) => setForm({ ...res.data, address: res.data.address || {} }));
  }, []);

  if (!form) return <div className="container page">Loading...</div>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddressChange = (e) => setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await api.put("/auth/profile", { name: form.name, phone: form.phone, address: form.address });
      setMsg("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="form-page">
      <h2>My Profile</h2>
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-group"><label>Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
        <div className="form-group"><label>Email</label><input value={form.email} disabled /></div>
        <div className="form-group"><label>Phone</label><input name="phone" value={form.phone || ""} onChange={handleChange} /></div>
        <div className="form-group"><label>Address line 1</label><input name="line1" value={form.address.line1 || ""} onChange={handleAddressChange} /></div>
        <div className="form-row">
          <div className="form-group"><label>City</label><input name="city" value={form.address.city || ""} onChange={handleAddressChange} /></div>
          <div className="form-group"><label>Pincode</label><input name="pincode" value={form.address.pincode || ""} onChange={handleAddressChange} /></div>
        </div>
        <button className="btn btn-primary btn-block" type="submit">Save changes</button>
      </form>
    </div>
  );
}
