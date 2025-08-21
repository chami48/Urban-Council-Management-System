import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PropertyAssessmentDetails.css";

function FinalPropertyDisplay() {
  const { part1, part2 } = useParams();
  const navigate = useNavigate();

  // Handle different URL patterns
  const propertyNo = part2 ? `${part1}/${part2}` : part1;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const encodedPropertyNo = encodeURIComponent(propertyNo);

      // Fetch property details
      const propertyResponse = await axios.get(
        `http://localhost:5001/properties/propertyNo/${encodedPropertyNo}`,
        { timeout: 10000 }
      );

      if (propertyResponse.data?.property) {
        setProperty(propertyResponse.data.property);
      } else {
        setError({ message: "Property not found", status: 404 });
        return;
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
    if (propertyNo) {
      fetchData();
    }
  }, [propertyNo]);

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
    <div className="property-details-container">
      <h2>Details of Property</h2>

      {property && (
        <>
          <div className="property-details-section">
            <div className="detail-item">
              <span className="label">Related Office:</span>
              <span className="value">{property.office}</span>
            </div>
            <div className="detail-item">
              <span className="label">Division:</span>
              <span className="value">{property.division}</span>
            </div>
            <div className="detail-item">
              <span className="label">Street Name:</span>
              <span className="value">{property.street}</span>
            </div>
            <div className="detail-item">
              <span className="label">Property No:</span>
              <span className="value">{property.propertyNo}</span>
            </div>
            <div className="detail-item">
              <span className="label">Custom No:</span>
              <span className="value">{property.customNo}</span>
            </div>
            <div className="detail-item">
              <span className="label">Owner Name:</span>
              <span className="value">{property.ownerName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Description:</span>
              <span className="value">{property.description}</span>
            </div>
            <div className="detail-item">
              <span className="label">Annual Value / Quarter Rate:</span>
              <span className="value">{property.annualValue}</span>
            </div>
            <div className="detail-item">
              <span className="label">Arrears:</span>
              <span className="value">{property.arrears}</span>
            </div>
            <div className="detail-item">
              <span className="label">Warrent:</span>
              <span className="value">{property.warrent}</span>
            </div>
            <div className="detail-item">
              <span className="label">Year Rate:</span>
              <span className="value">{property.yearRate}</span>
            </div>
            <div className="detail-item">
              <span className="label">Future:</span>
              <span className="value">{property.future}</span>
            </div>
            <div className="detail-item">
              <span className="label">Discount:</span>
              <span className="value">{property.discount}</span>
            </div>
          </div>

          {/* Go to Payment Button */}
          <div className="payment-button-container">
            <button
              onClick={() => navigate("/payment", { state: { propertyNo } })}
              className="go-to-payment-button"
            >
              Go to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FinalPropertyDisplay;
