import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PropertyAssessmentDetails.css";

function PropertyAssessmentDetails() {
  const { part1, part2 } = useParams();
  const navigate = useNavigate();

  // Combine parts with slash to reconstruct propertyNo
  const propertyNo = `${part1}/${part2}`;
  // Encode propertyNo to safely use in URL (slash becomes %2F)
  const encodedPropertyNo = encodeURIComponent(propertyNo);

  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch property details
      const propertyResponse = await axios.get(
        `http://localhost:5001/properties/propertyNo/${encodedPropertyNo}`,
        { timeout: 5000 }
      );

      if (!propertyResponse.data?.property) {
        throw new Error("Property data not found in response");
      }
      setProperty(propertyResponse.data.property);

      // Fetch assessment details
      try {
        const assessmentResponse = await axios.get(
          `http://localhost:5001/assessments/propertyNo/${encodedPropertyNo}`,
          { timeout: 5000 }
        );

        if (assessmentResponse.data?.assessment) {
          setAssessment(assessmentResponse.data.assessment);
        } else {
          setAssessment(null);
        }
      } catch (assessmentError) {
        console.log("No assessment found for property:", propertyNo);
        setAssessment(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError({
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
      });

      if (err.response?.status === 404) {
        // Property not found, redirect after delay
        setTimeout(() => navigate("/properties"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyNo, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error.message}</p>
        {error.status === 404 ? (
          <p>Redirecting to properties list...</p>
        ) : (
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="header-section">
        <h2>Property and Owner Details</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to List
        </button>
      </div>

      {property && (
        <>
          {/* Property Details Section */}
          <div className="details-section property-section">
            <h3>
              Property Information
              <span className="property-status">
                {assessment?.status || "UNASSESSED"}
              </span>
            </h3>
            <div className="detail-grid">
              <DetailItem label="Property No" value={property.propertyNo} />
              <DetailItem label="Branch" value={property.branch} />
              <DetailItem label="Division" value={property.division} />
              <DetailItem label="Street" value={property.street} />
              <DetailItem
                label="Last Updated"
                value={new Date(property.updatedAt).toLocaleString()}
              />
            </div>
          </div>

          {/* Assessment/Owner Details Section */}
          <div className="details-section assessment-section">
            <h3>Assessment Information</h3>
            {assessment ? (
              <div className="detail-grid">
                
                <DetailItem label="Owner Name" value={assessment.ownerName} />
                <DetailItem
                  label="Annual Value"
                  value={`LKR ${assessment.annualValue?.toLocaleString() || "0"}`}
                />
                <DetailItem label="Tax Rate" value={`${assessment.taxRate}%`} />
                <DetailItem
                  label="Tax Amount"
                  value={`LKR ${(
                    (assessment.annualValue * assessment.taxRate) /
                    100
                  )?.toLocaleString()}`}
                />
              </div>
            ) : (
              <div className="no-assessment">
                <p>No assessment records found for this property</p>
                <button
                  onClick={() => navigate(`/add-assessment?propertyNo=${encodedPropertyNo}`)}
                  className="add-assessment-button"
                > Confirm & Add
</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Reusable detail component
const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value || "-"}</span>
  </div>
);

export default PropertyAssessmentDetails;
