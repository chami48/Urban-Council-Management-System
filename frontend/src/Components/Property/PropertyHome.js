import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./PropertyHome.css";
import Nav from "../Nav/Nav";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties and their assessments
  const fetchPropertiesWithAssessments = async () => {
    try {
      setLoading(true);
      const propRes = await axios.get("http://localhost:5000/properties");
      const propertiesData = propRes.data.properties;

      const combinedData = await Promise.all(
        propertiesData.map(async (prop) => {
          try {
            const assessRes = await axios.get(
              `http://localhost:5000/assessments/propertyNo/${encodeURIComponent(
                prop.propertyNo
              )}`
            );
            return {
              ...prop,
              assessment: assessRes.data.assessment || null,
            };
          } catch {
            return { ...prop, assessment: null };
          }
        })
      );

      setProperties(combinedData);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPropertiesWithAssessments();
  }, []);

  // Add property if navigated from PropertyAssessmentDetails
  useEffect(() => {
    if (location.state?.property) {
      const newProperty = location.state.property;
      setProperties((prev) => {
        const exists = prev.some((p) => p.propertyNo === newProperty.propertyNo);
        if (exists) return prev;
        return [...prev, newProperty];
      });
    }
  }, [location.state]);

  // ✅ Remove property (delete from DB + update state)
  const handleRemove = async (propertyNo, index) => {
    try {
      await axios.delete(
        `http://localhost:5000/properties/propertyNo/${encodeURIComponent(
          propertyNo
        )}`
      );
      setProperties((prev) => prev.filter((_, i) => i !== index));
      alert("Property removed successfully!");
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property. Please try again.");
    }
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <>
      <Nav /> {/* Navigation bar at the top */}

      <div className="home-container">
        <h2 className="home-title">My Property</h2>

        <button
          className="btn-add-property"
          onClick={() => navigate("/addproperty")}
        >
          Add New Property
        </button>

        {properties.length === 0 ? (
          <p className="no-properties">No property to display</p>
        ) : (
          <div className="property-grid">
            {properties.map((prop, index) => {
              const assessment = prop.assessment;
              const annualTax = assessment
                ? (
                    (assessment.appraisedValue * assessment.taxRate) /
                    100
                  ).toLocaleString()
                : "-";

              return (
                <div className="property-card" key={index}>
                  <div className="property-header">
                    <span className="property-no">
                      Property {prop.propertyNo}
                    </span>
                    <span className="property-status">
                      {assessment?.status || "UNASSESSED"}
                    </span>
                  </div>

                  <div className="property-body">
                    <p>
                      <strong>Owner:</strong>{" "}
                      {assessment?.ownerName || "-"}
                    </p>
                    <p>
                      <strong>Branch/Div/Street:</strong>{" "}
                      {prop.branch}, {prop.division}, {prop.street}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {assessment?.description || "-"}
                    </p>
                    <p>
                      <strong>Appraised Value:</strong>{" "}
                      {assessment?.appraisedValue
                        ? `LKR ${assessment.appraisedValue}`
                        : "-"}
                    </p>
                    <p>
                      <strong>Annual Tax:</strong>{" "}
                      {annualTax ? `LKR ${annualTax}` : "-"}
                    </p>
                  </div>

                  <div className="property-actions">
                    <button
                      className="btn-view"
                      onClick={() =>
                        navigate(`/propertyTaxCalculation/${prop.propertyNo}`)
                      }
                      disabled={!assessment}
                      style={{
                        cursor: assessment ? "pointer" : "not-allowed",
                        opacity: assessment ? 1 : 0.5,
                      }}
                    >
                      View / Payment
                    </button>

                    <button
                      className="btn-remove"
                      onClick={() =>
                        handleRemove(prop.propertyNo, index)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
