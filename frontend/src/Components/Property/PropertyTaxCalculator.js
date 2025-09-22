import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

function TaxCalculation() {
  const params = useParams();
  const navigate = useNavigate();

  // Extract property number from URL
  const { propertyNo, part1, part2 } = params;
  let actualPropertyNo;
  if (propertyNo) {
    actualPropertyNo = decodeURIComponent(propertyNo);
  } else if (part1 && part2) {
    actualPropertyNo = `${part1}/${part2}`;
  } else if (part1) {
    actualPropertyNo = part1;
  }

  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [taxDetails, setTaxDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (actualPropertyNo) {
      fetchData();
    } else {
      setError("Property number not found in URL");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualPropertyNo]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const encodedPropertyNo = encodeURIComponent(actualPropertyNo);

      // Fetch property
      const propertyRes = await axios.get(
        `http://localhost:5000/properties/propertyNo/${encodedPropertyNo}`
      );
      if (!propertyRes.data?.property) {
        setError(`Property not found: ${actualPropertyNo}`);
        return;
      }
      setProperty(propertyRes.data.property);

      // Fetch assessment
      const assessmentRes = await axios.get(
        `http://localhost:5000/assessments/propertyNo/${encodedPropertyNo}`
      );
      if (assessmentRes.data?.assessment) {
        setAssessment(assessmentRes.data.assessment);
      } else {
        setError("Assessment not found for this property");
      }

      // Fetch tax calculations
      const taxRes = await axios.get(
        `http://localhost:5000/calculateTax/${encodedPropertyNo}`
      );
      setTaxDetails(taxRes.data);
    } catch (err) {
      let errorMessage = "Error fetching data";
      if (err.response?.status === 404) {
        errorMessage = "Property or assessment not found";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error - check backend";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to backend server";
      } else {
        errorMessage = err.response?.data?.message || err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
        <Nav />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          flexDirection: "column"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            animation: "pulse 2s infinite"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid white",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
          </div>
          <h2 style={{
            color: "#2d3748",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "8px"
          }}>Loading Tax Calculation...</h2>
          <p style={{
            color: "#718096",
            fontSize: "16px",
            fontWeight: "500"
          }}>Property Number: {actualPropertyNo}</p>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
        <Nav />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "20px"
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            maxWidth: "500px",
            width: "100%"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "24px"
            }}>⚠️</div>
            <h3 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#1a202c",
              marginBottom: "12px"
            }}>Error Loading Tax Calculation</h3>
            <p style={{
              color: "#718096",
              fontSize: "16px",
              marginBottom: "32px",
              lineHeight: "1.5"
            }}>{error}</p>
            <button
              onClick={() => navigate("/propertyhome")}
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
                color: "white",
                border: "none",
                padding: "12px 32px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px 0 rgba(234, 88, 12, 0.4)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px 0 rgba(234, 88, 12, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px 0 rgba(234, 88, 12, 0.4)";
              }}
            >
              ← Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property || !assessment || !taxDetails) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
        <Nav />
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh"
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ color: "#2d3748", fontSize: "24px", fontWeight: "600" }}>Data not available</h3>
            <p style={{ color: "#718096", fontSize: "16px" }}>Property Number: {actualPropertyNo}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (num) =>
    num !== undefined && num !== null
      ? `LKR ${Number(num).toLocaleString()}`
      : "LKR 0";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <Nav />
      
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
          borderRadius: "20px",
          padding: "40px",
          color: "white",
          marginBottom: "32px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            zIndex: "1"
          }}></div>
          <div style={{
            position: "relative",
            zIndex: "2"
          }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "8px",
              textAlign: "center"
            }}>🏠 Property Tax Bill Summary</h1>
            <p style={{
              fontSize: "18px",
              textAlign: "center",
              opacity: "0.9"
            }}>Comprehensive tax calculation for property {actualPropertyNo}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "32px"
        }}>
          {/* Property Information Card */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(102, 126, 234, 0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                fontSize: "20px"
              }}>🏡</div>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1a202c",
                margin: "0"
              }}>Property Details</h3>
            </div>
            
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { label: "Division", value: property.division },
                { label: "Street Name", value: property.street },
                { label: "Property No", value: property.propertyNo },
                { label: "Assessment No", value: assessment.assessmentNo }
              ].map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: index < 3 ? "1px solid #e2e8f0" : "none"
                }}>
                  <span style={{
                    color: "#4a5568",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}>{item.label}</span>
                  <span style={{
                    color: "#1a202c",
                    fontWeight: "600",
                    fontSize: "16px"
                  }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Information Card */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(102, 126, 234, 0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                fontSize: "20px"
              }}>👤</div>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1a202c",
                margin: "0"
              }}>Owner Information</h3>
            </div>
            
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { label: "Owner Name", value: assessment.ownerName },
                { label: "Owner NIC", value: assessment.ownerNIC },
                { label: "Contact No", value: assessment.contactNo }
              ].map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: index < 2 ? "1px solid #e2e8f0" : "none"
                }}>
                  <span style={{
                    color: "#4a5568",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}>{item.label}</span>
                  <span style={{
                    color: "#1a202c",
                    fontWeight: "600",
                    fontSize: "16px"
                  }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tax Summary Card */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(102, 126, 234, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
              fontSize: "20px"
            }}>💰</div>
            <h3 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1a202c",
              margin: "0"
            }}>Tax Summary</h3>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {[
              { label: "Annual Tax Amount", value: formatCurrency(taxDetails.annualTax), color: "#1e3a8a" },
              { label: "Quarterly Amount", value: formatCurrency(taxDetails.quarterlyAmount), color: "#1e40af" },
              { label: "Total Paid", value: formatCurrency(taxDetails.totalPaid), color: "#059669" },
              { label: "Arrears", value: formatCurrency(taxDetails.arrears), color: "#ea580c" },
              { label: "Discount", value: `- ${formatCurrency(taxDetails.discount)}`, color: "#0891b2" },
              { label: "Fine", value: `+ ${formatCurrency(taxDetails.fine)}`, color: "#dc2626" }
            ].map((item, index) => (
              <div key={index} style={{
                background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                padding: "20px",
                borderRadius: "16px",
                border: `2px solid ${item.color}20`,
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  color: item.color,
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>{item.label}</div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1a202c"
                }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Highlight Total Payable */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
            padding: "24px",
            borderRadius: "20px",
            marginTop: "24px",
            color: "white",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
              opacity: "0.9"
            }}>TOTAL PAYABLE AMOUNT</div>
            <div style={{
              fontSize: "36px",
              fontWeight: "800"
            }}>{formatCurrency(taxDetails.payableAmount)}</div>
          </div>

          {/* Payment Dates */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "24px"
          }}>
            <div style={{
              background: "rgba(5, 150, 105, 0.1)",
              padding: "20px",
              borderRadius: "16px",
              border: "2px solid rgba(5, 150, 105, 0.2)"
            }}>
              <div style={{
                color: "#059669",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px"
              }}>LAST PAID DATE</div>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1a202c"
              }}>
                {taxDetails.lastPaidDate
                  ? new Date(taxDetails.lastPaidDate).toLocaleDateString()
                  : "Not Paid"}
              </div>
            </div>
            <div style={{
              background: "rgba(234, 88, 12, 0.1)",
              padding: "20px",
              borderRadius: "16px",
              border: "2px solid rgba(234, 88, 12, 0.2)"
            }}>
              <div style={{
                color: "#ea580c",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px"
              }}>NEXT DUE DATE</div>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1a202c"
              }}>
                {taxDetails.nextDueDate
                  ? new Date(taxDetails.nextDueDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Breakdown Table */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(102, 126, 234, 0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
              fontSize: "20px"
            }}>📅</div>
            <h3 style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1a202c",
              margin: "0"
            }}>Quarterly Breakdown</h3>
          </div>

          <div style={{
            overflowX: "auto",
            borderRadius: "16px",
            border: "1px solid #e2e8f0"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
                }}>
                  {["Quarter", "Due Date", "Base", "Paid", "Remaining", "Fine", "Status"].map((header, index) => (
                    <th key={index} style={{
                      padding: "20px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#4a5568",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "2px solid #e2e8f0"
                    }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taxDetails.quarters.map((q, index) => (
                  <tr key={q.quarter} style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                    transition: "all 0.2s ease"
                  }}>
                    <td style={{
                      padding: "20px",
                      fontWeight: "700",
                      color: "#1a202c",
                      fontSize: "16px"
                    }}>
                      <div style={{
                        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        display: "inline-block",
                        fontSize: "14px",
                        fontWeight: "600"
                      }}>Q{q.quarter}</div>
                    </td>
                    <td style={{ padding: "20px", color: "#4a5568", fontSize: "14px", fontWeight: "500" }}>
                      {new Date(q.dueDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "20px", color: "#1a202c", fontSize: "16px", fontWeight: "600" }}>
                      {formatCurrency(q.baseAmount)}
                    </td>
                    <td style={{ padding: "20px", color: "#48bb78", fontSize: "16px", fontWeight: "600" }}>
                      {formatCurrency(q.paidAmount)}
                    </td>
                    <td style={{ padding: "20px", color: "#ed8936", fontSize: "16px", fontWeight: "600" }}>
                      {formatCurrency(q.remainingDue)}
                    </td>
                    <td style={{ padding: "20px", color: "#e53e3e", fontSize: "16px", fontWeight: "600" }}>
                      {formatCurrency(q.fine)}
                    </td>
                    <td style={{ padding: "20px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        backgroundColor: q.status === "Paid" ? "#c6f6d5" : q.status === "Overdue" ? "#fed7d7" : "#fef5e7",
                        color: q.status === "Paid" ? "#22543d" : q.status === "Overdue" ? "#742a2a" : "#744210"
                      }}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap"
        }}>
          {[
           {
  text: "💳 Confirm Payment",
  bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
  shadow: "rgba(5, 150, 105, 0.4)",
  onClick: () => {
    const year = new Date().getFullYear();
    const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
    navigate(`/payment-details/${encodeURIComponent(actualPropertyNo)}/${year}/${quarter}`);
  }
},

  { text: "📊 Payment History", 
    bg: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)", 
    shadow: "rgba(234, 88, 12, 0.4)" },
  { text: "← Back",
    bg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)", 
    shadow: "rgba(30, 58, 138, 0.4)", onClick: () => navigate(-1) }
    ].map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              style={{
                background: button.bg,
                color: "white",
                padding: "16px 32px",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "700",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 20px ${button.shadow}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = `0 8px 30px ${button.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 20px ${button.shadow}`;
              }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaxCalculation;