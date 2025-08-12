import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './AddProperty.css';

function AddProperty() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    branch: "",
    division: "",
    street: "",
    propertyNo: "", 
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
    console.log("Submitting:", inputs);
    
    try {
      const response = await axios.post(
        "http://localhost:5001/properties", 
        inputs,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Success:", response.data);
      
      // Navigate with proper URL encoding for property numbers containing slashes
      const encodedPropertyNo = encodeURIComponent(inputs.propertyNo);
      // Split by slash and pass as separate parameters for cleaner routing
      const parts = inputs.propertyNo.split('/');
      if (parts.length === 2) {
        navigate(`/propertyassessmentdetails/${parts[0]}/${parts[1]}`);
      } else {
        // Fallback for property numbers without slashes
        navigate(`/propertyassessmentdetails/${inputs.propertyNo}/`);
      }
      
    } catch (err) {
      console.error("Full error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit}>

        <label>අයත් කාර්යාලය /උප කාර්යාලය | Branch / Sub office</label>
        <select
          name="branch"
          value={inputs.branch}
          onChange={handleChange}
          required
        >
          <option value="">Select Branch</option>
          <option value="Vihara 1">Vihara 1</option>
          <option value="Vihara 2">Vihara 2</option>
          <option value="Vihara 3">Vihara 3</option>
          <option value="Vihara 4">Vihara 4</option>
        </select>

        <label>කොට්ඨාශය | Division</label>
        <select
          name="division"
          value={inputs.division}
          onChange={handleChange}
          required
        >
          <option value="">Select Division</option>
          <option value="Vihara lane">Vihara lane</option>
          <option value="Gamunu lane">Gamunu lane</option>
          <option value="Parakum lane">Parakum lane</option>
          <option value="Vijayabha lane">Vijayabha lane</option>
        </select>

        <label>මාර්ගය | Street Name</label>
        <select
          name="street"
          value={inputs.street}
          onChange={handleChange}
          required
        >
          <option value="">Select Street</option>
          <option value="lane1">lane1</option>
          <option value="lane2">lane2</option>
          <option value="lane3">lane3</option>
          <option value="lane4">lane4</option>
        </select>

        <label>වරිපනම් අංකය | Property No</label>
        <select
          name="propertyNo"
          value={inputs.propertyNo}
          onChange={handleChange}
          required
        >
          <option value="">Select Property No</option>
          <option value="123/B">123/B</option>
          <option value="145/B">145/B</option>
          <option value="456/A">456/A</option>
          <option value="010/A">010/A</option>
        </select>

        <button type="submit" className="btn-submit">Add property</button>
      </form>
    </div>
  );
}

export default AddProperty;