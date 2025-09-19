import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ApplicationStatus() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/business/${id}`)
      .then(res => setBusiness(res.data))
      .catch(err => console.error("Error fetching business", err));
  }, [id]);

  if (!business) return <p>Loading...</p>;

  return (
    <div>
      <h2>📋 Business Application Status</h2>
      <p><b>Business Name:</b> {business.businessName}</p>
      <p><b>Owner NIC:</b> {business.ownerNIC}</p>
      <p><b>Address:</b> {business.address}</p>
      <p><b>Category:</b> {business.category?.name || business.category}</p>
      <p><b>Floor Area:</b> {business.floorAreaM2} m²</p>
      <p><b>Status:</b> {business.status}</p>
    </div>
  );
}

export default ApplicationStatus;
