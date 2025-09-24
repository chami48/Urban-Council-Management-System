// src/Components/MyBookings/MyBookings.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import jsPDF from "jspdf";
import Swal from "sweetalert2";


// endpoints
const PLAYGROUND_URL = "http://localhost:5000/playgrounds";
const CREMATORIUM_URL = "http://localhost:5000/crematorium";

/* ---------------- Small UI Icons (no external deps) ---------------- */
const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={props.className || "w-4 h-4"}>
    <path d="M7 3v2M17 3v2M3 9h18M5 7h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ClockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={props.className || "w-4 h-4"}>
    <path d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={props.className || "w-4 h-4"}>
    <path d="M5.121 17.804A8 8 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={props.className || "w-4 h-4"}>
    <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.6"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const MapPinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={props.className || "w-4 h-4"}>
    <path d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const DownloadIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={props.className || "w-4 h-4"}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ---------------- PDF Certificate Generator ---------------- */
/* ---------------- Improved PDF Certificate Generator ---------------- */
const generatePDFCertificate = async (booking, type = "playground") => {
  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // page + layout constants
    const pageWidth = 297;
    const pageHeight = 210;
    const marginOuter = 10;
    const marginInner = 15;
    const headerY = 40;
    const subHeaderY = 48;

    // 🚧 reserve a footer band so nothing overlaps signature/seal
    const FOOTER_HEIGHT = 42;          // reserved footer (bottom band)
    const CONTENT_BOTTOM = pageHeight - FOOTER_HEIGHT; // max Y for flowing content
    const TERMS_LINE_HEIGHT = 6;

    // helpers
    const toString = (v) => (v === null || v === undefined || v === "" ? "N/A" : String(v));
    const formatDate = (d) => {
      if (!d) return "N/A";
      try { return new Date(d).toLocaleDateString("en-GB"); } catch { return "N/A"; }
    };
    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const emblem = await loadImage("/emblem.png");
    const logo = await loadImage("/horanalogo.png");
    const signature = await loadImage("/signature.png");

    // borders
    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(3);
    pdf.rect(marginOuter, marginOuter, pageWidth - marginOuter * 2, pageHeight - marginOuter * 2);

    pdf.setDrawColor(52, 152, 219);
    pdf.setLineWidth(1);
    pdf.rect(marginInner, marginInner, pageWidth - marginInner * 2, pageHeight - marginInner * 2);

    // emblems
    if (emblem) pdf.addImage(emblem, "PNG", 25, 25, 25, 25);
    if (logo) pdf.addImage(logo, "PNG", pageWidth - 50, 25, 25, 25);

    // header
    pdf.setFont("times", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(41, 128, 185);
    const headerText = type === "playground" ? "PLAYGROUND USAGE PERMIT" : "CREMATORIUM SERVICE PERMIT";
    const headerWidth = pdf.getTextWidth(headerText);
    pdf.text(headerText, (pageWidth - headerWidth) / 2, headerY);

    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    const subText = "Urban Council - Horana";
    const subWidth = pdf.getTextWidth(subText);
    pdf.text(subText, (pageWidth - subWidth) / 2, subHeaderY);

    // meta line
    const now = new Date();
    const certNumber = `${type.toUpperCase()}-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${
      booking._id?.slice(-6) || "000000"
    }`;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Certificate No: ${certNumber}`, 25, 65);
    const genText = now.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    // right align on the same line
    pdf.text(`Generated: ${genText}`, pageWidth - 25 - pdf.getTextWidth(`Generated: ${genText}`), 65);

    // content
    pdf.setFont("times", "normal");
    pdf.setFontSize(16);
    pdf.setTextColor(50, 50, 50);

    let yPos = 85; // start content here

    // helper to ensure we never draw inside the footer band
    const clampForFooter = (advance = 0) => {
      if (yPos + advance > CONTENT_BOTTOM) {
        yPos = CONTENT_BOTTOM; // keep above footer
      }
    };

    pdf.text("This is to certify that permission is hereby granted for:", 25, yPos);
    yPos += 15;

    if (type === "playground") {
      const { eventName, organizerName, playgroundType, eventDate, startTime, endTime, expectedAttendees, status } = booking;

      pdf.setFont("times", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(41, 128, 185);
      pdf.text(toString(eventName) || "Event", 25, yPos);
      yPos += 15;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(50, 50, 50);

      const details = [
        ["Organizer:", toString(organizerName)],
        ["Event Type:", toString(playgroundType) || "General"],
        ["Date:", formatDate(eventDate)],
        ["Time:", `${toString(startTime)} - ${toString(endTime)}`],
        ["Expected Attendees:", toString(expectedAttendees)],
        ["Status:", toString(status) || "Approved"],
      ];

      details.forEach(([label, value]) => {
        clampForFooter(12);
        const leftCol = 25;
        const rightCol = 120;
        pdf.setFont("helvetica", "bold");
        pdf.text(label, leftCol, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(value, rightCol, yPos);
        yPos += 10;
      });
    } else {
      const { deceasedFullName, applicantFullName, cremationDate, startTime, endTime, registrationNumber, status } = booking;

      pdf.setFont("times", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(156, 39, 176);
      pdf.text(`Cremation Service for ${toString(deceasedFullName)}`, 25, yPos);
      yPos += 15;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(50, 50, 50);

      const details = [
        ["Applicant:", toString(applicantFullName)],
        ["Registration No:", toString(registrationNumber)],
        ["Date:", formatDate(cremationDate)],
        ["Time:", `${toString(startTime)} - ${toString(endTime)}`],
        ["Status:", toString(status) || "Approved"],
      ];

      details.forEach(([label, value]) => {
        clampForFooter(12);
        const leftCol = 25;
        const rightCol = 120;
        pdf.setFont("helvetica", "bold");
        pdf.text(label, leftCol, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(value, rightCol, yPos);
        yPos += 12;
      });
    }
/* ---------- FOOTER BACKGROUND (white) ---------- */
/* ---------- FOOTER (no seal, no footer sentence) ---------- */
const FOOTER_TOP = CONTENT_BOTTOM + 1; // keep footer safely below content
pdf.setFillColor(255, 255, 255);
pdf.rect(
  16,                                 // inner border (15) + 1mm padding
  FOOTER_TOP,
  pageWidth - 32,                     // 2 * 16
  pageHeight - FOOTER_TOP - 9,        // to just above the outer border
  "F"
);

// Signature image (right)
const signatureBaselineY = pageHeight - 16;   // baseline for captions
if (signature) {
  const sigH = 18, sigW = 55;
  const sigX = pageWidth - 95;
  const sigY = Math.max(signatureBaselineY - sigH - 6, FOOTER_TOP + 2);
  pdf.addImage(signature, "PNG", sigX, sigY, sigW, sigH);
}

// Date line (right, under the signature)
pdf.setDrawColor(150, 150, 150);
pdf.setLineWidth(0.5);
const dateLineY = Math.max(signatureBaselineY - 8, FOOTER_TOP + 6);
pdf.line(pageWidth - 95, dateLineY, pageWidth - 25, dateLineY);
pdf.setFont("helvetica", "normal");
pdf.setFontSize(8);
pdf.setTextColor(100, 100, 100);
pdf.text("Date", pageWidth - 30, dateLineY + 3);

// Signature captions
pdf.setFont("helvetica", "bold");
pdf.setFontSize(11);
pdf.setTextColor(50, 50, 50);
pdf.text("Authorized Officer", pageWidth - 75, signatureBaselineY-2);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(9);
pdf.text("Urban Council - Horana", pageWidth - 75, signatureBaselineY + 3);


    // file name
    const eventNameSafe = toString(booking.eventName || booking.deceasedFullName || "Booking").replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${type === "playground" ? "Playground" : "Crematorium"}_Permit_${eventNameSafe}_${certNumber}.pdf`;

    pdf.save(fileName);
    alert("Certificate generated successfully!");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(`Failed to generate certificate: ${error.message}. Please try again.`);
    return false;
  }
};

/* ---------------- Helpers ---------------- */
function useStoredUser() {
  const [storedUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  return storedUser;
}

function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 justify-center py-16 text-slate-700">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      {label}
    </div>
  );
}

/** Try to coerce backend arrays in different shapes */
function extractArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.bookings && Array.isArray(payload.bookings)) return payload.bookings;
  if (payload?.results && Array.isArray(payload.results)) return payload.results;
  if (payload?.data?.items && Array.isArray(payload.data.items)) return payload.data.items;
  console.warn("Could not extract array from payload:", payload);
  return [];
}

/** Builds a matcher that checks ownership by userId/email in many common shapes */
function makeOwnerMatcher(storedUser) {
  const uid = storedUser?._id;
  const uemail = storedUser?.email?.toLowerCase();

  return (b) => {
    if (!b) return false;

    // Common id fields
    const idMatches =
      b._userId === uid ||
      b.userId === uid ||
      b.ownerId === uid ||
      b?.user?._id === uid ||
      b?.userId?._id === uid ||
      b?.createdBy === uid;

    // common email fields across forms:
    const allEmails = [
      b.email,
      b.contactEmail,
      b.organizerEmail,     // playground
      b.applicantEmail,     // crematorium
      b?.user?.email
    ]
      .filter(Boolean)
      .map((x) => String(x).toLowerCase());

    const emailMatches = uemail && allEmails.includes(uemail);

    return Boolean(idMatches || emailMatches);
  };
}

/* -------------- Main -------------- */
export default function MyBookings() {
  const navigate = useNavigate();
  const storedUser = useStoredUser();
  const ownerIs = useMemo(() => makeOwnerMatcher(storedUser), [storedUser]);

  const [tab, setTab] = useState("all"); // all | playground | crematorium
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [playground, setPlayground] = useState([]);
  const [crematorium, setCrematorium] = useState([]);

  // Kick to login if not logged in
  useEffect(() => {
    if (!storedUser) navigate("/log");
  }, [storedUser, navigate]);

  const load = async () => {
    if (!storedUser) return;

    setLoading(true);
    setErr("");

    // Build query params for server-side filtering (and we also filter client-side)
    const params = new URLSearchParams();
    if (storedUser?._id) params.set("userId", storedUser._id);
    if (storedUser?.email) params.set("email", storedUser.email);
    const qp = params.toString();

    try {
      // fetch both in parallel
      const [pgRes, crRes] = await Promise.all([
        axios.get(qp ? `${PLAYGROUND_URL}?${qp}` : PLAYGROUND_URL, { withCredentials: true }),
        axios.get(qp ? `${CREMATORIUM_URL}?${qp}` : CREMATORIUM_URL, { withCredentials: true }),
      ]);

      const pg = extractArray(pgRes.data).filter(ownerIs);
      const cr = extractArray(crRes.data).filter(ownerIs);

      setPlayground(pg);
      setCrematorium(cr);
    } catch (e) {
      console.error("Load error:", e);
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        navigate("/log");
        return;
      }
      setErr("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerIs]);

  const handleDeletePlayground = async (id) => {
    if (!window.confirm("Delete this playground booking?")) return;
    try {
      await axios.delete(`${PLAYGROUND_URL}/${id}`, { withCredentials: true });
      setPlayground((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const handleDeleteCrematorium = async (id) => {
    if (!window.confirm("Delete this crematorium request?")) return;
    try {
      await axios.delete(`${CREMATORIUM_URL}/${id}`, { withCredentials: true });
      setCrematorium((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const total = playground.length + crematorium.length;

  const visible = useMemo(() => {
    if (tab === "playground") return { playground, crematorium: [] };
    if (tab === "crematorium") return { playground: [], crematorium };
    return { playground, crematorium };
  }, [tab, playground, crematorium]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="max-w-5xl mx-auto px-4">
          <Spinner label="Loading your bookings..." />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="text-red-600 mb-4">{err}</div>
          <button
            onClick={load}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-gray-600">View your Playground & Crematorium bookings in one place.</p>
          </div>
          <div className="flex gap-2">
            <TabChip active={tab === "all"} onClick={() => setTab("all")} label={`All (${total})`} />
            <TabChip
              active={tab === "playground"}
              onClick={() => setTab("playground")}
              label={`Playground (${playground.length})`}
              color="blue"
            />
            <TabChip
              active={tab === "crematorium"}
              onClick={() => setTab("crematorium")}
              label={`Crematorium (${crematorium.length})`}
              color="rose"
            />
          </div>
        </div>

        {/* empty state */}
        {total === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Playground list */}
            {visible.playground.length > 0 && (
              <section className="mb-8">
                <SectionHeader title="Playground Bookings" count={visible.playground.length} />
                <div className="grid gap-4">
                  {visible.playground.map((item, idx) => (
                    <PlaygroundCard
                      key={item._id || idx}
                      booking={item}
                      onDelete={() => handleDeletePlayground(item._id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Crematorium list */}
            {visible.crematorium.length > 0 && (
              <section>
                <SectionHeader title="Crematorium Requests" count={visible.crematorium.length} />
                <div className="grid gap-4">
                  {visible.crematorium.map((item, idx) => (
                    <CrematoriumCard
                      key={item._id || idx}
                      req={item}
                      onDelete={() => handleDeleteCrematorium(item._id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI Bits ---------------- */
function TabChip({ active, label, onClick, color = "slate" }) {
  const activeStyles =
    color === "blue"
      ? "bg-blue-600 text-white border-blue-600"
      : color === "rose"
      ? "bg-rose-600 text-white border-rose-600"
      : "bg-gray-900 text-white border-gray-900";
  const base =
    "px-3 py-2 text-sm rounded-lg border transition-colors shadow-sm";
  const inactive =
    color === "blue"
      ? "bg-white hover:bg-blue-50"
      : color === "rose"
      ? "bg-white hover:bg-rose-50"
      : "bg-white hover:bg-gray-50";
  return (
    <button onClick={onClick} className={`${base} ${active ? activeStyles : inactive}`}>
      {label}
    </button>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="text-sm text-gray-600">{count} item{count !== 1 ? "s" : ""}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white p-10 rounded-xl border text-center text-gray-600">
      <div className="mb-4">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
      <p className="text-gray-600">Create your first booking to get started.</p>
    </div>
  );
}

/* ---------------- Small building block ---------------- */
function Line({ label, value, icon }) {
  return (
    <p className="text-sm text-gray-600 flex items-center gap-2">
      {icon ? icon : null}
      <span className="font-medium">{label}:</span>
      <span className="truncate">{String(value ?? "—")}</span>
    </p>
  );
}

/* ================= Playground: UrbanClap-like two-column card ================= */
function PlaygroundCard({ booking, onDelete }) {
  const {
    _id, eventName, eventType, organizerName, email, phone,
    playgroundType, expectedAttendees, eventDate, startTime, endTime,
    description, specialRequirement, status, comment, createdAt
  } = booking || {};

  const prettyDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const statusText = status || "Pending";
  const statusTone =
    statusText === "Approved"
      ? { banner: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" }
      : statusText === "Rejected"
      ? { banner: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-100 text-rose-700 border-rose-200" }
      : { banner: "bg-amber-50 text-amber-800 border-amber-200", badge: "bg-amber-100 text-amber-800 border-amber-200" };

  const canDownloadCertificate = statusText === "Approved";

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,320px]">
        {/* LEFT: booking content */}
        <div className="p-6">
          {/* Status banner like "Booking Confirmed" */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusTone.banner}`}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/70">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="font-semibold">
              {statusText === "Approved" ? "Booking Confirmed" : statusText === "Rejected" ? "Booking Rejected" : "Awaiting Approval"}
            </span>
          </div>

          {/* Title & meta */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-slate-900">{eventName || "Untitled Event"}</h3>
            <p className="text-sm text-slate-600">{eventType || playgroundType || "Playground Booking"}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                <CalendarIcon className="w-3.5 h-3.5" /> {prettyDate(eventDate)}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border bg-slate-50 text-slate-700 border-slate-200">
                <ClockIcon className="w-3.5 h-3.5" /> {startTime || "—"} {startTime && endTime ? "–" : ""} {endTime || ""}
              </span>
              {playgroundType && (
                <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border bg-indigo-50 text-indigo-700 border-indigo-200">
                  {playgroundType}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-1.5">
              <Line label="Organizer" value={organizerName} icon={<UserIcon className="w-4 h-4 text-slate-500" />} />
              <Line label="Email" value={email} icon={<MailIcon className="w-4 h-4 text-slate-500" />} />
              {phone && <Line label="Phone" value={phone} />}
            </div>
            <div className="space-y-1.5">
              <Line label="Attendees" value={expectedAttendees} />
              <Line label="Created" value={prettyDate(createdAt)} />
            </div>
          </div>

          {description && (
            <p className="text-sm text-slate-700 mt-4">
              <span className="font-medium">Description: </span>{description}
            </p>
          )}
          {specialRequirement && (
            <p className="text-sm text-slate-700 mt-2">
              <span className="font-medium">Special Requirements: </span>{specialRequirement}
            </p>
          )}
          {comment && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">Admin Comment</p>
              <p className="text-sm text-slate-600">{comment}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to={`/userdetails/${_id}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update
            </Link>
            {canDownloadCertificate && (
              <button
                onClick={() => generatePDFCertificate(booking, "playground")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Download Permit
              </button>
            )}
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* RIGHT: compact summary panel like "Payment Summary" */}
        <aside className="border-t md:border-t-0 md:border-l p-6 bg-slate-50/60">
          <h4 className="text-sm font-semibold text-slate-900">Booking Summary</h4>
          <div className="mt-3 text-sm text-slate-700 space-y-2">
            <div className="flex justify-between"><span>Date</span><span>{prettyDate(eventDate)}</span></div>
            <div className="flex justify-between"><span>Time</span><span>{startTime || "—"} {startTime && endTime ? "–" : ""} {endTime || ""}</span></div>
            <div className="flex justify-between"><span>Type</span><span>{playgroundType || eventType || "—"}</span></div>
            <div className="flex justify-between"><span>Attendees</span><span>{expectedAttendees || "—"}</span></div>
            <div className="flex justify-between"><span>Status</span>
              <span className={`px-2 py-0.5 rounded-full border text-xs ${statusTone.badge}`}>{statusText}</span>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {canDownloadCertificate && (
              <button
                onClick={() => generatePDFCertificate(booking, "playground")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Get Certificate
              </button>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Top
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ================= Crematorium: UrbanClap-like two-column card ================= */
function CrematoriumCard({ req, onDelete }) {
  const {
    _id,
    applicantFullName,
    applicantEmail,
    address,
    deceasedFullName,
    dateOfDeath,
    cremationDate,
    startTime,
    endTime,
    nic,
    registrationNumber,
    deathCertificateImage,
    beOrderImage,
    status,
    approve,
    reject,
    comment,
    createdAt
  } = req || {};

  const fmtDate = (d, withTime = false) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString(
        "en-US",
        withTime
          ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }
          : { year: "numeric", month: "short", day: "numeric" }
      );
    } catch {
      return "—";
    }
  };

  const fileUrl = (p) => p ? `http://localhost:5000/${String(p).replace(/\\/g, "/")}` : null;

  const displayStatus = status ? status : approve ? "Approved" : reject ? "Rejected" : "Pending";
  const tone =
    displayStatus === "Approved"
      ? { banner: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" }
      : displayStatus === "Rejected"
      ? { banner: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-100 text-rose-700 border-rose-200" }
      : { banner: "bg-amber-50 text-amber-800 border-amber-200", badge: "bg-amber-100 text-amber-800 border-amber-200" };

  const canDownloadCertificate = displayStatus === "Approved";

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,320px]">
        {/* LEFT */}
        <div className="p-6">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${tone.banner}`}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/70">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="font-semibold">
              {displayStatus === "Approved" ? "Request Confirmed" : displayStatus === "Rejected" ? "Request Rejected" : "Awaiting Approval"}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-slate-900">
              {deceasedFullName ? `Cremation for ${deceasedFullName}` : "Crematorium Request"}
            </h3>
            <p className="text-sm text-slate-600">Applicant: {applicantFullName || "—"}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border bg-rose-50 text-rose-700 border-rose-200">
                <CalendarIcon className="w-3.5 h-3.5" /> {fmtDate(cremationDate)}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-md border bg-slate-50 text-slate-700 border-slate-200">
                <ClockIcon className="w-3.5 h-3.5" /> {startTime || "—"} {startTime && endTime ? "–" : ""} {endTime || ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-1.5">
              <Line label="Applicant Email" value={applicantEmail} icon={<MailIcon className="w-4 h-4 text-slate-500" />} />
              <Line label="NIC" value={nic} />
              <Line label="Address" value={address} icon={<MapPinIcon className="w-4 h-4 text-slate-500" />} />
            </div>
            <div className="space-y-1.5">
              <Line label="Date of Death" value={fmtDate(dateOfDeath)} />
              <Line label="Created" value={fmtDate(createdAt, true)} />
              <Line label="Registration No." value={registrationNumber || "—"} />
            </div>
          </div>

          {(deathCertificateImage || beOrderImage) && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Documents</p>
              <div className="flex flex-wrap gap-2">
                {deathCertificateImage && (
                  <a
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                    href={fileUrl(deathCertificateImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Death Certificate
                  </a>
                )}
                {beOrderImage && (
                  <a
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                    href={fileUrl(beOrderImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    B.E. Order / GRN Cert
                  </a>
                )}
              </div>
            </div>
          )}

          {comment && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">Admin Comment</p>
              <p className="text-sm text-slate-600">{comment}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            {/* Enable if you add a details view later */}
            {/* <Link to={`/crematoriumdetails/${_id}`} className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700">View</Link> */}
            {canDownloadCertificate && (
              <button
                onClick={() => generatePDFCertificate(req, "crematorium")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Download Permit
              </button>
            )}
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* RIGHT: compact summary panel */}
        <aside className="border-t md:border-t-0 md:border-l p-6 bg-slate-50/60">
          <h4 className="text-sm font-semibold text-slate-900">Request Summary</h4>
          <div className="mt-3 text-sm text-slate-700 space-y-2">
            <div className="flex justify-between"><span>Date</span><span>{fmtDate(cremationDate)}</span></div>
            <div className="flex justify-between"><span>Time</span><span>{startTime || "—"} {startTime && endTime ? "–" : ""} {endTime || ""}</span></div>
            <div className="flex justify-between"><span>Reg. Number</span><span>{registrationNumber || "—"}</span></div>
            <div className="flex justify-between"><span>Status</span>
              <span className={`px-2 py-0.5 rounded-full border text-xs ${tone.badge}`}>{displayStatus}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {canDownloadCertificate && (
              <button
                onClick={() => generatePDFCertificate(req, "crematorium")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Get Certificate
              </button>
            )}
            {(deathCertificateImage || beOrderImage) && (
              <a
                href={deathCertificateImage ? fileUrl(deathCertificateImage) : fileUrl(beOrderImage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors"
              >
                View Document
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}