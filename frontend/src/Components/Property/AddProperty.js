import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProperty.css";
import Nav from "../Nav/Nav";

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
        "http://localhost:5000/properties",
        inputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);

      const parts = inputs.propertyNo.split("/");
      if (parts.length === 2) {
        navigate(`/propertyassessmentdetails/${parts[0]}/${parts[1]}`);
      } else {
        navigate(`/propertyassessmentdetails/${inputs.propertyNo}/`);
      }
    } catch (err) {
      console.error("Full error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div>
      <Nav />
      <div className="form-container">
        <h2>Add New Property</h2>
        <form onSubmit={handleSubmit}>
          {/* Branch */}
          <label>අයත් කාර්යාලය /උප කාර්යාලය | Branch / Sub office</label>
          <select
            name="branch"
            value={inputs.branch}
            onChange={handleChange}
            required
          >
            <option value="">Select Branch</option>
            <option value="Horana Town">Horana Town</option>
            <option value="Munagama">Munagama</option>
            <option value="Halapitiya">Halapitiya</option>
            <option value="Godigamuwa">Godigamuwa</option>
            <option value="Thalagala">Thalagala</option>
            <option value="Ingiriya">Ingiriya</option>
            <option value="Arakawila">Arakawila</option>
            <option value="Handapangoda">Handapangoda</option>
            <option value="Millewa">Millewa</option>
            <option value="Pokunuwita">Pokunuwita</option>
            <option value="Batuwita">Batuwita</option>
            <option value="Kananwila">Kananwila</option>
            <option value="Wewala">Wewala</option>
            <option value="Uduwa">Uduwa</option>
            <option value="Palannoruwa">Palannoruwa</option>
            <option value="Oluboduwa">Oluboduwa</option>
            <option value="Kurana">Kurana</option>
          </select>
          {/* Division (wards in Horana PS) */}
          <label>කොට්ඨාශය | Division</label>
          <select
            name="division"
            value={inputs.division}
            onChange={handleChange}
            required
          >
            <option value="">Select Division</option>
            <option value="Halapitiya">Halapitiya</option>
            <option value="Godigamuwa">Godigamuwa</option>
            <option value="Palannoruwa">Palannoruwa</option>
            <option value="Oluboduwa">Oluboduwa</option>
            <option value="Thalagala">Thalagala</option>
            <option value="Kahatapitiya">Kahatapitiya</option>
            <option value="Millewa">Millewa</option>
            <option value="Kotigamgoda">Kotigamgoda</option>
            <option value="Kindelpitiya">Kindelpitiya</option>
            <option value="Meewanapalana">Meewanapalana</option>
            <option value="Pelpitigoda">Pelpitigoda</option>
            <option value="Handapangoda">Handapangoda</option>
            <option value="Arakawila">Arakawila</option>
            <option value="Kurana">Kurana</option>
            <option value="Maha Ingiriya">Maha Ingiriya</option>
            <option value="Urugala">Urugala</option>
            <option value="Ingiriya">Ingiriya</option>
            <option value="Maputugala">Maputugala</option>
            <option value="Wagawatte">Wagawatte</option>
            <option value="Gurugoda">Gurugoda</option>
            <option value="Uduwa">Uduwa</option>
            <option value="Kananwila">Kananwila</option>
            <option value="Batuwita">Batuwita</option>
            <option value="Kubuka">Kubuka</option>
            <option value="Pokunuwita">Pokunuwita</option>
            <option value="Kulupana">Kulupana</option>
            <option value="Midellamulahena">Midellamulahena</option>
            <option value="Narthanagala">Narthanagala</option>
            <option value="Wewala">Wewala</option>
          </select>

          {/* Streets */}
          <label>මාර්ගය | Street Name</label>
          <select
            name="street"
            value={inputs.street}
            onChange={handleChange}
            required
          >
            <option value="">Select Street</option>
            <option value="1st Lane">1st Lane</option>
            <option value="Albet Peiris Mawatha">Albet Peiris Mawatha</option>
            <option value="BDL Gunasekara Mawatha">
              BDL Gunasekara Mawatha
            </option>
            <option value="Dhammarathana Mawatha">Dhammarathana Mawatha</option>
            <option value="Galkaduwa Road">Galkaduwa Road</option>
            <option value="Hospital Road">Hospital Road</option>
            <option value="Jayasuriya Waththa">Jayasuriya Waththa</option>
            <option value="Seelarathana Mawatha">Seelarathana Mawatha</option>
            <option value="Sri Ariyawilasa Road">Sri Ariyawilasa Road</option>
            <option value="Sri Somananda Lane">Sri Somananda Lane</option>
            <option value="Sri Sumangala Road">Sri Sumangala Road</option>
            <option value="Suderis Silva Mawatha">Suderis Silva Mawatha</option>
          </select>

          {/* Property Numbers (dummy examples – replace with actual records) */}
          <label>වරිපනම් අංකය | Property No</label>
          <input
            type="text"
            name="propertyNo"
            value={inputs.propertyNo}
            onChange={handleChange}
            placeholder="e.g. 123/A"
            required
          />

          <button type="submit" className="btn-submit">
            Add property
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
