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
    startTime: "", // NEW
    endTime: "",   // NEW
    declarationAgreement: false,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name === "cremationDate" || name === "startTime" || name === "endTime") {
      setAvailability(null);
    }
  };

  const todayISO = new Date().toISOString().slice(0, 10);
  const handleFileChange = (e) => setDeathCertificateFile(e.target.files[0] || null);
  const handleBeOrderFileChange = (e) => setBeOrderFile(e.target.files[0] || null);

  const checkAvailability = async () => {
    if (!formData.cremationDate) return setAvailability({ available: false, message: "දහන දිනය තෝරන්න" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.declarationAgreement) return alert("ප්‍රකාශයට එකඟ විය යුතුය.");
    if (!formData.applicantEmail) return alert("Email එක අවශ්‍යයි.");
    if (!deathCertificateFile) return alert("මරණ සහතික පින්තූරය අවශ්‍යයි.");
    if (!formData.startTime || !formData.endTime) return alert("ආරම්භ/අවසන් වේලාවන් දෙකම අවශ්‍යයි.");

    // simple client-side time check
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (toMin(formData.startTime) >= toMin(formData.endTime)) {
      return alert("අවසන් වේලාව ආරම්භ වේලාවට පසු විය යුතුය.");
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="අයදුම්කරුගේ සම්පූර්ණ නම"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ලිපිනය *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="ලිපිනය"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ඊමේල් *</label>
                    <input
                      type="email"
                      name="applicantEmail"
                      value={formData.applicantEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="example@email.com"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="NIC"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="මියගිය පුද්ගලයාගේ සම්පූර්ණ නම"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">මරණය වූ දිනය *</label>
                    <input
                      type="date"
                      name="dateOfDeath"
                      value={formData.dateOfDeath}
                      onChange={handleChange}
                      required
                      max={todayISO}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">නේවාසික ප්‍රදේශය</label>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="ලියාපදිංචි අංකය"
                    />
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
                      placeholder="සටහනක් (විකල්ප)"
                      className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Cremation details (date + time window) */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-4">දහන විස්තර</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">දහන දිනය *</label>
                    <input
                      type="date"
                      name="cremationDate"
                      value={formData.cremationDate}
                      onChange={handleChange}
                      required
                      min={todayISO}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ආරම්භ වේලාව *</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">අවසන් වේලාව *</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={checkAvailability}
                    disabled={checkingAvail || !formData.cremationDate || !formData.startTime || !formData.endTime}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {checkingAvail ? "පිරික්සමින්..." : "ඇත/නැත පිරික්සන්න"}
                  </button>
                  {availability && (
                    <span className={`text-sm ${availability.available ? "text-emerald-700" : "text-red-600"}`}>
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
              </div>

              {/* Submit */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-4 px-12 rounded-lg"
                >
                  {submitting ? "යැවෙමින්..." : "ඇනවුම යවන්න"}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => navigate("/my-bookings")} className="text-sm text-gray-600 hover:text-gray-800 underline">
              මාගේ ඇනවුම් පිටුවට යන්න
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
