// src/Components/CrematoriumForm/CrematoriumForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:5000/crematorium";

export default function CrematoriumForm() {
  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [formData, setFormData] = useState({
    applicantFullName: "",
    address: "",
    applicantEmail: "",
    nic: "",
    deceasedFullName: "",
    dateOfDeath: "",
    residenceArea: "within",
    registrationNumber: "",
    naturalDeathCertificate: "",
    cremationDate: "",
    startTime: "",
    endTime: "",
    declarationAgreement: false,
  });

  const [errors, setErrors] = useState({});
  const [deathCertificateFile, setDeathCertificateFile] = useState(null);
  const [beOrderFile, setBeOrderFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  useEffect(() => {
    if (!storedUser) navigate("/log");
  }, [storedUser, navigate]);

  useEffect(() => {
    if (!storedUser) return;
    setFormData((p) => ({
      ...p,
      applicantFullName: p.applicantFullName || storedUser.name || "",
      applicantEmail: p.applicantEmail || storedUser.email || "",
    }));
  }, [storedUser]);

  // SweetAlert2 Configuration (English)
  const showSuccessAlert = (title, text, onConfirm) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#10B981",
      background: "#F0FDF4",
      color: "#166534",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-lg font-bold mb-2",
        content: "text-sm leading-relaxed",
        confirmButton: "px-6 py-2 rounded-lg font-semibold",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed && onConfirm) onConfirm();
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#EF4444",
      background: "#FEF2F2",
      color: "#991B1B",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-lg font-bold mb-2",
        content: "text-sm leading-relaxed",
        confirmButton: "px-6 py-2 rounded-lg font-semibold",
      },
      buttonsStyling: false,
    });
  };

  const showWarningAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#F59E0B",
      background: "#FFFBEB",
      color: "#92400E",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-lg font-bold mb-2",
        content: "text-sm leading-relaxed",
        confirmButton: "px-6 py-2 rounded-lg font-semibold",
      },
      buttonsStyling: false,
    });
  };

  const showInfoAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#3B82F6",
      background: "#EFF6FF",
      color: "#1E40AF",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-lg font-bold mb-2",
        content: "text-sm leading-relaxed",
        confirmButton: "px-6 py-2 rounded-lg font-semibold",
      },
      buttonsStyling: false,
    });
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Please wait...",
      text: "Submitting your request",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: "#EFF6FF",
      color: "#1E40AF",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-lg font-bold mb-2",
        content: "text-sm leading-relaxed",
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // Name sanitization (Latin + Sinhala + Tamil)
  const NAME_ALLOWED_REGEX = /[a-zA-ZÀ-ÿ\u0D80-\u0DFF\u0B80-\u0BFF\s.'-]/;
  const sanitizeName = (raw) => {
    if (!raw) return "";
    const cleaned = [...raw].filter((ch) => NAME_ALLOWED_REGEX.test(ch)).join("");
    return cleaned.replace(/\s{2,}/g, " ").trimStart();
  };

  // Validation (English messages)
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 100) return "Name cannot exceed 100 characters";
    if (/\d/.test(name)) return "Numbers are not allowed in the name";
    if (!/^[a-zA-ZÀ-ÿ\u0D80-\u0DFF\u0B80-\u0BFF\s.'-]+$/.test(name)) return "Invalid name";
    return "";
  };

  const validateNIC = (nic) => {
    if (!nic.trim()) return "NIC is required";
    const cleanNIC = nic.replace(/\s/g, "");
    if (cleanNIC.length > 12) return "NIC is too long";
    const oldFormat = /^[0-9]{9}[vVxX]$/;
    const newFormat = /^[0-9]{12}$/;
    if (!oldFormat.test(cleanNIC) && !newFormat.test(cleanNIC)) {
      return "Invalid NIC (9 digits + V/X or 12 digits)";
    }
    return "";
  };

  const validateAddress = (address) => {
    if (!address.trim()) return "Address is required";
    if (address.trim().length < 5) return "Please provide a more detailed address";
    if (address.trim().length > 200) return "Address cannot exceed 200 characters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email address";
    return "";
  };

  const validateDate = (date, fieldName = "Date") => {
    if (!date) return `${fieldName} is required`;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fieldName === "Date of Death" && selectedDate > today) {
      return "Date of Death cannot be in the future";
    }
    if (fieldName === "Cremation Date" && selectedDate < today) {
      return "Cremation Date cannot be in the past";
    }
    return "";
  };

  const validateTime = (startTime, endTime) => {
    const errors = {};
    if (!startTime) errors.startTime = "Start time is required";
    if (!endTime) errors.endTime = "End time is required";

    if (startTime && endTime) {
      const toMin = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      if (toMin(startTime) >= toMin(endTime)) {
        errors.endTime = "End time must be after start time";
      }

      if (toMin(endTime) - toMin(startTime) < 60) {
        errors.endTime = "A minimum duration of 1 hour is required";
      }
    }
    return errors;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "applicantFullName":
      case "deceasedFullName":
        error = validateName(value);
        break;
      case "nic":
        error = validateNIC(value);
        break;
      case "applicantEmail":
        error = validateEmail(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
      case "dateOfDeath":
        error = validateDate(value, "Date of Death");
        break;
      case "cremationDate":
        error = validateDate(value, "Cremation Date");
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Sanitize name fields and enforce length
    if (name === "applicantFullName" || name === "deceasedFullName") {
      newValue = sanitizeName(newValue);
      if (newValue.length > 100) return;
    }

    // Enforce max lengths
    if (name === "address" && newValue.length > 200) return;
    if (name === "nic" && newValue.length > 12) return;
    if (name === "registrationNumber" && newValue.length > 50) return;
    if (name === "naturalDeathCertificate" && newValue.length > 300) return;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name !== "declarationAgreement" && type !== "checkbox") {
      const fieldError = validateField(name, newValue);
      if (fieldError) setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    if (name === "startTime" || name === "endTime") {
      setAvailability(null);
      const timeErrors = validateTime(
        name === "startTime" ? newValue : formData.startTime,
        name === "endTime" ? newValue : formData.endTime
      );
      setErrors((prev) => ({
        ...prev,
        startTime: timeErrors.startTime || "",
        endTime: timeErrors.endTime || "",
      }));
    }

    if (name === "cremationDate") {
      setAvailability(null);
    }
  };

  const todayISO = new Date().toISOString().slice(0, 10);

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setDeathCertificateFile(file);
    if (errors.deathCertificateFile) {
      setErrors((prev) => ({ ...prev, deathCertificateFile: "" }));
    }
  };

  const handleBeOrderFileChange = (e) => setBeOrderFile(e.target.files[0] || null);

  const checkAvailability = async () => {
    if (!formData.cremationDate) {
      showWarningAlert("Attention!", "Please select a cremation date.");
      return setAvailability({ available: false, message: "Select a cremation date" });
    }
    if (!formData.startTime || !formData.endTime) {
      showWarningAlert("Attention!", "Please provide both start and end times.");
      return setAvailability({
        available: false,
        message: "Both start and end times are required",
      });
    }

    try {
      setCheckingAvail(true);
      const res = await axios.post(
        `${API_BASE}/check-availability`,
        {
          date: formData.cremationDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        { withCredentials: true }
      );

      setAvailability(res.data);

      if (res.data.available) {
        showSuccessAlert("Success!", "The selected time is available.");
      } else {
        showErrorAlert("Unavailable!", "The selected time is not available. Please choose another.");
      }
    } catch (e) {
      console.error(e);
      setAvailability({ available: false, message: "Server error checking availability" });
      showErrorAlert("Error!", "An error occurred while checking availability. Please try again.");
    } finally {
      setCheckingAvail(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.applicantFullName = validateName(formData.applicantFullName);
    newErrors.address = validateAddress(formData.address);
    newErrors.applicantEmail = validateEmail(formData.applicantEmail);
    newErrors.nic = validateNIC(formData.nic);
    newErrors.deceasedFullName = validateName(formData.deceasedFullName);
    newErrors.dateOfDeath = validateDate(formData.dateOfDeath, "Date of Death");
    newErrors.cremationDate = validateDate(formData.cremationDate, "Cremation Date");

    const timeErrors = validateTime(formData.startTime, formData.endTime);
    Object.assign(newErrors, timeErrors);

    if (!deathCertificateFile) {
      newErrors.deathCertificateFile = "Death certificate is required";
    }

    if (!formData.declarationAgreement) {
      newErrors.declarationAgreement = "You must agree to the declaration";
    }

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showWarningAlert(
        "Form incomplete!",
        "Please complete all required fields and fix the errors."
      );
      return;
    }

    showLoadingAlert();

    try {
      setSubmitting(true);

      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (storedUser?._id) data.append("userId", storedUser._id);

      if (deathCertificateFile) data.append("deathCertificateImage", deathCertificateFile);
      if (beOrderFile) data.append("beOrderImage", beOrderFile);

      await axios.post(`${API_BASE}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      showSuccessAlert(
        "Submitted successfully!",
        "Your crematorium application was submitted. Redirecting to My Bookings...",
        () => navigate("/my-bookings")
      );
    } catch (err) {
      console.error(err?.response?.data || err);
      const errorMessage =
        err?.response?.data?.message || "An error occurred while submitting the application.";
      showErrorAlert("Submission failed!", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const isFormIncomplete =
    !formData.applicantFullName ||
    !formData.address ||
    !formData.applicantEmail ||
    !formData.nic ||
    !formData.deceasedFullName ||
    !formData.dateOfDeath ||
    !formData.cremationDate ||
    !formData.startTime ||
    !formData.endTime ||
    !deathCertificateFile ||
    !formData.declarationAgreement;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Application for Crematorium Facilities
              </h1>
              <p className="text-gray-600">Please complete all required information</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Applicant Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Applicant Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      name="applicantFullName"
                      value={formData.applicantFullName}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.applicantFullName ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Applicant Full Name"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.applicantFullName ? (
                        <p className="text-sm text-red-600">{errors.applicantFullName}</p>
                      ) : (
                        <span></span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formData.applicantFullName.length}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.address ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Address"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.address ? (
                        <p className="text-sm text-red-600">{errors.address}</p>
                      ) : (
                        <span></span>
                      )}
                      <span className="text-xs text-gray-500">{formData.address.length}/200</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="applicantEmail"
                      value={formData.applicantEmail}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.applicantEmail ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.applicantEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.applicantEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC (National ID) *
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleChange}
                      required
                      maxLength={12}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.nic ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="200012345678 or 881234567V"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.nic ? (
                        <p className="text-sm text-red-600">{errors.nic}</p>
                      ) : (
                        <span></span>
                      )}
                      <span className="text-xs text-gray-500">{formData.nic.length}/12</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deceased Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Deceased Person Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deceased Full Name *
                    </label>
                    <input
                      type="text"
                      name="deceasedFullName"
                      value={formData.deceasedFullName}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.deceasedFullName ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Deceased Full Name"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.deceasedFullName ? (
                        <p className="text-sm text-red-600">{errors.deceasedFullName}</p>
                      ) : (
                        <span></span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formData.deceasedFullName.length}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Death *
                    </label>
                    <input
                      type="date"
                      name="dateOfDeath"
                      value={formData.dateOfDeath}
                      onChange={handleChange}
                      required
                      max={todayISO}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.dateOfDeath ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.dateOfDeath && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfDeath}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Residence Area
                    </label>
                    <select
                      name="residenceArea"
                      value={formData.residenceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    >
                      <option value="within">Within municipal limits</option>
                      <option value="outside">Outside municipal limits</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number (if any)
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Registration Number"
                    />
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500">
                        {formData.registrationNumber.length}/50
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      For natural death: Grama Niladhari Certificate (Image/PDF)
                    </label>
                    <input
                      type="file"
                      name="beOrderImage"
                      accept="image/*,.pdf"
                      onChange={handleBeOrderFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      name="naturalDeathCertificate"
                      value={formData.naturalDeathCertificate}
                      onChange={handleChange}
                      maxLength={300}
                      placeholder="Note (optional)"
                      className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500">
                        {formData.naturalDeathCertificate.length}/300
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Death Certificate (Image/PDF) *
                    </label>
                    <input
                      type="file"
                      name="deathCertificateImage"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.deathCertificateFile ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.deathCertificateFile && (
                      <p className="mt-1 text-sm text-red-600">{errors.deathCertificateFile}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cremation Details Section */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-4">Cremation Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cremation Date *
                    </label>
                    <input
                      type="date"
                      name="cremationDate"
                      value={formData.cremationDate}
                      onChange={handleChange}
                      required
                      min={todayISO}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.cremationDate ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.cremationDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.cremationDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.startTime ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.endTime ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={checkAvailability}
                    disabled={
                      checkingAvail ||
                      !formData.cremationDate ||
                      !formData.startTime ||
                      !formData.endTime ||
                      errors.cremationDate ||
                      errors.startTime ||
                      errors.endTime
                    }
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {checkingAvail ? "Checking..." : "Check Availability"}
                  </button>
                  {availability && (
                    <span
                      className={`text-sm ${
                        availability.available ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {availability.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Declaration Section */}
              <div className="bg-red-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-red-800 mb-4">Declaration</h2>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="declarationAgreement"
                    checked={formData.declarationAgreement}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="text-gray-700">
                    I confirm that all the information provided is true and complete.
                  </label>
                </div>
                {errors.declarationAgreement && (
                  <p className="mt-2 text-sm text-red-600">{errors.declarationAgreement}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={submitting || hasErrors || isFormIncomplete}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-12 rounded-lg transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
                {(hasErrors || isFormIncomplete) && (
                  <p className="mt-2 text-sm text-gray-600">
                    Please complete all required fields and fix the errors
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/my-bookings")}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}