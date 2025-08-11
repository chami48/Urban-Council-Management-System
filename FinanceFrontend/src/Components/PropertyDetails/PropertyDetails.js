import React, { useEffect, useState } from "react";
import axios from "axios";

function PropertyDisplay({ propertyNo }) {
  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propertyNo) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch property by propertyNo
        const propertyRes = await axios.get(
          `http://localhost:5001/properties?propertyNo=${encodeURIComponent(propertyNo)}`
        );

        // Fetch assessment by propertyNo
        const assessmentRes = await axios.get(
          `http://localhost:5001/assessments?propertyNo=${encodeURIComponent(propertyNo)}`
        );

        // Assuming backend returns arrays for both queries
        setProperty(propertyRes.data.properties?.[0] || null);
        setAssessment(assessmentRes.data.assessments?.[0] || null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyNo]);

  if (!propertyNo) return <p>Please provide a Property No.</p>;

  if (loading) return <p>Loading property details...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!property && !assessment)
    return <p>No property or assessment found for Property No: {propertyNo}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Property Details for: {propertyNo}</h2>

      {property ? (
        <div style={{ marginBottom: "20px" }}>
          <h3>Property Info</h3>
          <p><strong>Branch / Sub office:</strong> {property.branch}</p>
          <p><strong>Division:</strong> {property.division}</p>
          <p><strong>Street:</strong> {property.street}</p>
        </div>
      ) : (
        <p>No Property data available.</p>
      )}

      {assessment ? (
        <div>
          <h3>Assessment Info</h3>
          <p><strong>Assessment No:</strong> {assessment.assessmentNo}</p>
          <p><strong>Owner Name:</strong> {assessment.ownerName}</p>
          <p><strong>Owner NIC:</strong> {assessment.ownerNIC}</p>
          <p><strong>Contact No:</strong> {assessment.contactNo}</p>
          <p><strong>Property Type:</strong> {assessment.propertyType}</p>
          <p><strong>Annual Value:</strong> {assessment.annualValue}</p>
          <p><strong>Tax Rate:</strong> {assessment.taxRate}</p>
          <p><strong>Status:</strong> {assessment.status}</p>
        </div>
      ) : (
        <p>No Assessment data available.</p>
      )}
    </div>
  );
}

export default PropertyDisplay;
