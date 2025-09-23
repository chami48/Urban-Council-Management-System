// src/Components/CrematoriumForm/CrematoriumForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";

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

  // -------- Helpers to keep names clean (no numbers) --------
  // Allow: English letters, extended Latin, Sinhala letters, spaces, dots, apostrophes, dashes
  const NAME_ALLOWED_REGEX = /[a-zA-ZÀ-ÿ\u0D80-\u0DFF\s.'-]/;
  const sanitizeName = (raw) => {
    if (!raw) return "";
    const cleaned = [...raw].filter((ch) => NAME_ALLOWED_REGEX.test(ch)).join("");
    return cleaned.replace(/\s{2,}/g, " ").trimStart();
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "නම අවශ්‍යයි";
    if (name.trim().length < 2) return "නම අක්ෂර 2 කට වඩා විය යුතුය";
    if (name.trim().length > 100) return "නම අක්ෂර 100 කට වඩා විය නොහැක";
    if (/\d/.test(name)) return "නමේ අංක ඇතුළත් කළ නොහැක";
    if (!/^[a-zA-ZÀ-ÿ\u0D80-\u0DFF\s.'-]+$/.test(name)) return "නම වලංගු නොවේ";
    return "";
  };

  const validateNIC = (nic) => {
    if (!nic.trim()) return "ජාතික හැඳුනුම්පත් අංකය අවශ්‍යයි";

    // Remove spaces for validation
    const cleanNIC = nic.replace(/\s/g, "");

    if (cleanNIC.length > 12) return "ජාතික හැඳුනුම්පත් අංකය අධික";

    // Old format: 9 digits + V/X
    const oldFormat = /^[0-9]{9}[vVxX]$/;
    // New format: 12 digits
    const newFormat = /^[0-9]{12}$/;

    if (!oldFormat.test(cleanNIC) && !newFormat.test(cleanNIC)) {
      return "ජාතික හැඳුනුම්පත් අංකය වලංගු නොවේ (9 අංක + V/X හෝ 12 අංක)";
    }

    return "";
  };

  const validateAddress = (address) => {
    if (!address.trim()) return "ලිපිනය අවශ්‍යයි";
    if (address.trim().length < 5) return "ලිපිනය විස්තරාත්මක විය යුතුය";
    if (address.trim().length > 200) return "ලිපිනය අක්ෂර 200 කට වඩා විය නොහැක";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "ඊමේල් අවශ්‍යයි";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "වලංගු ඊ මේල් ලිපිනයක් ඇතුළත් කරන්න";
    return "";
  };

  const validateDate = (date, fieldName = "දිනය") => {
    if (!date) return `${fieldName} අවශ්‍යයි`;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fieldName === "මරණය වූ දිනය" && selectedDate > today) {
      return "මරණය වූ දිනය අද දිනයට පසු විය නොහැක";
    }
    if (fieldName === "දහන දිනය" && selectedDate < today) {
      return "දහන දිනය අද දිනයට පෙර විය නොහැක";
    }
    return "";
  };

  const validateTime = (startTime, endTime) => {
    const errors = {};

    if (!startTime) errors.startTime = "ආරම්භ වේලාව අවශ්‍යයි";
    if (!endTime) errors.endTime = "අවසන් වේලාව අවශ්‍යයි";

    if (startTime && endTime) {
      const toMin = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      if (toMin(startTime) >= toMin(endTime)) {
        errors.endTime = "අවසන් වේලාව ආරම්භ වේලාවට පසු විය යුතුය";
      }

      // Check if duration is at least 1 hour
      if (toMin(endTime) - toMin(startTime) < 60) {
        errors.endTime = "අවම වශයෙන් පැය 1ක් කාල සීමාවක් අවශ්‍යයි";
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
        error = validateDate(value, "මරණය වූ දිනය");
        break;
      case "cremationDate":
        error = validateDate(value, "දහන දිනය");
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Prevent numbers and disallowed chars for name fields (live sanitizing)
    if (name === "applicantFullName" || name === "deceasedFullName") {
      newValue = sanitizeName(newValue);
      if (newValue.length > 100) return; // Don't update if exceeds limit
    }

    // Prevent typing beyond max length for specific fields
    if (name === "address") {
      if (newValue.length > 200) return;
    }
    if (name === "nic") {
      if (newValue.length > 12) return;
    }
    if (name === "registrationNumber") {
      if (newValue.length > 50) return;
    }
    if (name === "naturalDeathCertificate") {
      if (newValue.length > 300) return;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate field on change
    if (name !== "declarationAgreement" && type !== "checkbox") {
      const fieldError = validateField(name, newValue);
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    }

    // Special handling for time fields
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
    if (!formData.cremationDate)
      return setAvailability({ available: false, message: "දහන දිනය තෝරන්න" });
    if (!formData.startTime || !formData.endTime) {
      return setAvailability({ available: false, message: "ආරම්භ/අවසන් වේලාවන් දෙකම අවශ්‍යයි" });
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
    } catch (e) {
      console.error(e);
      setAvailability({ available: false, message: "Server error checking availability" });
    } finally {
      setCheckingAvail(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all required fields
    newErrors.applicantFullName = validateName(formData.applicantFullName);
    newErrors.address = validateAddress(formData.address);
    newErrors.applicantEmail = validateEmail(formData.applicantEmail);
    newErrors.nic = validateNIC(formData.nic);
    newErrors.deceasedFullName = validateName(formData.deceasedFullName);
    newErrors.dateOfDeath = validateDate(formData.dateOfDeath, "මරණය වූ දිනය");
    newErrors.cremationDate = validateDate(formData.cremationDate, "දහන දිනය");

    // Validate time fields
    const timeErrors = validateTime(formData.startTime, formData.endTime);
    Object.assign(newErrors, timeErrors);

    // Validate files
    if (!deathCertificateFile) {
      newErrors.deathCertificateFile = "මරණ සහතිකය අවශ්‍යයි";
    }

    // Validate declaration
    if (!formData.declarationAgreement) {
      newErrors.declarationAgreement = "ප්‍රකාශයට එකඟ විය යුතුය";
    }

    // Remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("කරුණාකර සියලු දෝෂ නිවැරදි කර නැවත උත්සාහ කරන්න");
      return;
    }

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

      alert("ඇනවුම සාර්ථකව යැවිය");
      navigate("/my-bookings");
    } catch (err) {
      console.error(err?.response?.data || err);
      alert(err?.response?.data?.message || "ඇනවුම යැවීම අසාර්ථකයි");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if form is valid for submit button
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
                ආදහනාගාර පහසුකම් ලබා ගැනීම සදහා ඉල්ලුම් පත්‍රය
              </h1>
              <p className="text-gray-600">කරුණාකර සියලු අවශ්‍ය තොරතුරු සම්පූර්ණ කරන්න</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Applicant */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">අයදුම්කරුගේ තොරතුරු</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      අයදුම්කරුගේ සම්පූර්ණ නම *
                    </label>
                    <input
                      type="text"
                      name="applicantFullName"
                      value={formData.applicantFullName}
                      onChange={handleChange}
                      required
                      inputMode="text"
                      pattern="[a-zA-ZÀ-ÿ\u0D80-\u0DFF\s.'-]{2,100}"
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.applicantFullName ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="අයදුම්කරුගේ සම්පූර්ණ නම"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">ලිපිනය *</label>
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
                      placeholder="ලිපිනය"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">ඊමේල් *</label>
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
                      ජාතික හැඳුනුම්පත් අංකය *
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
                      placeholder="200012345678 හෝ 881234567V"
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

              {/* Deceased */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">මියගිය පුද්ගලයාගේ තොරතුරු</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      මියගිය පුද්ගලයාගේ සම්පූර්ණ නම *
                    </label>
                    <input
                      type="text"
                      name="deceasedFullName"
                      value={formData.deceasedFullName}
                      onChange={handleChange}
                      required
                      inputMode="text"
                      pattern="[a-zA-ZÀ-ÿ\u0D80-\u0DFF\s.'-]{2,100}"
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.deceasedFullName ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="මියගිය පුද්ගලයාගේ සම්පූර්ණ නම"
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
                      මරණය වූ දිනය *
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
                      නේවාසික ප්‍රදේශය
                    </label>
                    <select
                      name="residenceArea"
                      value={formData.residenceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    >
                      <option value="within">නගර සීමා ඇතුළත</option>
                      <option value="outside">නගර සීමා පිටත</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      (ඇත්නම්) ලියාපදිංචි අංකය
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="ලියාපදිංචි අංකය"
                    />
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500">
                        {formData.registrationNumber.length}/50
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Docs */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">ලේඛන</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ස්වභාවික මරණයක් නම් ග්‍රාම නිලධාරී සහතිකය (ඡායාරූප/ PDF)
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
                      placeholder="සටහනක් (විකල්ප)"
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
                      මරණ සහතිකය (ඡායාරූප/ PDF) *
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

              {/* Cremation details */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-4">දහන විස්තර</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      දහන දිනය *
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
                      ආරම්භ වේලාව *
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
                      අවසන් වේලාව *
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
                    {checkingAvail ? "පිරික්සමින්..." : "ඇත/නැත පිරික්සන්න"}
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

              {/* Declaration */}
              <div className="bg-red-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-red-800 mb-4">ප්‍රකාශය</h2>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="declarationAgreement"
                    checked={formData.declarationAgreement}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="text-gray-700">
                    සපයන ලද සියලු තොරතුරු නිවැරදි සහ සම්පූර්ණ බවට මම එකඟ වෙමි.
                  </label>
                </div>
                {errors.declarationAgreement && (
                  <p className="mt-2 text-sm text-red-600">{errors.declarationAgreement}</p>
                )}
              </div>

              {/* Submit */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={submitting || hasErrors || isFormIncomplete}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-12 rounded-lg transition-colors"
                >
                  {submitting ? "යැවෙමින්..." : "ඇනවුම යවන්න"}
                </button>
                {(hasErrors || isFormIncomplete) && (
                  <p className="mt-2 text-sm text-gray-600">
                    කරුණාකර සියලු අවශ්‍ය ක්ෂේත්‍ර සම්පූර්ණ කර දෝෂ නිවැරදි කරන්න
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
              මාගේ ඇනවුම් පිටුවට යන්න
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
