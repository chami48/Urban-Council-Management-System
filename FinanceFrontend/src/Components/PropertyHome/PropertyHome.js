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
      const propRes = await axios.get("http://localhost:5001/properties");
      const propertiesData = propRes.data.properties;

      const combinedData = await Promise.all(
        propertiesData.map(async (prop) => {
          try {
            const assessRes = await axios.get(
              `http://localhost:5001/assessments/propertyNo/${encodeURIComponent(
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

  if (loading) return <p>Loading properties...</p>;

  return (
    <>
      <Nav /> {/*Navigation bar at the top */}

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
          <table className="property-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Property No</th>
                <th>Branch / Div / Street</th>
                <th>Owner Name</th>
                <th>Description</th>
                <th>Appraised Value</th>
                <th>Annual Tax Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop, index) => {
                const assessment = prop.assessment;
                const annualTax = assessment
                  ? (
                      (assessment.appraisedValue * assessment.taxRate) /
                      100
                    ).toLocaleString()
                  : "-";

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{prop.propertyNo}</td>
                    <td>
                      {prop.branch} <br />
                      {prop.division} <br />
                      {prop.street}
                    </td>
                    <td>{assessment?.ownerName || "-"}</td>
                    <td>{assessment?.description || "-"}</td>
                    <td>
                      {assessment?.appraisedValue
                        ? `LKR ${assessment.appraisedValue}`
                        : "-"}
                    </td>
                    <td>{annualTax ? `LKR ${annualTax}` : "-"}</td>
                    <td>{assessment?.status || "UNASSESSED"}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() =>
                          navigate(`/property/${prop.propertyNo}`)
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
                          setProperties((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Home;
