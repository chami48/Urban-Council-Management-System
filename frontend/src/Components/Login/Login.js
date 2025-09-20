// src/Components/Login/Login.js
import React, { useState, useEffect, useRef } from "react";
import Nav from "../Nav/Nav.js";
import axios from "axios";
//import { useNavigate, useLocation } from "react-router-dom"; // ⬅️ add useLocation
import { useNavigate, useLocation, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();            // ⬅️ read route state
  const shownRef = useRef(false);            // ⬅️ prevent double alerts

  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  // 🔔 Show alert if ProtectedRoute sent one via state
  useEffect(() => {
    const msg = location.state?.alert;
    if (msg && !shownRef.current) {
      shownRef.current = true;
      window.alert(msg);                     // or render a banner instead
      // Clear the state so going back/forward doesn’t re-alert
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Only allow letters/numbers/dot/@ while typing
  const onEmailChange = (e) => {
    const filtered = e.target.value.replace(/[^A-Za-z0-9.@]/g, "");
    setInputs((prev) => ({ ...prev, email: filtered }));
  };

  // Basic email format check (after filtering)
  const isEmailValid = (email) =>
    /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z]{2,}$/.test(email);

  // Track password
  const onPasswordChange = (e) => {
    setInputs((prev) => ({ ...prev, password: e.target.value }));
  };

  // Enable submit only when valid
  useEffect(() => {
    const ok = isEmailValid(inputs.email) && inputs.password.length >= 8;
    setCanSubmit(ok);
  }, [inputs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;

    try {
      const res = await axios.post("http://localhost:5000/auth/login", inputs, {
        withCredentials: true, // if you’re using cookies for session
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin","inventoryOfficer") {
        navigate("/admin");

      } else {
        navigate("/mainhome");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <>
      <Nav /> {/* Full  width nav */}
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="user-form" noValidate>
          <label>Email:</label>
          <input
            type="text"                // keep text so we can filter characters
            name="email"
            value={inputs.email}
            onChange={onEmailChange}
            placeholder="e.g., someone@example.com"
            required
          />
          {inputs.email !== "" && !isEmailValid(inputs.email) && (
            <small style={{ color: "red" }}>
              Enter a valid email (letters/numbers, “.” and “@” only).
            </small>
          )}

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={inputs.password}
            onChange={onPasswordChange}
            placeholder="Minimum 8 characters"
            required
          />
          {inputs.password !== "" && inputs.password.length < 8 && (
            <small style={{ color: "red" }}>
              Password must be at least 8 characters.
            </small>
          )}


           <div style={{ marginTop: 12 }}>
             <span>Don’t have an account? </span>
             <Link to="/regi">Register here</Link>
           </div>



          <button type="submit" disabled={!canSubmit}>
            Login
          </button>
          {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
        </form>
      </div>
    </>
  );
}

export default Login;
