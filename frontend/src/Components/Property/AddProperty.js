import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";   // ✅ added
import "./AddProperty.css";
import Nav from "../Nav/Nav";

function AddPropertyEnglish() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    branch: { en: "", si: "", ta: "" },
    division: { en: "", si: "", ta: "" },
    street: { en: "", si: "", ta: "" },
    propertyNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "propertyNo") {
      setInputs((prev) => ({ ...prev, propertyNo: value }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: { ...prev[name], en: value },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        branch: inputs.branch,
        division: inputs.division,
        street: inputs.street,
        propertyNo: inputs.propertyNo,
      };
      const response = await axios.post(
        "http://localhost:5000/properties",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Success:", response.data);

      const parts = inputs.propertyNo.split("/");
      if (parts.length === 2) {
        navigate(`/propertyassessmentdetails/${parts[0]}/${parts[1]}`);
      } else {
        navigate(`/propertyassessmentdetails/${inputs.propertyNo}/`);
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div>
      <Nav />
      <div className="form-container">
        <h2>Add New Property (English)</h2>
        <form onSubmit={handleSubmit}>
          <label>Branch / Sub Office</label>
          <select
            name="branch"
            value={inputs.branch.en}
            onChange={handleChange}
            required
          >
            <option value="">Select Branch</option>
            <option value="Horana Town">Horana Town</option>
            <option value="Munagama">Munagama</option>
          </select>

          <label>Division</label>
          <select
            name="division"
            value={inputs.division.en}
            onChange={handleChange}
            required
          >
            <option value="">Select Division</option>
            <option value="Halapitiya">Halapitiya</option>
            <option value="Godigamuwa">Godigamuwa</option>
          </select>

          <label>Street</label>
          <select
            name="street"
            value={inputs.street.en}
            onChange={handleChange}
            required
          >
            <option value="">Select Street</option>
            <option value="Hospital Road">Hospital Road</option>
            <option value="Galkaduwa Road">Galkaduwa Road</option>
          </select>

          <label>Property No</label>
          <input
            type="text"
            name="propertyNo"
            value={inputs.propertyNo}
            onChange={handleChange}
            placeholder="e.g. 123/A"
            required
          />

          <button type="submit" className="btn-submit">
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyEnglish;
