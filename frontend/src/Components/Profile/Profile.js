// src/Components/Profile/Profile.js
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav.js';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  // Read the logged-in user from localStorage ONCE (stable reference)
  const [storedUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [mode, setMode] = useState("view"); // "view" | "edit"
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    name: "", email: "", password: "", address: "", phone: "", role: ""
  });

  // Kick to login if not logged in
  useEffect(() => {
    if (!storedUser) navigate("/log");
  }, [storedUser, navigate]);

  // Load fresh profile once
  useEffect(() => {
    const fetchMe = async () => {
      if (!storedUser?._id) return;
      try {
        //const res = await axios.get(`http://localhost:5000/users/${storedUser._id}`);
        const res = await axios.get(`http://localhost:5000/users/${storedUser._id}`, { withCredentials: true });

        const u = res.data.user || {};
        setInputs({
          name: u.name || "",
          email: u.email || "",
          password: "",             // do not prefill
          address: u.address || "",
          phone: u.phone || "",
          role: u.role || "user",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    };
    fetchMe();
  }, [storedUser?._id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      // Only send password if user typed one
      const payload = { ...inputs };
      if (!payload.password) delete payload.password;

      //const res = await axios.put(`http://localhost:5000/users/${storedUser._id}`, payload);
      const res = await axios.put(`http://localhost:5000/users/${storedUser._id}`, payload, { withCredentials: true });

      const updated = res.data.user;

      // Update local storage (keep minimal user for nav/redirects)
      localStorage.setItem("user", JSON.stringify({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      }));

      setInputs((p) => ({ ...p, password: "" })); // clear password box
      setMode("view");
      setMsg("Profile updated successfully.");
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setError(apiMsg || "Update failed");
    }
  };

  const onDelete = async () => {
    setError("");
    setMsg("");
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      //await axios.delete(`http://localhost:5000/users/${storedUser._id}`);
      await axios.delete(`http://localhost:5000/users/${storedUser._id}`, { withCredentials: true });

      localStorage.removeItem("user");
      navigate("/regi"); // or navigate("/")
    } catch (err) {
      setError("Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/log");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">Loading...</div>
      </div>
    );
  }

  return (

    <>
    <Nav />  {/* Full  width nav */}

    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <span className={`role-badge ${inputs.role === "admin" ? "admin" : "user"}`}>
            {inputs.role}
          </span>
        </div>

        {msg && <div className="notice success">{msg}</div>}
        {error && <div className="notice error">{error}</div>}

        {mode === "view" ? (
          <div className="profile-view">
            <div className="row"><label>Name</label><p>{inputs.name}</p></div>
            <div className="row"><label>Email</label><p>{inputs.email}</p></div>
            <div className="row"><label>Address</label><p>{inputs.address}</p></div>
            <div className="row"><label>Phone</label><p>{inputs.phone}</p></div>

            <div className="profile-actions">
              <button className="btn primary" onClick={() => setMode("edit")}>Edit</button>
              <button className="btn danger" onClick={onDelete}>Delete Account</button>
              <button className="btn" onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={onSave}>
            <div className="field">
              <label>Name</label>
              <input name="name" value={inputs.name} onChange={onChange} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" value={inputs.email} onChange={onChange} required />
            </div>
            <div className="field">
              <label>New Password (optional)</label>
              <input name="password" type="password" value={inputs.password} onChange={onChange} placeholder="Leave blank to keep current" />
            </div>
            <div className="field">
              <label>Address</label>
              <input name="address" value={inputs.address} onChange={onChange} required />
            </div>
            <div className="field">
              <label>Phone</label>
              <input name="phone" value={inputs.phone} onChange={onChange} required />
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn primary">Save</button>
              <button type="button" className="btn" onClick={() => { setMode("view"); setMsg(""); setError(""); }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
