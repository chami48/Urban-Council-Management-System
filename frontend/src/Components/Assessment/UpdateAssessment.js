// src/Components/Assessment/UpdateAssessment.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Swal from "sweetalert2";

function UpdateAssessment() {
  const [inputs, setInputs] = useState({
    assessmentNo: "",
    division: "",
    street: "",
    propertyNo: "",
    ownerName: "",
    ownerNIC: "",
    description: "",
    contactNo: "",
    propertyType: "Business",
    appraisedValue: "0",
    taxRate: "",
    status: "Active",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  //sidebar state added
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ Load existing record
  useEffect(() => {
  const fetchHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/assessments/${id}`);
      if (res.data?.assessment) {
        // 🔥 Normalize propertyType here
        setInputs({
          ...res.data.assessment,
          propertyType:
            res.data.assessment.propertyType === "Bussiness"
              ? "Business"
              : res.data.assessment.propertyType,
        });
      }
    } catch (err) {
      console.error("Error fetching assessment:", err);
    }
  };
  fetchHandler();
}, [id]);


  // ✅ Input validation (same as AddAssessment)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ownerName") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "ownerNIC") {
      if (/^[0-9]{0,9}[Vv]?$/.test(value) || /^[0-9]{0,12}$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "contactNo") {
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "appraisedValue") {
      const raw = value.replace(/Rs\s?/g, "").replace(/,/g, "");
      if (raw === "" || !isNaN(raw)) {
        setInputs((prev) => ({ ...prev, appraisedValue: raw }));
      }
      return;
    }

    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
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
      };

      await axios.put(`http://localhost:5000/assessments/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      await Swal.fire({
        title: "Updated!",
        text: "Assessment updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/assessmentdetails");
    } catch (err) {
      console.error("Error updating assessment:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to update assessment",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div>
      <Navigation
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Update Property Assessment
              </h2>
              <p className="text-slate-600">
                Edit the details below and save changes
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h3 className="text-xl font-semibold text-white">
                  Property Information
                </h3>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Assessment No */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Assessment No *
                  </label>
                  <input
                    type="text"
                    name="assessmentNo"
                    value={inputs.assessmentNo || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Division *
                  </label>
                  <input
                    type="text"
                    name="division"
                    value={inputs.division || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Street *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={inputs.street || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                <select
                  name="propertyType"
                  value={inputs.propertyType || "Business"}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Business">Business</option>
                  <option value="House">House</option>
                </select>

                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={inputs.ownerName || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Owner NIC */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Owner NIC *
                  </label>
                  <input
                    type="text"
                    name="ownerNIC"
                    value={inputs.ownerNIC || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Contact No */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Contact No *
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={inputs.contactNo || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={inputs.propertyType || "Business"}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Business">Business</option>
                    <option value="House">House</option>
                  </select>
                </div>

                {/* Appraised Value */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Appraised Value *
                  </label>
                  <input
                    type="number"
                    name="appraisedValue"
                    value={inputs.appraisedValue || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Tax Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Tax Rate (%) *
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={inputs.taxRate || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={inputs.status || "Active"}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={inputs.description || ""}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/assessmentdetails")}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg"
                  >
                    Update Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateAssessment;
