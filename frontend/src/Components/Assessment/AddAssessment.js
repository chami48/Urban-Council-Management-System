import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './AddAssessment.css';
import Navigation from '../Navigation/Navigation';

function AddAssessment() {
  const navigate = useNavigate();

  // 👇 sidebar state added
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [inputs, setInputs] = useState({
    assessmentNo: "",
    division: "",
    street: "",
    propertyNo: "",
    ownerName: "",
    ownerNIC: "",
    description: "",
    contactNo: "",
    propertyType: "Business", // default
    appraisedValue: "",
    taxRate: "",
    lat: "",
    lng: "",
    status: "Active", // default
    paymentStatus: "Normal" // New: Normal / Discount / Penalty
  });

  const [results, setResults] = useState({
    annualValue: 0,
    taxPayable: 0,
    discount: 0,
    penalty: 0,
    finalTax: 0,
  });

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Tax calculation logic
  const calculateTax = () => {
    let annualValue = Number(inputs.appraisedValue);
    let tax = (annualValue * Number(inputs.taxRate)) / 100;

    // Apply min/max limits
    if (tax < 1200) tax = 1200;
    if (tax > 8000) tax = 8000;

    let discount = 0;
    let penalty = 0;

    // Apply discounts or penalties
    if (inputs.paymentStatus === "Discount") {
      discount = tax * 0.15; // 15% discount
    }

    if (inputs.paymentStatus === "Penalty") {
      penalty = tax * 0.10; // 10% penalty
    }

    let finalTax = tax - discount + penalty;

    setResults({
      annualValue,
      taxPayable: tax,
      discount,
      penalty,
      finalTax,
    });
  };

  // recalc whenever inputs change
  useEffect(() => {
    if (inputs.appraisedValue && inputs.taxRate) {
      calculateTax();
    }
  }, [inputs.appraisedValue, inputs.taxRate, inputs.paymentStatus]);

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/assessments", {
        assessmentNo: inputs.assessmentNo,
        division: inputs.division,
        street: inputs.street,
        propertyNo: inputs.propertyNo,
        ownerName: inputs.ownerName,
        ownerNIC: inputs.ownerNIC,
        contactNo: inputs.contactNo,
        description: inputs.description,
        propertyType: inputs.propertyType,
        appraisedValue: Number(inputs.appraisedValue),
        taxRate: Number(inputs.taxRate),
        status: inputs.status,
        paymentStatus: inputs.paymentStatus,
        annualValue: results.annualValue,
        taxPayable: results.taxPayable,
        discount: results.discount,
        penalty: results.penalty,
        finalTax: results.finalTax,
      });
      navigate('/assessmentdetails');
      window.location.reload();
    } catch (err) {
      console.error("Error adding assessment:", err);
      alert("Failed to add assessment");
    }
  };

  return (
    <div>
      {/* sidebar state passed properly */}
      <Navigation 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />

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

          <label>Description:</label>
          <input type="text" name="description" value={inputs.description} onChange={handleChange} required />

          <label>Property Type:</label>
          <select name="propertyType" value={inputs.propertyType} onChange={handleChange} required>
            <option value="Business">Business</option>
            <option value="House">House</option>
          </select>

          <label>Appraised Value:</label>
          <input type="number" name="appraisedValue" value={inputs.appraisedValue} onChange={handleChange} required />

          <label>Tax Rate (%):</label>
          <input type="number" name="taxRate" value={inputs.taxRate} onChange={handleChange} required />

          <label>Status:</label>
          <select name="status" value={inputs.status} onChange={handleChange} required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label>Payment Status:</label>
          <select name="paymentStatus" value={inputs.paymentStatus} onChange={handleChange}>
            <option value="Normal">Normal</option>
            <option value="Discount">Early Payment (15% Discount)</option>
            <option value="Penalty">Late Payment (10% Penalty)</option>
          </select>

          {/* 🔢 Tax Calculation Results */}
          <div className="results-box">
            <h3>Tax Calculation</h3>
            <p>Annual Value: {results.annualValue}</p>
            <p>Tax Payable: {results.taxPayable}</p>
            <p>Discount: {results.discount}</p>
            <p>Penalty: {results.penalty}</p>
            <p><strong>Final Tax: {results.finalTax}</strong></p>
          </div>

          <button type="submit" className="btn-submit">Add Assessment</button>
        </form>
      </div>
    </div>
  );
}

export default AddAssessment;
