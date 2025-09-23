import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navigation from "../Navigation/Navigation";
import {
  Building, Search, Plus, Edit, Trash2, FileText,
  MapPin, User, Phone, DollarSign, Clock, Eye,
  Download, RefreshCw, AlertCircle, CheckCircle, XCircle
} from "lucide-react";

const URL = "http://localhost:5000/assessments";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching assessments:", err);
    return { assessments: [] };
  }
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading assessments</h3>
      <p className="text-sm text-gray-500">Please wait while we fetch the latest data...</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "ක්‍රියාකාරී":
      case "active":
        return { 
          color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
          icon: <CheckCircle size={12} />,
          text: "Active"
        };
      case "අක්‍රිය":
      case "inactive":
        return { 
          color: "bg-red-100 text-red-700 border-red-200", 
          icon: <XCircle size={12} />,
          text: "Inactive"
        };
      default:
        return { 
          color: "bg-amber-100 text-amber-700 border-amber-200", 
          icon: <Clock size={12} />,
          text: "Pending"
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border ${statusInfo.color}`}>
      {statusInfo.icon}
      {statusInfo.text}
    </div>
  );
};

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
            <h3 className="text-lg font-bold text-gray-900">{assessment.assessmentNo}</h3>
            <StatusBadge status={assessment.status} />
          </div>
          <p className="text-sm text-gray-600">{assessment.division} - {assessment.street}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">Rs. {assessment.appraisedValue}</p>
          <p className="text-sm text-gray-500">{assessment.taxRate}% tax rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Owner</p>
            <p className="font-medium text-gray-900">{assessment.ownerName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
            <p className="font-medium text-gray-900">{assessment.contactNo}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Property No</p>
            <p className="font-medium text-gray-900">{assessment.propertyNo}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Building className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Type</p>
            <p className="font-medium text-gray-900">{assessment.propertyType}</p>
          </div>
        </div>
      </div>

      {assessment.description && (
        <div className="mb-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
            <p className="text-sm text-gray-700">{assessment.description}</p>
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

function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // PDF Generation Function (without autoTable)
 // --- Drop-in replacement ---
const generateAssessmentsReport = () => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Brand palette (Tailwind-ish)
  const BRAND = { r: 37, g: 99, b: 235 };        // blue-600
  const BORDER = { r: 229, g: 231, b: 235 };     // gray-200
  const TEXT_MUTED = { r: 100, g: 116, b: 139 }; // slate-500

  // Helpers
  const mm = (n) => Number(n.toFixed(2));
  const pad = 12;
  const HEADER_H = 32;
  const FOOTER_H = 12;

  const formatRs = (n) => {
    const v = Number(n) || 0;
    return `Rs. ${v.toLocaleString("en-LK")}`;
  };

  const normalizeStatus = (s) => {
    const v = (s || "").toString().toLowerCase();
    if (v === "active" || v.includes("ක්‍රියා")) return "Active";
    if (v === "inactive" || v.includes("අක්‍රිය")) return "Inactive";
    return "Pending";
  };

  const statusChip = (status) => {
    const s = normalizeStatus(status);
    if (s === "Active")   return { label: "Active",   bg: [209, 250, 229], fg: [5, 150, 105] };    // emerald
    if (s === "Inactive") return { label: "Inactive", bg: [254, 226, 226], fg: [220, 38, 38] };   // red
    return { label: "Pending", bg: [254, 243, 199], fg: [217, 119, 6] };                           // amber
  };

  // Header (drawn on every page via autoTable hook)
  const drawHeader = () => {
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.rect(0, 0, pageWidth, HEADER_H, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Property Assessments Report", pad, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      pad,
      24
    );

    // Right meta
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${filteredAssessments.length}`, pageWidth - pad, 16, { align: "right" });
    if (searchQuery?.trim()) {
      doc.setFont("helvetica", "normal");
      doc.text(`Filter: "${searchQuery}"`, pageWidth - pad, 24, { align: "right" });
    }

    // bottom hairline
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(pad, HEADER_H - 3, pageWidth - pad, HEADER_H - 3);
    // Reset text color for body
    doc.setTextColor(0, 0, 0);
  };

  // Footer (we'll add page X of Y after generating all pages)
  const drawFooter = (i, total) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);

    const footerY = pageHeight - 6;
    doc.text("Property Assessment System — Horana Municipal Council", pageWidth / 2, footerY, { align: "center" });
    doc.text(`Page ${i} of ${total}`, pageWidth - pad, footerY, { align: "right" });
    doc.setTextColor(0, 0, 0);
  };

  // KPI cards on the first page
  const drawKpis = (yStart) => {
    const activeCount = filteredAssessments.filter(
      (a) => normalizeStatus(a.status) === "Active"
    ).length;
    const inactiveCount = filteredAssessments.filter(
      (a) => normalizeStatus(a.status) === "Inactive"
    ).length;
    const pendingCount = filteredAssessments.length - activeCount - inactiveCount;

    const totalValue = filteredAssessments.reduce(
      (sum, a) => sum + (parseFloat(a.appraisedValue) || 0),
      0
    );
    const avgValue =
      filteredAssessments.length > 0 ? totalValue / filteredAssessments.length : 0;

    const cards = [
      { label: "Active", value: activeCount.toString() },
      { label: "Inactive", value: inactiveCount.toString() },
      { label: "Pending", value: pendingCount.toString() },
      { label: "Total Appraised Value", value: formatRs(totalValue) },
    ];

    const gap = 6;
    const cols = 2;
    const cardW = mm((pageWidth - pad * 2 - gap * (cols - 1)) / cols);
    const cardH = 24;

    doc.setDrawColor(BORDER.r, BORDER.g, BORDER.b);

    cards.forEach((c, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const x = pad + col * (cardW + gap);
      const y = yStart + row * (cardH + gap);

      // Background
      doc.setFillColor(248, 250, 252); // slate-50
      doc.roundedRect(x, y, cardW, cardH, 3, 3, "F");

      // Text
      doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(c.label, x + 6, y + 9);

      doc.setTextColor(17, 24, 39); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(c.value, x + 6, y + 18);
    });

    // section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("Summary", pad, yStart - 2);

    return yStart + 2 * (cardH + gap); // bottom Y
  };

  // Early "no data" path
  if (!filteredAssessments?.length) {
    // Header for page 1 via manual draw (didDrawPage will also draw it, but this is fine)
    drawHeader();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("No assessments to display.", pad, HEADER_H + 20);

    // Footer with page count
    drawFooter(1, 1);
    const filename = `Property_Assessments_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
    return;
  }

  // 1) Draw KPI cards and remember where the table should start
  const kpiBottomY = drawKpis(HEADER_H + 12);
  const tableStartY = kpiBottomY + 10;

  // 2) Build table rows
  const rows = filteredAssessments.map((a, i) => ({
    idx: i + 1,
    assessmentNo: a.assessmentNo || "–",
    ownerName: a.ownerName || "–",
    division: a.division || "–",
    propertyType: a.propertyType || "–",
    value: formatRs(a.appraisedValue),
    taxRate: `${a.taxRate ?? 0}%`,
    status: normalizeStatus(a.status),
  }));

  // 3) Render table (striped, compact, with status chips)
  autoTable(doc, {
    startY: tableStartY,
    margin: { top: HEADER_H + 4, bottom: FOOTER_H + 6, left: pad, right: pad },
    head: [[
      "#", "Assessment No", "Owner", "Division", "Type", "Value (Rs.)", "Tax %", "Status"
    ]],
    body: rows.map(r => [
      r.idx,
      r.assessmentNo,
      r.ownerName,
      r.division,
      r.propertyType,
      r.value,
      r.taxRate,
      r.status
    ]),
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8.8,
      cellPadding: 3,
      lineColor: [BORDER.r, BORDER.g, BORDER.b],
      lineWidth: 0.2,
      textColor: [17, 24, 39],
      valign: "middle",
    },
    headStyles: {
      fillColor: [BRAND.r, BRAND.g, BRAND.b],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      textColor: [17, 24, 39],
    },
    columnStyles: {
      0: { halign: "right", cellWidth: 8 },
      1: { cellWidth: 26 },
      2: { cellWidth: 34 },
      3: { cellWidth: 24 },
      4: { cellWidth: 22 },
      5: { halign: "right" },
      6: { halign: "right", cellWidth: 16 },
      7: { halign: "center", cellWidth: 18 },
    },
    didParseCell: (data) => {
      // Paint "chip" style for Status
      if (data.section === "body" && data.column.index === 7) {
        const chip = statusChip(data.cell.raw);
        data.cell.styles.fillColor = chip.bg;
        data.cell.styles.textColor = chip.fg;
        data.cell.styles.fontStyle = "bold";
      }
      // Right-align numeric
      if (data.section === "body" && (data.column.index === 5 || data.column.index === 6)) {
        data.cell.styles.halign = "right";
      }
    },
    didDrawPage: () => {
      // Header on every page
      drawHeader();
      // Optional: faint page border
      doc.setDrawColor(BORDER.r, BORDER.g, BORDER.b);
      doc.setLineWidth(0.2);
      doc.rect(pad - 2, HEADER_H + 4, pageWidth - (pad - 2) * 2, pageHeight - HEADER_H - FOOTER_H - 8);
    },
  });

  // 4) Add footer page numbers after we know the total
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawFooter(i, pageCount);
  }

  const filename = `Property_Assessments_Report_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};


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
      const data = await fetchHandler();
      setAssessments(data.assessments || []);
      setFilteredAssessments(data.assessments || []);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
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
    // You can implement a view modal or navigate to details page
    console.log("View assessment:", assessment);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
        />
        <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
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
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
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
                {/* PDF Download Button */}
                <button
                  onClick={generateAssessmentsReport}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  Generate Report
                </button>
                
                {/* Add Assessment Button */}
                <button
                  onClick={handleAddAssessment}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Assessment
                </button>
                
                {/* Stats */}
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{filteredAssessments.length}</p>
                    <p className="text-sm text-gray-500">Shown</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{assessments.length}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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

          {/* Content */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
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