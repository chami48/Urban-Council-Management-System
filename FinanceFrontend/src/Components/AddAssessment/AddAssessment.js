import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './AddAssessment.css';

function AddAssessment() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    assessmentNo: "",
    division: "",
    street: "",
    propertyNo: "",
    ownerName: "",
    ownerNIC: "",
    description: "",
    contactNo: "",
    propertyType: "වාණිජ",
    appraisedValue: "",
    taxRate: "",
    lat: "",
    lng: "",
    status: "ක්‍රියාකාරී"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/assessments", {
        assessmentNo: inputs.assessmentNo,
        division: inputs.division,
        street: inputs.street,
        propertyNo: inputs.propertyNo,
        ownerName: inputs.ownerName,
        ownerNIC: inputs.ownerNIC,
        contactNo: inputs.contactNo,
        description:inputs.description,
        propertyType: inputs.propertyType,
        appraisedValue: Number(inputs.appraisedValue),
        taxRate: Number(inputs.taxRate),
        status: inputs.status
      });
      navigate('/assessmentdetails');
      window.location.reload();
    } catch (err) {
      console.error("Error adding assessment:", err);
      alert("Failed to add assessment");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Property Assessment</h2>
      <form onSubmit={handleSubmit}>

        <label>Assessment No:</label>
        <input type="text" name="assessmentNo" value={inputs.assessmentNo} onChange={handleChange} required />

        <label>Division:</label>
        <input type="text" name="division" value={inputs.division} onChange={handleChange} required />

        <label>Street:</label>
        <input type="text" name="street" value={inputs.street} onChange={handleChange} required />

        <label>Property No:</label>
        <input type="text" name="propertyNo" value={inputs.propertyNo} onChange={handleChange} required />

        <label>Owner Name:</label>
        <input type="text" name="ownerName" value={inputs.ownerName} onChange={handleChange} required />

        <label>Owner NIC:</label>
        <input type="text" name="ownerNIC" value={inputs.ownerNIC} onChange={handleChange} required />

        <label>Contact No:</label>
        <input type="text" name="contactNo" value={inputs.contactNo} onChange={handleChange} required />

        <label>Desctription:</label>
        <input type="text" name="description" value={inputs.description} onChange={handleChange} required />

        <label>Property Type:</label>
        <select name="propertyType" value={inputs.propertyType} onChange={handleChange} required>
          <option value="වාණිජ">වාණිජ</option>
          <option value="නේවාසික">නේවාසික</option>
        </select>

        <label>Appraised Value:</label>
        <input type="number" name="appraisedValue" value={inputs.appraisedValue} onChange={handleChange} required />

        <label>Tax Rate:</label>
        <input type="number" name="taxRate" value={inputs.taxRate} onChange={handleChange} required />

       
        <label>Status:</label>
        <select name="status" value={inputs.status} onChange={handleChange} required>
          <option value="ක්‍රියාකාරී">ක්‍රියාකාරී</option>
          <option value="අක්‍රිය">අක්‍රිය</option>
        </select>

        <button type="submit" className="btn-submit">Add Assessment</button>
      </form>
    </div>
  );
}

export default AddAssessment;