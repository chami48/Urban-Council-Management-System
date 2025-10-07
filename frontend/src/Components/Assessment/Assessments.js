// src/Components/Assessments/Assessments.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
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

// ==========================
// Backend API URL
// ==========================
const URL = "http://localhost:5000/assessments";

// ==========================
// GOV Header/Footer Config
// ==========================
const GOV = {
  emblemPath: "/emblem.png",
  logoPath: "/horanalogo.png",
  signaturePath: "/signature.png",
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  localName: "Horana Nagara Sabhaawa",
  address: "Horana Urban Council, Mathugama Road, Horana, Sri Lanka",
  email: "info@horana.mc.gov.lk",
  fax: "+94 34 226 0505",
};

// ==========================
// Loader Component
// ==========================
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

// ==========================
// Status Badge
// ==========================
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

// ==========================
// Helper: Load image as Base64
// ==========================
const loadPngAsBase64 = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = src;
  });

// ==========================
// PDF Generator
// ==========================
async function buildAssessmentPdf({ rows, columns, title, subtitle }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const now = new Date();

  // Header
  const addHeader = async () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 150, "F");
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageW - margin, 145);

    try {
      const emblem = await loadPngAsBase64(GOV.emblemPath);
      doc.addImage(emblem, "PNG", margin, 40, 50, 50);
    } catch {}

    try {
      const logo = await loadPngAsBase64(GOV.logoPath);
      doc.addImage(logo, "PNG", pageW - margin - 50, 40, 50, 50);
    } catch {}

    const cx = pageW / 2;
    doc.setTextColor(128, 0, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(GOV.country, cx, 35, { align: "center" });
    doc.setFontSize(16);
    doc.text(GOV.council, cx, 57, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(GOV.localName, cx, 77, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${GOV.address} | Email: ${GOV.email} | Fax: ${GOV.fax}`,
      cx,
      98,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), cx, 120, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, cx, 135, { align: "center" });
  };

  // Footer
  const addFooter = async () => {
    const footerY = pageH - 110;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Generated on:", margin, footerY);
    doc.setFont("helvetica", "bold");
    doc.text(now.toLocaleString(), margin, footerY + 15);

    const sigX = pageW - margin - 160;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Authorized by:", sigX, footerY);

    try {
      const sig = await loadPngAsBase64(GOV.signaturePath);
      doc.addImage(sig, "PNG", sigX, footerY + 10, 100, 25);
    } catch {
      doc.setDrawColor(0, 0, 0);
      doc.line(sigX, footerY + 25, sigX + 150, footerY + 25);
    }

    doc.setFontSize(9);
    doc.text("Administrative Officer", sigX, footerY + 40);
    doc.text("Horana Urban Council", sigX, footerY + 52);

    doc.setDrawColor(128, 0, 32);
    doc.line(margin, footerY + 70, pageW - margin, footerY + 70);

    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(pageStr, pageW / 2, footerY + 85, { align: "center" });
  };

  await addHeader();
  autoTable(doc, {
    startY: 165,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) =>
      columns.map((c) => {
        let val =
          typeof c.accessor === "function"
            ? c.accessor(r)
            : r[c.accessor] ?? "";

        // format money
        if (c.header.includes("Value")) {
          val = r.appraisedValue
            ? `Rs. ${Number(r.appraisedValue).toLocaleString("en-LK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "Rs. 0.00";
        }
        // format tax
        if (c.header.includes("Tax")) {
          val =
            r.taxRate != null
              ? `${Number(r.taxRate).toLocaleString("en-LK", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}%`
              : "–";
        }
        return val;
      })
    ),
    headStyles: {
      fillColor: [128, 0, 32],
      textColor: [255, 255, 255],
      halign: "center",
      fontStyle: "bold",
    },
    bodyStyles: { halign: "center", valign: "middle", fontSize: 10 },
    alternateRowStyles: { fillColor: [248, 250, 255] },
    margin: { top: 170, bottom: 120, left: margin, right: margin },
    didDrawPage: async (d) => {
      if (d.pageNumber > 1) await addHeader();
      await addFooter();
    },
  });

  if (doc.internal.getNumberOfPages() === 1) {
    await addFooter();
  }

  doc.save(`Property_Assessments_Report_${now.toISOString().slice(0, 10)}.pdf`);
}

// ==========================
// Main Component
// ==========================
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

  const handleUpdate = (id) => navigate(`/updateassessment/${id}`);
  const handleAddAssessment = () => navigate("/addassessment");
  const handleView = (assessment) => console.log("View assessment:", assessment);

  // Table Columns for PDF
  const columns = [
    { header: "Assessment No", accessor: "assessmentNo" },
    { header: "Owner", accessor: "ownerName" },
    { header: "Division", accessor: "division" },
    { header: "Street", accessor: "street" },
    { header: "Property Type", accessor: "propertyType" },
    { header: "Property No", accessor: "propertyNo" },
    { header: "Value (Rs.)", accessor: "appraisedValue" },
    { header: "Tax %", accessor: "taxRate" },
    { header: "Status", accessor: "status" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main className={sidebarCollapsed ? "ml-20" : "ml-72"}>
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
      <main className={sidebarCollapsed ? "ml-20" : "ml-72"}>
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
                  onClick={() =>
                    buildAssessmentPdf({
                      rows: filteredAssessments,
                      columns,
                      title: "Property Assessments Report",
                      subtitle: `Records: ${filteredAssessments.length} • ${new Date().toLocaleString()}`,
                    })
                  }
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>

                <button
                  onClick={handleAddAssessment}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Assessment
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search assessments by any field..."
                    className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl"
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
                  <motion.div
                    key={assessment._id}
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
                            {assessment.appraisedValue
                              ? `Rs. ${Number(
                                  assessment.appraisedValue
                                ).toLocaleString("en-LK", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : "Rs. 0.00"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {assessment.taxRate
                              ? `${Number(assessment.taxRate).toLocaleString(
                                  "en-LK",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}% tax rate`
                              : "–"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Owner
                            </p>
                            <p className="font-medium text-gray-900">
                              {assessment.ownerName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Contact
                            </p>
                            <p className="font-medium text-gray-900">
                              {assessment.contactNo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Property No
                            </p>
                            <p className="font-medium text-gray-900">
                              {assessment.propertyNo}
                            </p>
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
                            <p className="text-sm text-gray-700">
                              {assessment.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          NIC: {assessment.ownerNIC}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleView(assessment)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleUpdate(assessment._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(assessment._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center bg-white p-16 rounded-2xl border">
                <h3 className="text-xl font-semibold">No assessments found</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Assessments;
