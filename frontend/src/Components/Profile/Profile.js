// src/Components/Profile/Profile.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import Nav from "../Nav/Nav.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    role: "",
    password: "",          // new password (optional)
    confirmPassword: "",   // confirm (front-end only)
  });

  // Keep a snapshot for cancel confirm
  const editBaselineRef = useRef(null);
  const isDirty = useMemo(() => {
    if (mode !== "edit" || !editBaselineRef.current) return false;
    const base = editBaselineRef.current;
    return (
      base.name !== inputs.name ||
      base.email !== inputs.email ||
      base.address !== inputs.address ||
      base.phone !== inputs.phone ||
      inputs.password || inputs.confirmPassword
    );
  }, [mode, inputs]);

  // Toast helper
  const Toast = useMemo(
    () =>
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
      }),
    []
  );

  // Kick to login if not logged in
  useEffect(() => {
    if (!storedUser) navigate("/log");
  }, [storedUser, navigate]);

  // Load fresh profile once
  useEffect(() => {
    const fetchMe = async () => {
      if (!storedUser?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${storedUser._id}`,
          { withCredentials: true }
        );
        const u = res.data.user || {};
        setInputs((prev) => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
          address: u.address || "",
          phone: u.phone || "",
          role: u.role || "user",
          password: "",
          confirmPassword: "",
        }));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire("Oops", "Failed to load profile.", "error");
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

    // Basic guards
    if (!inputs.name.trim() || !inputs.email.trim()) {
      Swal.fire("Required", "Name and Email are required.", "warning");
      return;
    }
    if (inputs.phone && !/^[0-9+\-()\s]{6,}$/.test(inputs.phone)) {
      Swal.fire("Invalid phone", "Please enter a valid phone number.", "warning");
      return;
    }

    // If changing password, validate confirm (front-end only)
    const wantsPasswordChange = Boolean(inputs.password?.trim());
    if (wantsPasswordChange) {
      if (inputs.password.length < 8) {
        Swal.fire("Weak password", "Password must be at least 8 characters.", "warning");
        return;
      }
      if (inputs.password !== inputs.confirmPassword) {
        Swal.fire("Passwords don't match", "Please re-enter the same password.", "error");
        return;
      }
    }

    // Build payload (DO NOT send confirmPassword)
    const payload = {
      name: inputs.name.trim(),
      email: inputs.email.trim(),
      address: inputs.address.trim(),
      phone: inputs.phone.trim(),
    };
    if (wantsPasswordChange) {
      payload.password = inputs.password;
    }

    try {
      Swal.fire({
        title: "Saving…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.put(
        `http://localhost:5000/users/${storedUser._id}`,
        payload,
        { withCredentials: true }
      );

      const updated = res.data.user;

      // Update local storage (keep minimal user for nav/redirects)
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        })
      );

      // Clear password fields
      setInputs((p) => ({ ...p, password: "", confirmPassword: "" }));
      setMode("view");
      Swal.close();
      Toast.fire({ icon: "success", title: "Profile updated" });
    } catch (err) {
      Swal.close();
      const apiMsg = err?.response?.data?.message || "Update failed";
      Swal.fire("Error", apiMsg, "error");
    }
  };

  const onDelete = async () => {
    const res = await Swal.fire({
      title: "Delete your account?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!res.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.delete(`http://localhost:5000/users/${storedUser._id}`, {
        withCredentials: true,
      });

      Swal.close();
      await Swal.fire("Deleted", "Your account has been removed.", "success");
      localStorage.removeItem("user");
      navigate("/regi");
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", null, {
        withCredentials: true,
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("user");
      Toast.fire({ icon: "info", title: "Logged out" });
      navigate("/log", {
        replace: true,
        state: { alert: "You’ve been logged out." },
      });
    }
  };

  const startEdit = () => {
    setMode("edit");
    // snapshot current (without passwords)
    editBaselineRef.current = {
      name: inputs.name,
      email: inputs.email,
      address: inputs.address,
      phone: inputs.phone,
    };
  };

  const cancelEdit = async () => {
    if (isDirty) {
      const res = await Swal.fire({
        title: "Discard changes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Discard",
        cancelButtonText: "Keep editing",
      });
      if (!res.isConfirmed) return;
    }
    // clear password fields when cancel
    setInputs((p) => ({ ...p, password: "", confirmPassword: "" }));
    setMode("view");
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="profile-container">
          <div className="profile-card">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav /> {/* Full  width nav */}

    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <span className={`role-badge ${inputs.role === "admin" ? "admin" : "user"}`}>
            {inputs.role}
          </span>
        </div>

        {mode === "view" ? (
          <div className="profile-view">
            <div className="row"><label>Name</label><p>{inputs.name}</p></div>
            <div className="row"><label>Email</label><p>{inputs.email}</p></div>
            <div className="row"><label>Address</label><p>{inputs.address}</p></div>
            <div className="row"><label>Phone</label><p>{inputs.phone}</p></div>

            <div className="profile-actions">
              <button className="btn primary" onClick={startEdit}>Edit</button>
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

            {/* Password change section */}
            <div className="field">
              <label>New Password (optional)</label>
              <input
                name="password"
                type="password"
                value={inputs.password}
                onChange={onChange}
                placeholder="Leave blank to keep current"
              />
            </div>
            {inputs.password.trim() && (
              <div className="field">
                <label>Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={inputs.confirmPassword}
                  onChange={onChange}
                  placeholder="Re-enter the new password"
                  required
                />
              </div>
            )}

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
              <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
}
