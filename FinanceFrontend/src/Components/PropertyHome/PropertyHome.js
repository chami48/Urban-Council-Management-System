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

  if (loading) {
    return (
      <>
        <Nav />
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Loading properties...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      
      <div className="home-container-modern">
        <div className="content-wrapper">
          {/* Header Section */}
          <div className="header-section">
            <div className="header-content">
              <div className="header-text">
                <h2 className="main-title">My Properties</h2>
                <p className="subtitle">Manage your property portfolio and assessments</p>
              </div>
              <div className="header-actions">
                <button
                  onClick={() => navigate("/addproperty")}
                  className="btn-add-property-modern"
                >
                  <svg className="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Property
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="empty-title">No properties yet</h3>
              <p className="empty-description">Get started by adding your first property to the system.</p>
              <button
                onClick={() => navigate("/addproperty")}
                className="btn-empty-add"
              >
                Add Property
              </button>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-wrapper">
                <table className="property-table-modern">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Property No</th>
                      <th>Location</th>
                      <th>Owner Name</th>
                      <th>Description</th>
                      <th>Appraised Value</th>
                      <th>Annual Tax</th>
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
                        <tr key={index} className="table-row">
                          <td className="cell-index">{index + 1}</td>
                          <td className="cell-property-no">{prop.propertyNo}</td>
                          <td className="cell-location">
                            <div className="location-info">
                              <div className="location-main">{prop.branch}</div>
                              <div className="location-sub">{prop.division}</div>
                              <div className="location-sub">{prop.street}</div>
                            </div>
                          </td>
                          <td className="cell-owner">
                            {assessment?.ownerName || <span className="no-data">-</span>}
                          </td>
                          <td className="cell-description">
                            {assessment?.description || <span className="no-data">-</span>}
                          </td>
                          <td className="cell-value">
                            {assessment?.appraisedValue ? (
                              <span className="value-amount">
                                LKR {assessment.appraisedValue.toLocaleString()}
                              </span>
                            ) : (
                              <span className="no-data">-</span>
                            )}
                          </td>
                          <td className="cell-tax">
                            {annualTax !== "-" ? (
                              <span className="value-amount">LKR {annualTax}</span>
                            ) : (
                              <span className="no-data">-</span>
                            )}
                          </td>
                          <td className="cell-status">
                            <span className={`status-badge ${
                              assessment?.status === 'ASSESSED' 
                                ? 'status-assessed' 
                                : assessment?.status === 'PENDING'
                                ? 'status-pending'
                                : 'status-unassessed'
                            }`}>
                              {assessment?.status || "UNASSESSED"}
                            </span>
                          </td>
                          <td className="cell-actions">
                            <div className="action-buttons">
                              <button
                                onClick={() => navigate(`/property/${prop.propertyNo}`)}
                                disabled={!assessment}
                                className={`btn-view-modern ${!assessment ? 'btn-disabled' : ''}`}
                              >
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View/Payment
                              </button>

                              <button
                                onClick={() =>
                                  setProperties((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="btn-remove-modern"
                              >
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;