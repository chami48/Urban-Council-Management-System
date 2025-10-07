import React from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();

  // Base button style (box type)
  const baseButtonStyle = {
    padding: "1rem 2.5rem",
    fontSize: "1.3rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.5rem", // small rounded box
    border: "2px solid #1e40af", // normal blue border
    background: "#fff", // white by default
    color: "#000", // black text
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    minWidth: "220px",
  };

  // Hover effect handlers (switch white <-> blue)
  const handleMouseOver = (e) => {
    e.currentTarget.style.background = "#1e40af"; // blue background
    e.currentTarget.style.color = "#fff"; // white text
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.background = "#fff"; // white background
    e.currentTarget.style.color = "#000"; // black text
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#f8faff", // subtle light background
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.8s ease-in-out",
      }}
    >
      {/* Inline fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            marginTop: "2rem",
          }}
        >
          {/* Admin Button */}
          <button
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => navigate("/admin")}
          >
            <span style={{ fontSize: "2rem", marginRight: "0.8rem" }}>🛡️</span>
            <span>Admin</span>
          </button>

          {/* User Button */}
          <button
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => navigate("/leaveform")}
          >
            <span style={{ fontSize: "2rem", marginRight: "0.8rem" }}>👤</span>
            <span>User Leave Form</span>
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default Dashboard;
