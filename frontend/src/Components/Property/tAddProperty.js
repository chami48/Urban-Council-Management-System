import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProperty.css";
import Nav from "../Nav/Nav";
import Swal from "sweetalert2";

function AddPropertyTamil() {
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
        [name]: { ...prev[name], ta: value },
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
        title: "பிழை", // "Error" in Tamil
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div>
      <Nav />
      <div className="form-container">
        <h2>புதிய சொத்தைச் சேர்க்கவும் (தமிழ்)</h2>
        <form onSubmit={handleSubmit}>
          <label>சார் அலுவலகம்</label>
          <select
            name="branch"
            value={inputs.branch.ta}
            onChange={handleChange}
            required
          >
            <option value="">அலுவலகத்தைத் தேர்ந்தெடுக்கவும்</option>
            <option value="ஹோரணை நகரம்">ஹோரணை நகரம்</option>
            <option value="முனகம">முனகம</option>
          </select>

          <label>பிரிவு</label>
          <select
            name="division"
            value={inputs.division.ta}
            onChange={handleChange}
            required
          >
            <option value="">பிரிவைத் தேர்ந்தெடுக்கவும்</option>
            <option value="ஹலபிட்டிய">ஹலபிட்டிய</option>
            <option value="கொடிகமுவ">கொடிகமுவ</option>
          </select>

          <label>தெரு</label>
          <select
            name="street"
            value={inputs.street.ta}
            onChange={handleChange}
            required
          >
            <option value="">தெருவைத் தேர்ந்தெடுக்கவும்</option>
            <option value="மருத்துவமனை சாலை">மருத்துவமனை சாலை</option>
            <option value="கல்கடுவ சாலை">கல்கடுவ சாலை</option>
          </select>

          <label>சொத்து எண்</label>
          <input
            type="text"
            name="propertyNo"
            value={inputs.propertyNo}
            onChange={handleChange}
            placeholder="உதா: 123/அ"
            required
          />

          <button type="submit" className="btn-submit">
            சொத்தைச் சேர்க்கவும்
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyTamil;
