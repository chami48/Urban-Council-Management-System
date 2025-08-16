import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Nav from "../Nav/Nav";
import {
  Calendar,
  Flame,
  Activity,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  RefreshCcw,
  Eye
} from "lucide-react";

// API endpoints
const PLAYGROUND_URL = "http://localhost:5000/users";
const CREMATORIUM_URL = "http://localhost:5000/crematorium";

const BookingForm = () => {
  const [activeTab, setActiveTab] = useState("playground");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ---- New: reservation state ----
  const [reservations, setReservations] = useState({
    playground: [],
    crematorium: [],
  });
  const [resvLoading, setResvLoading] = useState(false);
  const [showReservations, setShowReservations] = useState(true); // visible by default for better UX

  // Form data state
  const [formData, setFormData] = useState({
    // Playground fields
    eventName: "",
    organizerName: "",
    email: "",
    phone: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    eventType: "",
    playgroundType: "",
    expectedAttendees: "",
    description: "",
    specialRequirement: "",

    // Crematorium fields
    applicantFullName: "",
    applicantEmail: "",
    applicantPhone: "",
    address: "",
    deceasedFullName: "",
    dateOfDeath: "",
    residenceArea: "",
    nic: "",
    registrationNumber: "",
    cremationDate: "",
    cremationTime: "",
    deathCertificateImage: null,
    beOrderImage: null,
  });

  const [errors, setErrors] = useState({});

  // ---------- Fetch existing reservations ----------
  const fetchReservations = async () => {
    try {
      setResvLoading(true);
      const [pg, cr] = await Promise.all([
        axios.get(PLAYGROUND_URL), // Expecting array of playground bookings
        axios.get(CREMATORIUM_URL), // Expecting array of crematorium bookings
      ]);

      setReservations({
        playground: Array.isArray(pg.data) ? pg.data : [],
        crematorium: Array.isArray(cr.data) ? cr.data : [],
      });
    } catch (e) {
      console.error("Failed to fetch reservations:", e);
      // Non-blocking; just show an inline notice
    } finally {
      setResvLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // ---------- Helpers ----------
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ---------- Availability checks ----------
  const playgroundConflicts = useMemo(() => {
    if (!formData.eventDate || !formData.startTime || !formData.endTime) return [];
    const start = formData.startTime;
    const end = formData.endTime;

    // Overlap if start < existing.end && end > existing.start on same date
    return (reservations.playground || []).filter((b) => {
      const sameDate = (b.eventDate || "").slice(0, 10) === formData.eventDate;
      if (!sameDate) return false;
      const bStart = b.startTime;
      const bEnd = b.endTime;
      if (!bStart || !bEnd) return false;
      return start < bEnd && end > bStart;
    });
  }, [formData.eventDate, formData.startTime, formData.endTime, reservations.playground]);

  const crematoriumConflicts = useMemo(() => {
    if (!formData.cremationDate || !formData.cremationTime) return [];
    const date = formData.cremationDate;
    const time = formData.cremationTime;
    // Treat same date + exact same time as conflict (you can expand logic if slots are longer)
    return (reservations.crematorium || []).filter((b) => {
      const sameDate = (b.cremationDate || "").slice(0, 10) === date;
      if (!sameDate) return false;
      return (b.cremationTime || "") === time;
    });
  }, [formData.cremationDate, formData.cremationTime, reservations.crematorium]);

  const validateStep = (step) => {
    const newErrors = {};

    if (activeTab === "playground") {
      if (step === 1) {
        if (!formData.eventName) newErrors.eventName = "Event name is required";
        if (!formData.organizerName) newErrors.organizerName = "Organizer name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.eventDate) newErrors.eventDate = "Event date is required";
        if (!formData.startTime) newErrors.startTime = "Start time is required";
        if (!formData.endTime) newErrors.endTime = "End time is required";
        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
          newErrors.endTime = "End time must be after start time";
        }
        // Availability check on step 1 once date/time set
        if (
          formData.eventDate &&
          formData.startTime &&
          formData.endTime &&
          playgroundConflicts.length > 0
        ) {
          newErrors.eventDate = "Selected time overlaps an existing reservation";
        }
      }
      if (step === 2) {
        if (!formData.eventType) newErrors.eventType = "Event type is required";
        if (!formData.playgroundType) newErrors.playgroundType = "Playground type is required";
        if (!formData.expectedAttendees) newErrors.expectedAttendees = "Expected attendees is required";
      }
    } else {
      if (step === 1) {
        if (!formData.applicantFullName) newErrors.applicantFullName = "Applicant name is required";
        if (!formData.applicantEmail) newErrors.applicantEmail = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) newErrors.applicantEmail = "Invalid email format";
        if (!formData.applicantPhone) newErrors.applicantPhone = "Phone number is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.deceasedFullName) newErrors.deceasedFullName = "Deceased name is required";
        if (!formData.dateOfDeath) newErrors.dateOfDeath = "Date of death is required";
      }
      if (step === 2) {
        if (!formData.residenceArea) newErrors.residenceArea = "Residence area is required";
        if (!formData.nic) newErrors.nic = "NIC is required";
        if (!formData.registrationNumber) newErrors.registrationNumber = "Registration number is required";
        if (!formData.cremationDate) newErrors.cremationDate = "Cremation date is required";
        if (!formData.cremationTime) newErrors.cremationTime = "Cremation time is required";
        // Simple slot conflict check
        if (formData.cremationDate && formData.cremationTime && crematoriumConflicts.length > 0) {
          newErrors.cremationTime = "Selected slot is already reserved";
        }
      }
      if (step === 3) {
        if (!formData.deathCertificateImage) newErrors.deathCertificateImage = "Death certificate is required";
        if (!formData.beOrderImage) newErrors.beOrderImage = "B.E. Order is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    // FIX: currentTab -> activeTab
    if (!validateStep(activeTab === "playground" ? 2 : 3)) return;

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      if (activeTab === "playground") {
        // Add playground fields
        Object.keys(formData).forEach((key) => {
          if (
            [
              "eventName",
              "organizerName",
              "email",
              "phone",
              "eventDate",
              "startTime",
              "endTime",
              "eventType",
              "playgroundType",
              "expectedAttendees",
              "description",
              "specialRequirement",
            ].includes(key)
          ) {
            formDataToSend.append(key, formData[key]);
          }
        });

        await axios.post(PLAYGROUND_URL, formDataToSend);
      } else {
        // Add crematorium fields
        Object.keys(formData).forEach((key) => {
          if (
            [
              "applicantFullName",
              "applicantEmail",
              "applicantPhone",
              "address",
              "deceasedFullName",
              "dateOfDeath",
              "residenceArea",
              "nic",
              "registrationNumber",
              "cremationDate",
              "cremationTime",
            ].includes(key)
          ) {
            formDataToSend.append(key, formData[key]);
          }
        });

        if (formData.deathCertificateImage) {
          formDataToSend.append("deathCertificateImage", formData.deathCertificateImage);
        }
        if (formData.beOrderImage) {
          formDataToSend.append("beOrderImage", formData.beOrderImage);
        }

        await axios.post(CREMATORIUM_URL, formDataToSend);
      }

      setSuccess(true);
      // Refresh reservations so table shows the new booking
      fetchReservations();

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          eventName: "",
          organizerName: "",
          email: "",
          phone: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          eventType: "",
          playgroundType: "",
          expectedAttendees: "",
          description: "",
          specialRequirement: "",
          applicantFullName: "",
          applicantEmail: "",
          applicantPhone: "",
          address: "",
          deceasedFullName: "",
          dateOfDeath: "",
          residenceArea: "",
          nic: "",
          registrationNumber: "",
          cremationDate: "",
          cremationTime: "",
          deathCertificateImage: null,
          beOrderImage: null,
        });
        setCurrentStep(1);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Booking submission error:", error);
      setError(error.response?.data?.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Reservation tables (only show name + date as requested) ----------
  const PlaygroundReservationsTable = () => {
    const rows = (reservations.playground || []).map((r, idx) => ({
      id: idx,
      eventName: r.eventName || "-",
      eventDate: (r.eventDate || "").slice(0, 10),
    }));

    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Eye size={16} />
            <span className="text-sm font-medium">Existing Playground Reservations</span>
          </div>
          <button
            onClick={fetchReservations}
            className="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="text-left px-4 py-2">Event Name</th>
                <th className="text-left px-4 py-2">Event Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-4 py-2">{row.eventName}</td>
                    <td className="px-4 py-2">{row.eventDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CrematoriumReservationsTable = () => {
    const rows = (reservations.crematorium || []).map((r, idx) => ({
      id: idx,
      deceasedFullName: r.deceasedFullName || "-",
      cremationDate: (r.cremationDate || "").slice(0, 10),
    }));

    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Eye size={16} />
            <span className="text-sm font-medium">Existing Crematorium Reservations</span>
          </div>
          <button
            onClick={fetchReservations}
            className="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Cremation Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-4 py-2">{row.deceasedFullName}</td>
                    <td className="px-4 py-2">{row.cremationDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ---------- Availability badges ----------
  const PlaygroundAvailability = () => {
    if (!formData.eventDate || !formData.startTime || !formData.endTime) {
      return null;
    }
    const conflictCount = playgroundConflicts.length;
    if (conflictCount === 0) {
      return (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-300">
          <CheckCircle size={14} />
          Slot available
        </div>
      );
    }
    return (
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium dark:bg-red-900/30 dark:text-red-300">
        <AlertCircle size={14} />
        Overlaps with {conflictCount} existing reservation{conflictCount > 1 ? "s" : ""}
      </div>
    );
  };

  const CrematoriumAvailability = () => {
    if (!formData.cremationDate || !formData.cremationTime) {
      return null;
    }
    const conflict = crematoriumConflicts.length > 0;
    if (!conflict) {
      return (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-300">
          <CheckCircle size={14} />
          Slot available
        </div>
      );
    }
    return (
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium dark:bg-red-900/30 dark:text-red-300">
        <AlertCircle size={14} />
        This slot is already reserved
      </div>
    );
  };

  // ---------- Steps UI ----------
  const renderPlaygroundStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange("eventName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.eventName ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter event name"
          />
          {errors.eventName && <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Organizer Name *
          </label>
          <input
            type="text"
            value={formData.organizerName}
            onChange={(e) => handleInputChange("organizerName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.organizerName ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter organizer name"
          />
          {errors.organizerName && <p className="mt-1 text-sm text-red-600">{errors.organizerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.email ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.phone ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Event Date *
            </label>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => handleInputChange("eventDate", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.eventDate ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.startTime ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            End Time *
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.endTime ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
        </div>
      </div>

      <PlaygroundAvailability />
    </div>
  );

  const renderPlaygroundStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Event Type *
          </label>
          <select
            value={formData.eventType}
            onChange={(e) => handleInputChange("eventType", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.eventType ? "border-red-500" : "border-slate-300"
            }`}
          >
            <option value="">Select event type</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Wedding Reception">Wedding Reception</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Sports Tournament">Sports Tournament</option>
            <option value="Cultural Event">Cultural Event</option>
            <option value="Other">Other</option>
          </select>
          {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Playground Type *
          </label>
          <select
            value={formData.playgroundType}
            onChange={(e) => handleInputChange("playgroundType", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.playgroundType ? "border-red-500" : "border-slate-300"
            }`}
          >
            <option value="">Select playground type</option>
            <option value="Indoor Playground">Indoor Playground</option>
            <option value="Outdoor Playground">Outdoor Playground</option>
            <option value="Sports Ground">Sports Ground</option>
            <option value="Community Hall">Community Hall</option>
            <option value="Auditorium">Auditorium</option>
          </select>
          {errors.playgroundType && <p className="mt-1 text-sm text-red-600">{errors.playgroundType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Expected Attendees *
          </label>
          <input
            type="number"
            value={formData.expectedAttendees}
            onChange={(e) => handleInputChange("expectedAttendees", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.expectedAttendees ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter number of attendees"
            min="1"
          />
          {errors.expectedAttendees && <p className="mt-1 text-sm text-red-600">{errors.expectedAttendees}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Event Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
          placeholder="Describe your event..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Special Requirements
        </label>
        <textarea
          value={formData.specialRequirement}
          onChange={(e) => handleInputChange("specialRequirement", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
          placeholder="Any special requirements or requests..."
        />
      </div>
    </div>
  );

  const renderCrematoriumStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Applicant Full Name *
          </label>
          <input
            type="text"
            value={formData.applicantFullName}
            onChange={(e) => handleInputChange("applicantFullName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.applicantFullName ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter applicant full name"
          />
          {errors.applicantFullName && <p className="mt-1 text-sm text-red-600">{errors.applicantFullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.applicantEmail}
            onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.applicantEmail ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter email address"
          />
          {errors.applicantEmail && <p className="mt-1 text-sm text-red-600">{errors.applicantEmail}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.applicantPhone}
            onChange={(e) => handleInputChange("applicantPhone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.applicantPhone ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter phone number"
          />
          {errors.applicantPhone && <p className="mt-1 text-sm text-red-600">{errors.applicantPhone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.address ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter full address"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Deceased Full Name *
          </label>
          <input
            type="text"
            value={formData.deceasedFullName}
            onChange={(e) => handleInputChange("deceasedFullName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.deceasedFullName ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter deceased full name"
          />
          {errors.deceasedFullName && <p className="mt-1 text-sm text-red-600">{errors.deceasedFullName}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date of Death *
            </label>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="date"
            value={formData.dateOfDeath}
            onChange={(e) => handleInputChange("dateOfDeath", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.dateOfDeath ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.dateOfDeath && <p className="mt-1 text-sm text-red-600">{errors.dateOfDeath}</p>}
        </div>
      </div>
    </div>
  );

  const renderCrematoriumStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Residence Area *
          </label>
          <input
            type="text"
            value={formData.residenceArea}
            onChange={(e) => handleInputChange("residenceArea", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.residenceArea ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter residence area"
          />
          {errors.residenceArea && <p className="mt-1 text-sm text-red-600">{errors.residenceArea}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            NIC Number *
          </label>
          <input
            type="text"
            value={formData.nic}
            onChange={(e) => handleInputChange("nic", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.nic ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter NIC number"
          />
          {errors.nic && <p className="mt-1 text-sm text-red-600">{errors.nic}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Registration Number *
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.registrationNumber ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter registration number"
          />
          {errors.registrationNumber && <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Cremation Date *
            </label>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="date"
            value={formData.cremationDate}
            onChange={(e) => handleInputChange("cremationDate", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.cremationDate ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.cremationDate && <p className="mt-1 text-sm text-red-600">{errors.cremationDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Cremation Time *
          </label>
          <input
            type="time"
            value={formData.cremationTime}
            onChange={(e) => handleInputChange("cremationTime", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 ${
              errors.cremationTime ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.cremationTime && <p className="mt-1 text-sm text-red-600">{errors.cremationTime}</p>}
        </div>
      </div>

      <CrematoriumAvailability />
    </div>
  );

  const renderCrematoriumStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Death Certificate *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("deathCertificateImage", e.target.files[0])}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          {formData.deathCertificateImage && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <FileText size={16} />
              <span>{formData.deathCertificateImage.name}</span>
              <button
                onClick={() => handleFileChange("deathCertificateImage", null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {errors.deathCertificateImage && (
            <p className="mt-1 text-sm text-red-600">{errors.deathCertificateImage}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            B.E. Order *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("beOrderImage", e.target.files[0])}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          {formData.beOrderImage && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <FileText size={16} />
              <span>{formData.beOrderImage.name}</span>
              <button
                onClick={() => handleFileChange("beOrderImage", null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {errors.beOrderImage && <p className="mt-1 text-sm text-red-600">{errors.beOrderImage}</p>}
        </div>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    if (activeTab === "playground") {
      return currentStep === 1 ? renderPlaygroundStep1() : renderPlaygroundStep2();
    } else {
      if (currentStep === 1) return renderCrematoriumStep1();
      if (currentStep === 2) return renderCrematoriumStep2();
      return renderCrematoriumStep3();
    }
  };

  const getTotalSteps = () => (activeTab === "playground" ? 2 : 3);

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Nav />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Booking Submitted Successfully!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your {activeTab} booking request has been submitted and is under review. You will receive an email
              notification once the admin reviews your request.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/bookings")}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setCurrentStep(1);
                  setFormData({
                    eventName: "",
                    organizerName: "",
                    email: "",
                    phone: "",
                    eventDate: "",
                    startTime: "",
                    endTime: "",
                    eventType: "",
                    playgroundType: "",
                    expectedAttendees: "",
                    description: "",
                    specialRequirement: "",
                    applicantFullName: "",
                    applicantEmail: "",
                    applicantPhone: "",
                    address: "",
                    deceasedFullName: "",
                    dateOfDeath: "",
                    residenceArea: "",
                    nic: "",
                    registrationNumber: "",
                    cremationDate: "",
                    cremationTime: "",
                    deathCertificateImage: null,
                    beOrderImage: null,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-md bg-slate-600 hover:bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                Make Another Booking
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Nav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">New Booking</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a new {activeTab} booking request</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden mb-6">
            <button
              onClick={() => {
                setActiveTab("playground");
                setCurrentStep(1);
                setErrors({});
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "playground"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Activity size={16} className="inline mr-2" />
              Playground Booking
            </button>
            <button
              onClick={() => {
                setActiveTab("crematorium");
                setCurrentStep(1);
                setErrors({});
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "crematorium"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <Flame size={16} className="inline mr-2" />
              Crematorium Booking
            </button>
          </div>

          {/* Availability hint under tabs */}
          {activeTab === "playground" ? (
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Tip: Pick your date/time first to see live availability.
            </p>
          ) : (
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Tip: Choose cremation date & time to check if the slot is free.
            </p>
          )}

          {/* Reservations toggle + tables */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReservations((s) => !s)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <Eye size={14} />
                  {showReservations ? "Hide Reservations" : "Show Reservations"}
                </button>
                <button
                  onClick={fetchReservations}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <RefreshCcw size={14} />
                  Refresh
                </button>
              </div>
              {resvLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Loading reservations...
                </div>
              )}
            </div>

            {showReservations && (
              <div className="grid grid-cols-1 gap-4">
                {activeTab === "playground" ? <PlaygroundReservationsTable /> : <CrematoriumReservationsTable />}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Step {currentStep} of {getTotalSteps()}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {Math.round((currentStep / getTotalSteps()) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form Content */}
        <motion.div
          key={`${activeTab}-${currentStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
        >
          {getCurrentStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < getTotalSteps() ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Submit Booking
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
