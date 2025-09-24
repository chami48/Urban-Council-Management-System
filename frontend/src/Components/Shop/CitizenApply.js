import React, { useState } from "react";
import { User, Building, Phone, Mail, MapPin, FileText, Clock, Users, Zap, Upload } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Swal from "sweetalert2";


function CitizenApply() {
  const [form, setForm] = useState({
    // Personal Information
    applicantName: "",
    nicNumber: "",
    phone: "",
    email: "",
    permanentAddress: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Business Information
    shopName: "",
    businessCategory: "",
    shopNo: "",
    shopAddress: "",
    shopArea: null,
    proposedActivities: "",
    
    // Rental Information
    requestedRent: "",
    leaseDuration: "",
    
    // Additional Information
    expectedEmployees: "",
    previousExperience: "",
    utilitiesNeeded: [],
    additionalRequirements: "",
    
    // Declarations
    agreeTerms: false,
    informationAccurate: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const businessCategories = [
    "Retail Store",
    "Restaurant/Food Service",
    "Beauty Salon/Barbershop",
    "Electronics/Mobile",
    "Clothing/Textile",
    "Pharmacy/Medical",
    "Stationery/Books",
    "Hardware/Tools",
    "Jewelry",
    "Other"
  ];

  // ✅ Validation-enhanced handleChange
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (type === "checkbox") {
    if (name === "utilitiesNeeded") {
      setForm((prev) => ({
        ...prev,
        utilitiesNeeded: checked
          ? [...prev.utilitiesNeeded, value]
          : prev.utilitiesNeeded.filter((item) => item !== value),
      }));
    } else {
      setForm({ ...form, [name]: checked });
    }
    return;
  }

  // Applicant & Emergency Contact → only letters + spaces
  if (name === "applicantName" || name === "emergencyContact") {
    if (/^[A-Za-z\s]*$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
    return;
  }

  // NIC → 9 digits + V/v OR 12 digits
  if (name === "nicNumber") {
    if (/^[0-9]{0,9}[Vv]?$/.test(value) || /^[0-9]{0,12}$/.test(value)) {
      setForm({ ...form, [name]: value });
    }
    return;
  }

  // Phone numbers → only digits, max 10
  if (name === "phone" || name === "emergencyPhone") {
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setForm({ ...form, [name]: value });
    }
    return;
  }

  // Numbers ≥ 1 → shopArea, requestedRent
  if (name === "shopArea" || name === "requestedRent") {
    if (value === "" || Number(value) >= 1) {
      setForm({ ...form, [name]: value });
    }
    return;
  }
  

  // Default fallback
  setForm({ ...form, [name]: value });
};
const navigate = useNavigate();
const handleSubmit = async () => {
  try {

    const formData = new FormData();

    // append normal fields
    for (const key in form) {
      if (key !== "documents") {
        if (Array.isArray(form[key])) {
          form[key].forEach(val => formData.append(key, val));
        } else {
          formData.append(key, form[key]);
        }
      }
    }

    // append files
    if (form.documents) {
      for (let i = 0; i < form.documents.length; i++) {
        formData.append("documents", form.documents[i]);
      }
    }

    const res = await axios.post(
      "http://localhost:5000/api/shop-applications/apply",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    console.log("Saved:", res.data);
    Swal.fire({ icon: "success", title: "Application submitted successfully!", timer: 2500, showConfirmButton: false });

    // Save NIC for MyApplications.js
    if (form.nicNumber) {
      localStorage.setItem("citizenNIC", form.nicNumber);
    }

    // Navigate after success
    navigate("/my-applications");
    
  } catch (err) {
    console.error("❌ Error submitting:", err.response?.data || err.message);
    Swal.fire({ icon: "error", title: "Error", text: "Error submitting application. Please try again." });
  }
};




  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderProgressBar = () => (
   
    <div className="mb-8">
      
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
              step <= currentStep
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Personal Info</span>
        <span>Business Details</span>
        <span>Requirements</span>
        <span>Review</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <User className="mr-2 text-orange-600" size={24} />
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number *</label>
          <input
            type="text"
            name="nicNumber"
            value={form.nicNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address *</label>
        <textarea
          name="permanentAddress"
          value={form.permanentAddress}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
          <input
            type="tel"
            name="emergencyPhone"
            value={form.emergencyPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Building className="mr-2 text-orange-600" size={24} />
        Business Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop/Business Name *</label>
          <input
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
          <select
            name="businessCategory"
            value={form.businessCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select Category</option>
            {businessCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Shop Number</label>
          <input
            type="text"
            name="shopNo"
            value={form.shopNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., S-101"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Area (sq ft) *</label>
          <input
            type="number"
            name="shopArea"
            value={form.shopArea}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address/Location *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            name="shopAddress"
            value={form.shopAddress}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Business Activities *</label>
        <textarea
          name="proposedActivities"
          value={form.proposedActivities}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Describe the type of business activities you plan to conduct..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Previous Business Experience</label>
        <textarea
          name="previousExperience"
          value={form.previousExperience}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Brief description of your business experience..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FileText className="mr-2 text-orange-600" size={24} />
        Requirements & Preferences
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requested Monthly Rent (LKR) *</label>
          <input
            type="number"
            name="requestedRent"
            value={form.requestedRent}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Lease Duration</label>
          <select
            name="leaseDuration"
            value={form.leaseDuration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select Duration</option>
            <option value="1-year">1 Year</option>
            <option value="2-years">2 Years</option>
            <option value="3-years">3 Years</option>
            <option value="5-years">5 Years</option>
            <option value="long-term">Long Term (5+ years)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Number of Employees</label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="number"
              name="expectedEmployees"
              value={form.expectedEmployees}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Required Utilities/Facilities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["Electricity", "Water Supply", "Internet/WiFi", "Parking Space", "Storage Area", "Air Conditioning"].map((utility) => (
            <label key={utility} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="utilitiesNeeded"
                value={utility}
                checked={form.utilitiesNeeded.includes(utility)}
                onChange={handleChange}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{utility}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
        <textarea
          name="additionalRequirements"
          value={form.additionalRequirements}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Any additional requirements or special requests..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Document Upload</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto text-gray-400 mb-2" size={48} />
          <p className="text-gray-600">Upload required documents (NIC, Business Plan, etc.)</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG files up to 5MB each</p>
          <input
            type="file"
            name="documents"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setForm({ ...form, documents: e.target.files })}
          />

          <button
            type="button"
            className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            Choose Files
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Clock className="mr-2 text-orange-600" size={24} />
        Review & Submit
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold">Application Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Name:</strong> {form.applicantName}</div>
          <div><strong>NIC:</strong> {form.nicNumber}</div>
          <div><strong>Shop Name:</strong> {form.shopName}</div>
          <div><strong>Category:</strong> {form.businessCategory}</div>
          <div><strong>Requested Rent:</strong> LKR {form.requestedRent}</div>
          <div><strong>Shop Area:</strong> {form.shopArea} sq ft</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="informationAccurate"
            checked={form.informationAccurate}
            onChange={handleChange}
            className="mt-1 rounded text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">
            I certify that all information provided in this application is accurate and complete to the best of my knowledge.
          </span>
        </label>
        
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="mt-1 rounded text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the terms and conditions set by Horana Urban Council for shop registration and rental.
          </span>
        </label>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Processing time: 7-14 business days</li>
          <li>• You will be contacted for verification and inspection</li>
          <li>• Additional documents may be requested</li>
          <li>• Application fee is non-refundable</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div>
     <Nav/>
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop Registration Application</h1>
          <p className="text-gray-600 mt-2">Horana Urban Council</p>
        </div>
        
        {renderProgressBar()}
        
        <div className="space-y-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agreeTerms || !form.informationAccurate}
                className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                  form.agreeTerms && form.informationAccurate
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default CitizenApply;