import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PropertyAssessmentDetails.css";

function PropertyAssessmentDetails() {
  const { part1, part2 } = useParams();
  const navigate = useNavigate();

  // Handle different URL patterns
  const propertyNo = part2 ? `${part1}/${part2}` : part1;
  
  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching data for propertyNo:", propertyNo);
      
      // Fetch property details
      const encodedPropertyNo = encodeURIComponent(propertyNo);
      console.log("Encoded propertyNo:", encodedPropertyNo);
      
      const propertyResponse = await axios.get(
        `http://localhost:5001/properties/propertyNo/${encodedPropertyNo}`,
        { timeout: 10000 }
      );

      console.log("Property response:", propertyResponse.data);

      if (propertyResponse.data?.property) {
        setProperty(propertyResponse.data.property);
        console.log("Property set:", propertyResponse.data.property);
      } else {
        console.log("No property found");
        setError({ message: "Property not found", status: 404 });
        return;
      }

      // Fetch assessment details
      try {
        console.log("Fetching assessment...");
        const assessmentResponse = await axios.get(
          `http://localhost:5001/assessments/propertyNo/${encodedPropertyNo}`,
          { timeout: 10000 }
        );

        console.log("Assessment response:", assessmentResponse.data);

        if (assessmentResponse.data?.assessment) {
          setAssessment(assessmentResponse.data.assessment);
          console.log("Assessment set:", assessmentResponse.data.assessment);
        } else {
          console.log("No assessment found");
          setAssessment(null);
        }
      } catch (assessmentError) {
        console.log("Assessment fetch error:", assessmentError);
        if (assessmentError.response?.status === 404) {
          console.log("No assessment found (404)");
          setAssessment(null);
        } else {
          console.error("Assessment error:", assessmentError);
          // Don't set error here, just log it - missing assessment is not an error
          setAssessment(null);
        }
      }
    } catch (err) {
      console.error("Property fetch error:", err);
      setError({
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyNo) {
      fetchData();
    }
  }, [propertyNo]);

  const handleAddAssessment = () => {
    // Navigate to add assessment with property number pre-filled
    navigate(`/addassessment?propertyNo=${encodeURIComponent(propertyNo)}`);
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
        {error.status === 404 ? (
          <div>
            <p>Property not found. Please check the property number.</p>
            <button onClick={() => navigate('/')} className="back-button">
              Go to Home
            </button>
          </div>
        ) : (
          <button onClick={fetchData} className="retry-button">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="header-section">
        <h2>Property and Assessment Details</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back
        </button>
      </div>

      {property && (
        <>
          {/* Property Details Section */}
          <div className="details-section property-section">
            <h3>
              Property Information
              <span className={`property-status ${assessment ? 'assessed' : 'unassessed'}`}>
                {assessment ? 'ASSESSED' : 'UNASSESSED'}
              </span>
            </h3>
            <div className="detail-grid">
              <DetailItem label="Property No" value={property.propertyNo} />
              <DetailItem label="Branch" value={property.branch} />
              <DetailItem label="Division" value={property.division} />
              <DetailItem label="Street" value={property.street} />
            </div>
          </div>

          {/* Assessment/Owner Details Section */}
          <div className="details-section assessment-section">
            <h3>Assessment Information</h3>
            {assessment ? (
              <div className="detail-grid">
                <DetailItem label="Assessment No" value={assessment.assessmentNo} />
                <DetailItem label="Owner Name" value={assessment.ownerName} />
                <DetailItem label="Owner NIC" value={assessment.ownerNIC} />
                <DetailItem label="Contact No" value={assessment.contactNo} />
                <DetailItem label="Property Type" value={assessment.propertyType} />
                <DetailItem 
                  label="Annual Value" 
                  value={`LKR ${assessment.annualValue?.toLocaleString() || "0"}`} 
                />
                <DetailItem label="Tax Rate" value={`${assessment.taxRate}%`} />
                <DetailItem
                  label="Tax Amount"
                  value={`LKR ${((assessment.annualValue * assessment.taxRate) / 100)?.toLocaleString()}`}
                />
                <DetailItem label="Status" value={assessment.status} />
              </div>
            ) : (
              <div className="no-assessment">
                <p>No assessment records found for this property</p>
                <button
                  onClick={handleAddAssessment}
                  className="add-assessment-button"
                >
                  Add Assessment
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