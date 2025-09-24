// src/Components/Property/TaxCalculationEnglish.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

function TaxCalculationEnglish() {
  const { propertyNo, part1, part2 } = useParams();
  const navigate = useNavigate();

  // Handle different URL patterns safely
  const actualPropertyNo = propertyNo
    ? decodeURIComponent(propertyNo)
    : part1 && part2
    ? `${part1}/${part2}`
    : part1 || "";

  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [taxDetails, setTaxDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!actualPropertyNo) return;
      setLoading(true);
      setError(null);

      try {
        const encodedPropertyNo = encodeURIComponent(actualPropertyNo);

        const propertyRes = await axios.get(
          `http://localhost:5000/properties/propertyNo/${encodedPropertyNo}`
        );
        setProperty(propertyRes.data?.property || null);

        const assessmentRes = await axios.get(
          `http://localhost:5000/assessments/propertyNo/${encodedPropertyNo}`
        );
        setAssessment(assessmentRes.data?.assessment || null);

        const taxRes = await axios.get(
          `http://localhost:5000/calculateTax/${encodedPropertyNo}`
        );
        setTaxDetails(taxRes.data || null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actualPropertyNo]);

  const formatCurrency = (num) =>
    num ? `LKR ${Number(num).toLocaleString()}` : "LKR 0";

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e7f3ff 75%, #f0f9ff 100%)",
      backgroundSize: "400% 400%",
      animation: "gradientShift 15s ease infinite",
      position: "relative",
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    backgroundOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)
      `,
      pointerEvents: "none",
    },
    pageContent: {
      position: "relative",
      zIndex: 1,
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "2rem 1rem",
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem",
      animation: "slideInDown 0.8s ease-out",
    },
    title: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: "800",
      color: "#1e293b",
      marginBottom: "1rem",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      letterSpacing: "-0.02em",
    },
    cardsContainer: {
      display: "grid",
      gap: "2rem",
      marginBottom: "3rem",
    },
    card: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      borderRadius: "20px",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      padding: "2rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      animation: "slideInUp 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    cardShimmer: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)",
      animation: "shimmer 3s infinite",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "2px solid rgba(59, 130, 246, 0.1)",
    },
    cardIcon: { fontSize: "2rem", marginRight: "1rem" },
    cardTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#1e293b" },
    cardContent: {
      fontSize: "1.1rem",
      color: "#475569",
      lineHeight: "1.8",
      fontWeight: "500",
    },
    propertyDetails: {
      background: "rgba(248, 250, 252, 0.8)",
      borderRadius: "12px",
      padding: "1.5rem",
      marginTop: "1rem",
    },
    taxSummaryCard: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      color: "white",
      textAlign: "center",
    },
    taxAmount: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      fontWeight: "900",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      marginTop: "1rem",
    },
    taxLabel: { fontSize: "1.2rem", fontWeight: "600", opacity: 0.9 },
    actionsContainer: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      justifyContent: "center",
      animation: "fadeIn 1s ease-out 0.8s both",
    },
    button: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "12px",
      padding: "1rem 2rem",
      color: "#334155",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      border: "none",
      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
    },
    secondaryButton: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "white",
      border: "none",
      boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)",
    },
  };

  const keyframes = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes slideInDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <Nav />
        <div style={styles.pageContent}>
          <p>⏳ Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <Nav />
        <div style={styles.pageContent}>
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <Nav />
      <div style={styles.pageContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏠 Property Tax Bill Summary</h1>
        </div>

        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <div style={styles.cardShimmer}></div>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🏘️</span>
              <h2 style={styles.cardTitle}>Property Details</h2>
            </div>
            <div style={styles.propertyDetails}>
              <p style={styles.cardContent}>
                {property.division?.en || "-"}, {property.street?.en || "-"},{" "}
                {property.propertyNo}
              </p>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardShimmer}></div>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>👤</span>
              <h2 style={styles.cardTitle}>Owner Information</h2>
            </div>
            <div style={styles.propertyDetails}>
              <p style={styles.cardContent}>
                {assessment?.ownerName || "-"} - {assessment?.ownerNIC || "-"}
              </p>
            </div>
          </div>

          <div style={{ ...styles.card, ...styles.taxSummaryCard }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>💰</span>
              <h2 style={styles.cardTitle}>Tax Summary</h2>
            </div>
            <div style={styles.taxLabel}>Total Payable Amount</div>
            <div style={styles.taxAmount}>
              {formatCurrency(taxDetails?.payableAmount || 0)}
            </div>
          </div>
        </div>

        <div style={styles.actionsContainer}>
          <button style={styles.button} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            📊 Payment History
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => {
              const year = new Date().getFullYear();
              const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
              navigate(
                `/payment-details/${encodeURIComponent(actualPropertyNo)}/${year}/${quarter}`
              );
            }}
          >
            💳 Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaxCalculationEnglish;
