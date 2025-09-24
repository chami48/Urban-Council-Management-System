import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateAssessment() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/assessments/${id}`);
setInputs(res.data.assessment || {});

      } catch (err) {
        console.error("Error fetching assessment:", err);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/assessments/${id}`, {
        assessmentNo: String(inputs.assessmentNo),
        division: String(inputs.division),
        street: String(inputs.street),
        propertyNo: String(inputs.propertyNo),
        ownerName: String(inputs.ownerName),
        ownerNIC: String(inputs.ownerNIC),
        contactNo: String(inputs.contactNo),
        description: String(inputs.description),
        propertyType: String(inputs.propertyType),
        appraisedValue: Number(inputs.appraisedValue),
        taxRate: Number(inputs.taxRate),
        status: String(inputs.status),
      });
    } catch (err) {
      console.error("Error updating assessment:", err);
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => navigate("/assessmentdetails"));
  };

  return (
    <div className="form-container">
      <h1>Update Assessment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="assessmentNo">Assessment No:</label>
        <input
          type="text"
          id="assessmentNo"
          name="assessmentNo"
          value={inputs.assessmentNo || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="division">Division:</label>
        <input
          type="text"
          id="division"
          name="division"
          value={inputs.division || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="street">Street:</label>
        <input
          type="text"
          id="street"
          name="street"
          value={inputs.street || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="propertyNo">Property No:</label>
        <input
          type="text"
          id="propertyNo"
          name="propertyNo"
          value={inputs.propertyNo || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="ownerName">Owner Name:</label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          value={inputs.ownerName || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="ownerNIC">Owner NIC:</label>
        <input
          type="text"
          id="ownerNIC"
          name="ownerNIC"
          value={inputs.ownerNIC || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="contactNo">Contact No:</label>
        <input
          type="text"
          id="contactNo"
          name="contactNo"
          value={inputs.contactNo || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={inputs.description || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="propertyType">Property Type:</label>
        <select
          id="propertyType"
          name="propertyType"
          value={inputs.propertyType || ""}
          onChange={handleChange}
          required
        >
          <option value="වාණිජ">වාණිජ</option>
          <option value="නේවාසික">නේවාසික</option>
        </select>

        <label htmlFor="annualValue">Appraised Value:</label>
        <input
          type="number"
          id="appraisedValue"
          name="appraisedValue"
          value={inputs.appraisedValue || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="taxRate">Tax Rate (%):</label>
        <input
          type="number"
          id="taxRate"
          name="taxRate"
          value={inputs.taxRate || ""}
          onChange={handleChange}
          required
        />

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={inputs.status || ""}
          onChange={handleChange}
          required
        >
          <option value="ක්‍රියාකාරී">ක්‍රියාකාරී</option>
          <option value="අක්‍රිය">අක්‍රිය</option>
        </select>

        <button type="submit" className="btn btn-update">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateAssessment;