import React, { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AddAssessment() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    assessmentNo: "",
    division: "",
    street: "",
    propertyNo: "",
    ownerName: "",
    ownerNIC: "",
    description: "",
    contactNo: "",
    propertyType: "Bussiness",
    appraisedValue: "",
    taxRate: "",
    lat: "",
    lng: "",
    status: "Active"
  });

  // ✅ Custom onChange validation rules
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ownerName") {
      // Only letters + spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "ownerNIC") {
      // Allow typing NIC in two formats:
      // - up to 9 digits + optional V/v
      // - up to 12 digits
      if (/^[0-9]{0,9}[Vv]?$/.test(value) || /^[0-9]{0,12}$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "contactNo") {
      // Only digits, max 10
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "appraisedValue") {
      // Must be number >= 1
      if (value === "" || Number(value) >= 1) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Mock API call - replace with axios/fetch in real app
      console.log('Submitting:', {
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
        status: inputs.status
      });

      await Swal.fire({
        title: "Success!",
        text: "Assessment added successfully!",
        icon: "success",
        confirmButtonText: "OK"
      });

      navigate('/assessmentdetails');
    } catch (err) {
      console.error("Error adding assessment:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to add assessment",
        icon: "error",
        confirmButtonText: "Try Again"
      });
    }
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Add New Property Assessment</h2>
              <p className="text-slate-600">Complete the form below to register a new property assessment</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h3 className="text-xl font-semibold text-white">Property Information</h3>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Assessment No */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Assessment No <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="assessmentNo" 
                      value={inputs.assessmentNo} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter assessment number"
                    />
                  </div>

                  {/* Division */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Division <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="division" 
                      value={inputs.division} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter division"
                    />
                  </div>

                  {/* Street */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Street <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="street" 
                      value={inputs.street} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter street name"
                    />
                  </div>

                  {/* Property No */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Property No <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="propertyNo" 
                      value={inputs.propertyNo} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter property number"
                    />
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="ownerName" 
                      value={inputs.ownerName} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter owner's full name"
                    />
                  </div>

                  {/* Owner NIC */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Owner NIC <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="ownerNIC" 
                      value={inputs.ownerNIC} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter NIC number"
                    />
                  </div>

                  {/* Contact No */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Contact No <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="contactNo" 
                      value={inputs.contactNo} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                      placeholder="Enter contact number"
                    />
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Property Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="propertyType" 
                      value={inputs.propertyType} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Bussiness">Business</option>
                      <option value="House">House</option>
                    </select>
                  </div>

                  {/* Appraised Value */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Appraised Value <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500">Rs.</span>
                      <input 
                        type="number" 
                        name="appraisedValue" 
                        value={inputs.appraisedValue} 
                        onChange={handleChange} 
                        required 
                        min={1}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Tax Rate */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Tax Rate <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="taxRate" 
                        value={inputs.taxRate} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                        placeholder="Enter tax rate"
                        step="0.01"
                      />
                      <span className="absolute right-3 top-3 text-slate-500">%</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="status" 
                      value={inputs.status} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      name="description" 
                      value={inputs.description} 
                      onChange={handleChange} 
                      required 
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg resize-none"
                      placeholder="Enter property description..."
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button 
                    type="button" 
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg"
                  >
                    Add Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAssessment;
