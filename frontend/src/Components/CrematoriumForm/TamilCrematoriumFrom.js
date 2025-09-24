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

  // SweetAlert2 Configuration Functions (Tamil)
  const showSuccessAlert = (title, text, onConfirm) => {
    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      confirmButtonText: "சரி",
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
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      icon: "error",
      confirmButtonText: "சரி",
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
      title: title,
      text: text,
      icon: "warning",
      confirmButtonText: "சரி",
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
      title: title,
      text: text,
      icon: "info",
      confirmButtonText: "சரி",
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
      title: "தயவு செய்து காத்திருக்கவும்...",
      text: "உங்கள் விண்ணப்பம் சமர்ப்பிக்கப்பட்டுக் கொண்டிருக்கிறது",
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

  // Helper functions for name sanitization
  const NAME_ALLOWED_REGEX = /[a-zA-ZÀ-ÿ\u0B80-\u0BFF\s.'-]/; // include Tamil unicode range
  const sanitizeName = (raw) => {
    if (!raw) return "";
    const cleaned = [...raw].filter((ch) => NAME_ALLOWED_REGEX.test(ch)).join("");
    return cleaned.replace(/\s{2,}/g, " ").trimStart();
  };

  // Validation functions (Tamil messages)
  const validateName = (name) => {
    if (!name.trim()) return "பெயர் தேவை";
    if (name.trim().length < 2) return "பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்";
    if (name.trim().length > 100) return "பெயர் 100 எழுத்துகளை விட அதிகமாக இருக்கக் கூடாது";
    if (/\d/.test(name)) return "பெயரில் எண்கள் இருக்கக் கூடாது";
    if (!/^[a-zA-ZÀ-ÿ\u0B80-\u0BFF\s.'-]+$/.test(name)) return "செல்லுபடியாகாத பெயர்";
    return "";
  };

  const validateNIC = (nic) => {
    if (!nic.trim()) return "தேசிய அடையாள அட்டை எண் தேவை";
    const cleanNIC = nic.replace(/\s/g, "");
    if (cleanNIC.length > 12) return "அடையாள எண் மிக நீளமாக உள்ளது";
    const oldFormat = /^[0-9]{9}[vVxX]$/;
    const newFormat = /^[0-9]{12}$/;
    if (!oldFormat.test(cleanNIC) && !newFormat.test(cleanNIC)) {
      return "செல்லுபடியாகாத அடையாள எண் (9 இலக்கங்கள் + V/X அல்லது 12 இலக்கங்கள்)";
    }
    return "";
  };

  const validateAddress = (address) => {
    if (!address.trim()) return "முகவரி தேவை";
    if (address.trim().length < 5) return "முகவரி போதுமான விவரத்துடன் இருக்க வேண்டும்";
    if (address.trim().length > 200) return "முகவரி 200 எழுத்துகளை மீறக் கூடாது";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "மின்னஞ்சல் தேவை";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "செல்லுபடியாகும் மின்னஞ்சலை உள்ளிடவும்";
    return "";
  };

  const validateDate = (date, fieldName = "தேதி") => {
    if (!date) return `${fieldName} தேவை`;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fieldName === "இறந்த தேதி" && selectedDate > today) {
      return "இறந்த தேதி இன்று விட பின் இருக்க முடியாது";
    }
    if (fieldName === "தகனம் தேதி" && selectedDate < today) {
      return "தகனம் தேதி இன்று விட முன் இருக்க முடியாது";
    }
    return "";
  };

  const validateTime = (startTime, endTime) => {
    const errors = {};
    if (!startTime) errors.startTime = "ஆரம்ப நேரம் தேவை";
    if (!endTime) errors.endTime = "முடிவு நேரம் தேவை";

    if (startTime && endTime) {
      const toMin = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      if (toMin(startTime) >= toMin(endTime)) {
        errors.endTime = "முடிவு நேரம் ஆரம்ப நேரத்திற்கு பின் இருக்க வேண்டும்";
      }

      if (toMin(endTime) - toMin(startTime) < 60) {
        errors.endTime = "குறைந்தது 1 மணி நேர இடைவெளி அவசியம்";
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
        error = validateDate(value, "இறந்த தேதி");
        break;
      case "cremationDate":
        error = validateDate(value, "தகனம் தேதி");
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "applicantFullName" || name === "deceasedFullName") {
      newValue = sanitizeName(newValue);
      if (newValue.length > 100) return;
    }

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
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
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
      showWarningAlert("கவனம்!", "தயவு செய்து தகனம் தேதியைத் தேர்ந்தெடுக்கவும்.");
      return setAvailability({ available: false, message: "தகனம் தேதி தேவை" });
    }
    if (!formData.startTime || !formData.endTime) {
      showWarningAlert("கவனம்!", "ஆரம்ப மற்றும் முடிவு நேரங்களை இரண்டையும் வழங்கவும்.");
      return setAvailability({
        available: false,
        message: "ஆரம்ப/முடிவு நேரங்கள் இரண்டும் அவசியம்",
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
        showSuccessAlert("வெற்றி!", "தேர்ந்தெடுக்கப்பட்ட நேரம் கிடைக்கிறது.");
      } else {
        showErrorAlert(
          "மன்னிக்கவும்!",
          "தேர்ந்தெடுக்கப்பட்ட நேரம் கிடைக்கவில்லை. வேறு நேரத்தை முயற்சிக்கவும்."
        );
      }
    } catch (e) {
      console.error(e);
      setAvailability({ available: false, message: "சர்வர் பிழை (கிடைக்குமா எனச் சரிபார்ப்பு)" });
      showErrorAlert(
        "பிழை!",
        "கிடைப்பதைச் சரிபாருக்கும் போது ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
      );
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
    newErrors.dateOfDeath = validateDate(formData.dateOfDeath, "இறந்த தேதி");
    newErrors.cremationDate = validateDate(formData.cremationDate, "தகனம் தேதி");

    const timeErrors = validateTime(formData.startTime, formData.endTime);
    Object.assign(newErrors, timeErrors);

    if (!deathCertificateFile) {
      newErrors.deathCertificateFile = "இறப்பு சான்றிதழ் அவசியம்";
    }

    if (!formData.declarationAgreement) {
      newErrors.declarationAgreement = "அறிக்கை/உறுதிமொழிக்கு சம்மதிக்க வேண்டும்";
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
        "படிவம் முழுமையல்ல!",
        "அவசியமான அனைத்து புலங்களையும் பூர்த்தி செய்து பிழைகளை சரி செய்யவும்."
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
        "வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
        "உங்கள் தகனசாலை விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. இப்போது உங்கள் முன்பதிவு பக்கத்துக்கு செல்கிறோம்...",
        () => {
          navigate("/my-bookings");
        }
      );
    } catch (err) {
      console.error(err?.response?.data || err);
      const errorMessage =
        err?.response?.data?.message || "விண்ணப்பத்தை சமர்ப்பிக்கும் போது பிழை ஏற்பட்டது.";
      showErrorAlert("சமர்ப்பிப்பு தோல்வி!", errorMessage);
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
                தகனசாலை வசதிகள் பெற விண்ணப்பம்
              </h1>
              <p className="text-gray-600">தயவு செய்து அவசியமான அனைத்து தகவல்களையும் பூர்த்தி செய்யவும்</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Applicant Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">விண்ணப்பதாரர் விவரங்கள்</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      விண்ணப்பதாரரின் முழுப்பெயர் *
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
                      placeholder="விண்ணப்பதாரரின் முழுப்பெயர்"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">முகவரி *</label>
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
                      placeholder="முகவரி"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">மின்னஞ்சல் *</label>
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
                      தேசிய அடையாள அட்டை எண் *
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
                      placeholder="200012345678 அல்லது 881234567V"
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">இறந்தவரின் விவரங்கள்</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      இறந்தவரின் முழுப்பெயர் *
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
                      placeholder="இறந்தவரின் முழுப்பெயர்"
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
                      இறந்த தேதி *
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
                      குடியிருப்பு பகுதி
                    </label>
                    <select
                      name="residenceArea"
                      value={formData.residenceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    >
                      <option value="within">நகர எல்லைக்குள்</option>
                      <option value="outside">நகர எல்லைக்கு வெளியே</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      (இருந்தால்) பதிவு எண்
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="பதிவு எண்"
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
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">ஆவணங்கள்</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      இயற்கை மரணம் என்றால் கிராம நிர்வாக அதிகாரி சான்று (படம்/PDF)
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
                      placeholder="குறிப்பு (விருப்பத் தேர்வு)"
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
                      இறப்பு சான்றிதழ் (படம்/PDF) *
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
                <h2 className="text-xl font-semibold text-green-800 mb-4">தகனம் விவரங்கள்</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      தகனம் தேதி *
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
                      ஆரம்ப நேரம் *
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
                      முடிவு நேரம் *
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
                    {checkingAvail ? "சரிபார்க்கப்படுகிறது..." : "கிடைக்கிறதா என்பதைச் சரிபார்க்கவும்"}
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
                <h2 className="text-xl font-semibold text-red-800 mb-4">அறிக்கை / உறுதிமொழி</h2>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="declarationAgreement"
                    checked={formData.declarationAgreement}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="text-gray-700">
                    வழங்கியுள்ள அனைத்து தகவல்களும் சரியானவை மற்றும் முழுமையானவை என்பதை நான் உறுதிப்படுத்துகிறேன்.
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
                  {submitting ? "அனுப்பப்படுகிறது..." : "விண்ணப்பத்தை சமர்ப்பிக்கவும்"}
                </button>
                {(hasErrors || isFormIncomplete) && (
                  <p className="mt-2 text-sm text-gray-600">
                    தயவு செய்து அவசியமான புலங்களை பூர்த்தி செய்து பிழைகளைத் திருத்தவும்
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
              என்னுடைய முன்பதிவுகள் பக்கத்திற்கு செல்லவும்
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}