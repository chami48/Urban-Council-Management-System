import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf"; // ✅ fixed import (must destructure)
import autoTable from "jspdf-autotable";
import Navigation from "../Navigation/Navigation";

import {
  Building,
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Clock,
  Eye,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

const URL = "http://localhost:5000/assessments";

// ----------------------------
// Loader
// ----------------------------
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Loading assessments
      </h3>
      <p className="text-sm text-gray-500">
        Please wait while we fetch the latest data...
      </p>
    </div>
  </div>
);

// ----------------------------
// Status Badge
// ----------------------------
const StatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: <CheckCircle size={12} />,
          text: "Active",
        };
      case "inactive":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle size={12} />,
          text: "Inactive",
        };
      default:
        return {
          color: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <Clock size={12} />,
          text: "Pending",
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border ${statusInfo.color}`}
    >
      {statusInfo.icon}
      {statusInfo.text}
    </div>
  );
};

// ----------------------------
// Assessment Card
// ----------------------------
const AssessmentCard = ({ assessment, index, onUpdate, onDelete, onView }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
  >
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {assessment.assessmentNo}
            </h3>
            <StatusBadge status={assessment.status} />
          </div>
          <p className="text-sm text-gray-600">
            {assessment.division} - {assessment.street}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">
            Rs. {assessment.appraisedValue}
          </p>
          <p className="text-sm text-gray-500">{assessment.taxRate}% tax rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Owner
            </p>
            <p className="font-medium text-gray-900">{assessment.ownerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Contact
            </p>
            <p className="font-medium text-gray-900">{assessment.contactNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Property No
            </p>
            <p className="font-medium text-gray-900">{assessment.propertyNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Building className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Type
            </p>
            <p className="font-medium text-gray-900">
              {assessment.propertyType}
            </p>
          </div>
        </div>
      </div>

      {assessment.description && (
        <div className="mb-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Description
            </p>
            <p className="text-sm text-gray-700">{assessment.description}</p>
          </div>
        </div>
      )}
    </div>

    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">NIC: {assessment.ownerNIC}</div>
        <div className="flex gap-3">
          <button
            onClick={() => onView(assessment)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Eye size={16} />
            View
          </button>
          <button
            onClick={() => onUpdate(assessment._id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Edit size={16} />
            Update
          </button>
          <button
            onClick={() => onDelete(assessment._id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// ----------------------------
// CONFIG for PDF
// ----------------------------
const CONFIG = {
  emblem: "/emblem.png",
  logo: "/horanalogo.png",
  signature: "/signature.png",
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  local: "Horana Nagara Sabhaawa",
  address: "Horana Urban Council, Mathugama Road, Horana, Sri Lanka",
  email: "info@horana.mc.gov.lk",
  fax: "+94 34 226 0505",
};

// ----------------------------
// Generate PDF Report
// ----------------------------
async function generateAssessmentsReport(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const now = new Date();

  // Helper to load images
  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
    });

  // Header
  const addHeader = async () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 150, "F");
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageWidth - margin, 145);

    const emblem = await loadImage(CONFIG.emblem);
    if (emblem) doc.addImage(emblem, "PNG", margin, 40, 50, 50);

    const logo = await loadImage(CONFIG.logo);
    if (logo) doc.addImage(logo, "PNG", pageWidth - margin - 50, 40, 50, 50);

    const cx = pageWidth / 2;
    doc.setTextColor(128, 0, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(CONFIG.country, cx, 35, { align: "center" });
    doc.setFontSize(16);
    doc.text(CONFIG.council, cx, 57, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(CONFIG.local, cx, 77, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${CONFIG.address} | Email: ${CONFIG.email} | Fax: ${CONFIG.fax}`,
      cx,
      98,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("PROPERTY ASSESSMENTS REPORT", cx, 120, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${now.toLocaleString()} | Total Records: ${data.length}`,
      cx,
      135,
      { align: "center" }
    );
  };

  // Footer
  const addFooter = async () => {
    const footerY = doc.internal.pageSize.getHeight() - 110;
    const sigX = pageWidth - margin - 160;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Generated on:", margin, footerY);
    doc.setFont("helvetica", "bold");
    doc.text(now.toLocaleString(), margin, footerY + 15);

    doc.setFont("helvetica", "normal");
    doc.text("Authorized by:", sigX, footerY);

    const signature = await loadImage(CONFIG.signature);
    if (signature) {
      doc.addImage(signature, "PNG", sigX, footerY + 10, 100, 25);
    } else {
      doc.setDrawColor(0, 100, 200);
      doc.line(sigX, footerY + 25, sigX + 150, footerY + 25);
    }

    doc.setFontSize(9);
    doc.text("Administrative Officer", sigX, footerY + 40);
    doc.text("Horana Urban Council", sigX, footerY + 52);

    doc.setDrawColor(128, 0, 32);
    doc.line(margin, footerY + 70, pageWidth - margin, footerY + 70);

    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(pageStr, pageWidth / 2, footerY + 85, { align: "center" });
  };

  await addHeader();
  autoTable(doc, {
    startY: 165,
    head: [
      [
        "Assessment No",
        "Owner",
        "Division",
        "Property Type",
        "Value (Rs.)",
        "Tax %",
        "Status",
      ],
    ],
    body: data.map((a) => [
      a.assessmentNo || "–",
      a.ownerName || "–",
      a.division || "–",
      a.propertyType || "–",
      a.appraisedValue || "–",
      a.taxRate || "–",
      a.status || "Pending",
    ]),
    headStyles: {
      fillColor: [128, 0, 32],
      textColor: [255, 255, 255],
      halign: "center",
      fontStyle: "bold",
    },
    bodyStyles: { halign: "center", valign: "middle" },
    alternateRowStyles: { fillColor: [248, 250, 255] },
    margin: { left: margin, right: margin },
    didDrawPage: async (d) => {
      if (d.pageNumber > 1) await addHeader();
      await addFooter();
    },
  });

  doc.save(`Property_Assessments_Report_${now.toISOString().slice(0, 10)}.pdf`);
}

// ----------------------------
// Main Component
// ----------------------------
function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAssessments(assessments);
    } else {
      const filtered = assessments.filter((item) =>
        Object.values(item).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredAssessments(filtered);
    }
  }, [searchQuery, assessments]);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL);
      setAssessments(res.data.assessments || []);
      setFilteredAssessments(res.data.assessments || []);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?"))
      return;
    try {
      await axios.delete(`${URL}/${id}`);
      loadAssessments();
    } catch (err) {
      console.error("Error deleting assessment:", err);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateassessment/${id}`);
  };

  const handleAddAssessment = () => {
    navigate("/addassessment");
  };

  const handleView = (assessment) => {
    console.log("View assessment:", assessment);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "ml-20" : "ml-72"
          }`}
        >
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Building className="w-8 h-8 text-blue-600" />
                  Property Assessments
                </h1>
                <p className="text-lg text-gray-600">
                  Manage and view all property assessment records
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4">
                <button
                  onClick={() => generateAssessmentsReport(filteredAssessments)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>

                <button
                  onClick={handleAddAssessment}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Assessment
                </button>

                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredAssessments.length}
                    </p>
                    <p className="text-sm text-gray-500">Shown</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {assessments.length}
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search assessments by any field..."
                      className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredAssessments.length > 0 ? (
              <motion.div
                key="assessments-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {filteredAssessments.map((assessment, index) => (
                  <AssessmentCard
                    key={assessment._id}
                    assessment={assessment}
                    index={index}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-assessments"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center bg-white rounded-2xl border border-gray-200 p-16 shadow-sm"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Building size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No assessments found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {searchQuery
                    ? "Try adjusting your search criteria to find relevant assessments."
                    : "No property assessments are currently available. Add your first assessment to get started."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={handleAddAssessment}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Plus size={20} />
                    Add Your First Assessment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Assessments;
