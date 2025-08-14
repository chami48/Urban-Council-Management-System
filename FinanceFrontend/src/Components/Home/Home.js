import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Home.css";

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

      // Check if property already exists in state
      setProperties((prev) => {
        const exists = prev.some((p) => p.propertyNo === newProperty.propertyNo);
        if (exists) return prev;
        return [...prev, newProperty];
      });
    }
  }, [location.state]);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="home-container">
      <h2 className="home-title">My Property</h2>

      <button className="btn-add-property" onClick={() => navigate("/addproperty")}>
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
              <th>Annual Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{prop.propertyNo}</td>
                <td>
                  {prop.branch} <br />
                  {prop.division} <br />
                  {prop.street}
                </td>
                <td>{prop.assessment?.ownerName || "-"}</td>
                <td>{prop.assessment?.description || "-"}</td>
                <td>
                  {prop.assessment?.annualValue
                    ? `LKR ${prop.assessment.annualValue}`
                    : "-"}
                </td>
                <td>{prop.assessment?.status || "UNASSESSED"}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/property/${prop.propertyNo}`)}
                    disabled={!prop.assessment}
                    style={{
                      cursor: prop.assessment ? "pointer" : "not-allowed",
                      opacity: prop.assessment ? 1 : 0.5,
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;
