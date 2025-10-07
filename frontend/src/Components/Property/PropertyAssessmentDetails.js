// src/Components/Property/PropertyAssessmentDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./PropertyAssessmentDetails.css";
import Nav from "../Nav/Nav";

function PropertyAssessmentDetails() {
  const { part1, part2 } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const propertyNo = part2 ? `${part1}/${part2}` : part1;

  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // language comes from AddProperty page
  const lang = location.state?.lang || "si"; // fallback Sinhala

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const encodedPropertyNo = encodeURIComponent(propertyNo);

      // Fetch property
      const propertyResponse = await axios.get(
        `http://localhost:5000/properties/propertyNo/${encodedPropertyNo}`
      );

      if (propertyResponse.data?.property) {
        setProperty(propertyResponse.data.property);
      } else {
        setError({ message: "Property not found", status: 404 });
        return;
      }

      // Fetch assessment
      try {
        const assessmentResponse = await axios.get(
          `http://localhost:5000/assessments/propertyNo/${encodedPropertyNo}`
        );
        setAssessment(assessmentResponse.data?.assessment || null);
      } catch {
        setAssessment(null);
      }
    } catch (err) {
      setError({
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyNo) fetchData();
  }, [propertyNo]);

  const getLangValue = (obj) => {
    if (!obj) return "-";
    // pick requested language first, otherwise fallback to Sinhala → English → Tamil
    return obj[lang] || obj.si || obj.en || obj.ta || "-";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading property details for: {propertyNo}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error.message}</p>
        <p>Property Number: {propertyNo}</p>
        <button onClick={fetchData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="details-container">
        <div className="header-section">
          <h2>Property and Assessment Details</h2>
          <button onClick={() => navigate(-1)} className="back-button">
            &larr; Back
          </button>
        </div>

        {property && (
          <>
            {/* Property Section */}
            <div className="details-section property-section">
              <h3>
                Property Information
                <span
                  className={`property-status ${
                    assessment ? "assessed" : "unassessed"
                  }`}
                >
                  {assessment ? "ASSESSED" : "UNASSESSED"}
                </span>
              </h3>
              <div className="detail-grid">
                <DetailItem label="Property No" value={property.propertyNo} />
                <DetailItem
                  label="Branch"
                  value={getLangValue(property.branch)}
                />
                <DetailItem
                  label="Division"
                  value={getLangValue(property.division)}
                />
                <DetailItem
                  label="Street"
                  value={getLangValue(property.street)}
                />
              </div>
            </div>

            {/* Assessment Section */}
            <div className="details-section assessment-section">
              <h3>Assessment Information</h3>
              {assessment ? (
                <div className="detail-grid">
                  <DetailItem
                    label="Assessment No"
                    value={assessment.assessmentNo}
                  />
                  <DetailItem label="Owner Name" value={assessment.ownerName} />
                  <DetailItem label="Owner NIC" value={assessment.ownerNIC} />
                  <DetailItem label="Contact No" value={assessment.contactNo} />
                  <DetailItem
                    label="Property Type"
                    value={assessment.propertyType}
                  />
                  <DetailItem
                    label="Annual Value"
                    value={`LKR ${
                      assessment.appraisedValue?.toLocaleString() || "0"
                    }`}
                  />
                  <DetailItem
                    label="Tax Rate"
                    value={`${assessment.taxRate}%`}
                  />
                  <DetailItem
                    label="Annual Tax Amount"
                    value={`LKR ${(
                      (assessment.appraisedValue * assessment.taxRate) /
                      100
                    )?.toLocaleString()}`}
                  />
                  <DetailItem label="Status" value={assessment.status} />
                </div>
              ) : (
                <div className="no-assessment">
                  <p>This property is not registered</p>
                </div>
              )}
            </div>

            {/* Confirm & Add Button */}
            <div style={{ marginTop: "20px" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (lang === "en") {
                    navigate("/propertyHome", { state: { property, lang } });
                  } else if (lang === "ta") {
                    navigate("/tpropertyHome", { state: { property, lang } });
                  } else if (lang === "si") {
                    navigate("/spropertyHome", { state: { property, lang } });
                  } else {
                    // fallback: English
                    navigate("/propertyHome", {
                      state: { property, lang: "en" },
                    });
                  }
                }}
              >
                <button type="submit" className="confirm-add-button">
                  Confirm & Add
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value || "-"}</span>
  </div>
);

export default PropertyAssessmentDetails;
