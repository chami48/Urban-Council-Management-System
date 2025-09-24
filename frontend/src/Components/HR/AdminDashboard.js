import React from "react";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const navigate = useNavigate();

  // Reusable button style
  const baseButtonStyle = {
    padding: "1rem 2.5rem",
    fontSize: "1.3rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    borderRadius: "1rem",
    border: "2px solid #1e40af",
    background: "#fff",
    color: "#1e40af",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(30, 64, 175, 0.15)",
    transition: "all 0.3s ease-in-out",
  };

  // Hover effect (handled with events)
  const handleMouseOver = (e) => {
    e.currentTarget.style.background = "#1e40af";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,64,175,0.25)";
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.background = "#fff";
    e.currentTarget.style.color = "#1e40af";
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,64,175,0.15)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
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

      <Header />

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
          {/* Salary Table Button */}
          <button
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => navigate("/salary-table")}
          >
            <span style={{ fontSize: "2rem", marginRight: "0.8rem" }}>💰</span>
            <span>Salary Table</span>
          </button>

          {/* Leave Status Button */}
          <button
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => navigate("/leavestatus")}
          >
            <span style={{ fontSize: "2rem", marginRight: "0.8rem" }}>📝</span>
            <span>Leave Status</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
