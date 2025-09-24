import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProperty.css";
import Nav from "../Nav/Nav";
import Swal from "sweetalert2"; 

function AddPropertySinhala() {
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
        [name]: { ...prev[name], si: value },
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
        <h2>අලුත් වස්තුවක් එක් කරන්න (සිංහල)</h2>
        <form onSubmit={handleSubmit}>
          {/* Branch */}
          <label>අයත් කාර්යාලය / උප කාර්යාලය</label>
          <select
            name="branch"
            value={inputs.branch.si}
            onChange={handleChange}
            required
          >
            <option value="">කාර්යාලය තෝරන්න</option>
            <option value="හොරණ නගරය">හොරණ නගරය</option>
            <option value="මුනගම">මුනගම</option>
            <option value="හලපිටිය">හලපිටිය</option>
          </select>

          {/* Division */}
          <label>කොට්ඨාශය</label>
          <select
            name="division"
            value={inputs.division.si}
            onChange={handleChange}
            required
          >
            <option value="">කොට්ඨාශය තෝරන්න</option>
            <option value="හලපිටිය">හලපිටිය</option>
            <option value="ගොඩිගමුව">ගොඩිගමුව</option>
          </select>

          {/* Street */}
          <label>මාර්ගය</label>
          <select
            name="street"
            value={inputs.street.si}
            onChange={handleChange}
            required
          >
            <option value="">මාර්ගය තෝරන්න</option>
            <option value="රෝහල මාවත">රෝහල මාවත</option>
            <option value="ගල්කඩුව මාවත">ගල්කඩුව මාවත</option>
          </select>

          {/* Property No */}
          <label>වරිපනම් අංකය</label>
          <input
            type="text"
            name="propertyNo"
            value={inputs.propertyNo}
            onChange={handleChange}
            placeholder="උදා. 123/A"
            required
          />

          <button type="submit" className="btn-submit">
            වස්තුව එකතු කරන්න
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPropertySinhala;
