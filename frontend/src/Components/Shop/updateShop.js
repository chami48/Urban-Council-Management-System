import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Nav from "../Nav/Nav";

const UpdateApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicantName: "",
    nicNumber: "",
    phone: "",
    email: "",
    permanentAddress: "",
    shopName: "",
    businessCategory: "",
    shopNo: "",
    shopAddress: "",
    shopArea: "",
    proposedActivities: "",
    previousExperience: "",
    requestedRent: "",
    leaseDuration: "",
    expectedEmployees: "",
    additionalRequirements: "",
  });
  const [files, setFiles] = useState([]);

  // ✅ Fetch existing application
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shop-applications/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching application:", error);
        Swal.fire("Error", "Unable to fetch application data.", "error");
      }
    };
    fetchApplication();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file upload
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // ✅ Submit updated application
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      for (let i = 0; i < files.length; i++) {
        data.append("documents", files[i]);
      }

      await axios.put(`http://localhost:5000/api/shop-applications/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Application updated successfully.", "success");
      navigate("/my-applications");
    } catch (error) {
      console.error("Error updating application:", error);
      Swal.fire("Error", "Failed to update application.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition">
      <Nav />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-10">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">✏️ Update Shop Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Applicant Info */}
          <input
            type="text"
            name="applicantName"
            placeholder="Applicant Name"
            value={formData.applicantName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="nicNumber"
            placeholder="NIC Number"
            value={formData.nicNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            value={formData.permanentAddress}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Shop Info */}
          <input
            type="text"
            name="shopName"
            placeholder="Shop Name"
            value={formData.shopName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="shopNo"
            placeholder="Shop Number"
            value={formData.shopNo}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="businessCategory"
            placeholder="Business Category"
            value={formData.businessCategory}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="shopAddress"
            placeholder="Shop Address"
            value={formData.shopAddress}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            name="shopArea"
            placeholder="Shop Area (sqft)"
            value={formData.shopArea}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Rental Info */}
          <input
            type="number"
            name="requestedRent"
            placeholder="Requested Rent"
            value={formData.requestedRent}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="leaseDuration"
            placeholder="Lease Duration"
            value={formData.leaseDuration}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {/* Additional */}
          <textarea
            name="proposedActivities"
            placeholder="Proposed Activities"
            value={formData.proposedActivities}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          ></textarea>
          <textarea
            name="previousExperience"
            placeholder="Previous Experience"
            value={formData.previousExperience}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          ></textarea>
          <textarea
            name="additionalRequirements"
            placeholder="Additional Requirements"
            value={formData.additionalRequirements}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          ></textarea>

          {/* File Upload */}
          <div>
            <label className="block mb-2">Upload New Documents (optional):</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Update Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateApplication;
