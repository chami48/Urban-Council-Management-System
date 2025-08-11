import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './AddProperty.css';

function AddProperty() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    branch: "",       // අයත් කාර්යාලය /උප කාර්යාලය | Branch / Sub office*
    division: "",     // කොට්ඨාශය | Division*
    street: "",       // මාර්ගය | Street Name*
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
    try {
      await axios.post("http://localhost:5001/properties", {
        branch: inputs.branch,
        division: inputs.division,
        street: inputs.street,
        propertyNo: inputs.propertyNo,
      });
      navigate('/propertydetails');
      window.location.reload();
    } catch (err) {
      console.error("Error adding assessment:", err);
      alert("Failed to add Property");
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

<label>කොට්ඨාශය | Division*</label>
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
  <option value="123B">123B</option>
  <option value="145/B">145/B</option>
  <option value="456A">456A</option>
  <option value="010A">010A</option>
</select>




        <button type="submit" className="btn-submit">Add property</button>
      </form>
    </div>
  );
}

export default AddProperty;
