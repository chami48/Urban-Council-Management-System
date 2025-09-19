import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BusinessLicenseApplication() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerNIC: "",
    address: "",
    category: "", // FeeCategory _id
    floorAreaM2: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from backend
    axios.get("http://localhost:5000/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log("🚀 Submitting", formData);
      const res = await axios.post("http://localhost:5000/business/apply", formData);
      const business = res.data.business;
      // ✅ Navigate to status page
      navigate(`/status/${business._id}`);
    } catch (err) {
      console.error("❌ Error", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        name="businessName"
        placeholder="Business Name"
        value={formData.businessName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ownerNIC"
        placeholder="Owner NIC"
        value={formData.ownerNIC}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Business Address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <label>Business Category</label>
      <select name="category" value={formData.category} 
      onChange={(e) => setFormData({ ...formData, category: e.target.value })} > 
      <option value="">-- Select Category --</option> 
      <option value="Grocery">Grocery</option> 
      <option value="Pharmacy">Pharmacy</option> 
      <option value="Restaurant">Restaurant</option> 
      <option value="Hardware">Hardware</option> </select>

      <input
        type="number"
        name="floorAreaM2"
        placeholder="Floor Area (m²)"
        value={formData.floorAreaM2}
        onChange={handleChange}
      />

      <button type="submit">Apply</button>
    </form>
  );
}

export default BusinessLicenseApplication;
