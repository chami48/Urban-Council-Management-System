// src/Components/Register/Register.js
import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav.js";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  // form state
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "user",
  });

  // who is currently logged in (to show role dropdown if admin)
  const [currentUser, setCurrentUser] = useState(null);

  // UI helpers
  const [error, setError] = useState("");
  const [pwdStrength, setPwdStrength] = useState("Too short");
  const [canSubmit, setCanSubmit] = useState(false);

  // --- helpers -------------------------------------------------------------

  // Name: only letters + spaces
  const onNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setUser((p) => ({ ...p, name: value }));
  };

  // Email: only letters, numbers, dot, @ while typing
  const onEmailChange = (e) => {
    const typed = e.target.value.replace(/[^A-Za-z0-9.@]/g, "");
    setUser((p) => ({ ...p, email: typed }));
  };

  // Email: validate format (still strict letters/digits/.@ from typing rule)
  const isEmailValid = (email) => {
    // must be letters/digits/dots/@ and look like x@y.z
    if (!/^[A-Za-z0-9.@]+$/.test(email)) return false;
    return /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z]{2,}$/.test(email);
  };

  // Password: live strength
  const onPasswordChange = (e) => {
    const value = e.target.value;
    setUser((p) => ({ ...p, password: value }));

    const lengthOK = value.length >= 8;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    if (!lengthOK) return setPwdStrength("Too short");
    const score = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
    if (score <= 1) setPwdStrength("Weak");
    else if (score === 2 || score === 3) setPwdStrength("Medium");
    else setPwdStrength("Strong");
  };

  // Address: letters, numbers, space, comma, dot, slash only
  const onAddressChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z0-9\s,./]/g, "");
    setUser((p) => ({ ...p, address: value }));
  };

  // Phone: allow only phone characters while typing (digits, +, spaces, -)
  const onPhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9+\s-]/g, "");
    setUser((p) => ({ ...p, phone: value }));
  };

  // Phone validation:
  // Accept either 10 digits starting with 0 (e.g., 07XXXXXXXX)
  // OR +94 followed by 9 digits (e.g., +947XXXXXXXX)
  const isPhoneValid = (phone) => {
    const digitsOnly = phone.replace(/[^\d+]/g, "");
    const slLocal = /^0\d{9}$/;       // 10 digits, starts with 0
    const slIntl = /^\+94\d{9}$/;     // +94 + 9 digits
    return slLocal.test(digitsOnly) || slIntl.test(digitsOnly);
  };

  // recompute submit enabled
  useEffect(() => {
    const ok =
      user.name.trim().length > 0 &&
      isEmailValid(user.email) &&
      user.password.length >= 8 &&
      user.address.trim().length > 0 &&
      isPhoneValid(user.phone);
    setCanSubmit(ok);
  }, [user]);

  // fetch session user to decide if we show the role dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/me", { withCredentials: true });
        setCurrentUser(res.data.user);
        // keep nav in sync (optional)
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch {
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
    })();
  }, []);

  // --- submit --------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // final guard
    if (!canSubmit) {
      return setError("Please fix validation errors before submitting.");
    }

    try {
      await axios.post("http://localhost:5000/users", {
        name: user.name.trim(),
        email: user.email.trim(),
        password: user.password,
        address: user.address.trim(),
        phone: user.phone.trim(),
        // only send role if current session user is admin
        role: currentUser?.role === "admin" ? user.role : undefined,
      });

      alert("User registered successfully!");
      navigate("/log");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      setError(msg);
    }
  };

  return (
    <>
      <Nav /> {/* Full width nav */}

      <div className="registration-container">
        <h2> User Registration</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name — letters + spaces only */}
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={user.name}
            onChange={onNameChange} // ⬅ filters non-letters/spaces
            required
            placeholder="Sanuk Hansana"
          />

          {/* Email — only letters/digits/./@ while typing + format check */}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text" // keep as text to allow custom character filtering
            value={user.email}
            onChange={onEmailChange} // ⬅ filters to [A-Za-z0-9.@]
            required
            placeholder="someone@example.com"
          />
          {!isEmailValid(user.email) && user.email !== "" && (
            <small style={{ color: "red" }}>Enter a valid email (letters/digits, "." and "@").</small>
          )}

          {/* Password — strength + minimum 8 */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={onPasswordChange}
            required
            placeholder="Minimum 8 characters"
          />
          
          {user.password.length > 0 && user.password.length < 8 && (
            <div style={{ color: "red" }}>Password must be at least 8 characters.</div>
          )}

          {/* Address — letters, numbers, space, comma, dot, slash */}
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={user.address}
            onChange={onAddressChange} // ⬅ filters to [A-Za-z0-9 ,./]
            required
            placeholder="123/4 Main St, Horana,Colombo"
          />

          {/* Phone — only phone characters while typing; validate LK formats */}
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            value={user.phone}
            onChange={onPhoneChange} // allows digits + + space -
            required
            placeholder="0712345678 or +94712345678"
          />
          {!isPhoneValid(user.phone) && user.phone !== "" && (
            <small style={{ color: "red" }}>
              Enter a valid Sri Lanka number (0XXXXXXXXX) or international (+94XXXXXXXXX).
            </small>
          )}

          {/* Role — visible only if current session user is admin */}
          {currentUser?.role === "admin" && (
            <>
              <label htmlFor="role">Role</label>
              <div className="select-group">
                <select
                  id="role"
                  name="role"
                  className="styled-select"
                  value={user.role}
                  onChange={(e) => setUser((p) => ({ ...p, role: e.target.value }))}
                >
                  
                  <option value="admin">Admin</option>
                  <option value="inventoryOfficer">Inventory Officer</option>
                  <option value="financeAssesmentOfficer">Finance & Assesment Officer</option>
                  <option value="hrManager">HR Manager</option>
                  <option value="permitLicence">Permit & Licence Officer</option>
                  <option value="announcementService">Announcements & Service Officer</option>
                 
                
                </select>
              </div>
            </>
          )}


          <button type="submit" disabled={!canSubmit}>
            Register
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <p>
          Already have an account? <Link to="/log">Login here</Link>
        </p>
      </div>
    </>
  );
}
