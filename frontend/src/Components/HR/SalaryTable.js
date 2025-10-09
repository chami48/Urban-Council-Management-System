import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Navigation from "../Navigation/Navigation";

// Government letterhead configuration
const GOVERNMENT_CONFIG = {
  emblemPath: "/emblem.png",
  logoPath: "/horanalogo.png",
  signaturePath: "/signature.png",
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  localName: "Horana Nagara Sabhaawa",
  address: "123, Mathugama Horana",
  email: "horanaurbancouncil123@gmail.com",
  fax: "1235565"
};

// Helper function to load PNG images as base64
const loadImageAsBase64 = (src) => {
  console.log('🔍 PNG Loading Debug - Starting to load PNG from:', src);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ PNG Loading Debug - Image loaded successfully');
      console.log('🔍 PNG Loading Debug - Image dimensions:', img.width, 'x', img.height);
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        console.log('✅ PNG Loading Debug - Successfully converted to base64, length:', dataURL.length);
        resolve(dataURL);
      } catch (error) {
        console.error('❌ PNG Loading Debug - Canvas error:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('❌ PNG Loading Debug - Failed to load image:', src);
      console.error('❌ PNG Loading Debug - Error event:', error);
      reject(error);
    };
    
    const fullUrl = new URL(src, window.location.origin).href;
    console.log('🔍 PNG Loading Debug - Full URL:', fullUrl);
    
    img.src = src;
  });
};

// PDF Report Builder
async function buildPdfReport({ rows, columns, title, subtitle }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const currentDate = new Date();
  
  const addGovernmentHeader = async () => {
    console.log('🔧 PDF Generation Debug - Starting government header creation');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 150, 'F');
    
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageWidth - margin, 145);
    
    let emblemLoaded = false;
    let logoLoaded = false;
    
    try {
      const emblemBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.emblemPath);
      if (emblemBase64) {
        doc.addImage(emblemBase64, 'PNG', margin, 40, 50, 50);
        emblemLoaded = true;
      }
    } catch (error) {
      console.error('❌ PDF Generation Debug - Emblem loading error:', error);
    }
    
    try {
      const logoBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.logoPath);
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', pageWidth - margin - 50, 40, 50, 50);
        logoLoaded = true;
      }
    } catch (error) {
      console.error('❌ PDF Generation Debug - Logo loading error:', error);
    }
    
    if (!emblemLoaded) {
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(2);
      doc.rect(margin, 40, 50, 50, 'S');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text('EMBLEM', margin + 10, 60, { align: 'left' });
      doc.text('NOT FOUND', margin + 5, 75, { align: 'left' });
    }
    
    if (!logoLoaded) {
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(2);
      doc.rect(pageWidth - margin - 50, 40, 50, 50, 'S');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text('LOGO', pageWidth - margin - 35, 60, { align: 'left' });
      doc.text('NOT FOUND', pageWidth - margin - 45, 75, { align: 'left' });
    }
    
    const centerX = pageWidth / 2;
    
    doc.setTextColor(128, 0, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(GOVERNMENT_CONFIG.country, centerX, 35, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(GOVERNMENT_CONFIG.council, centerX, 57, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text(GOVERNMENT_CONFIG.localName, centerX, 77, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`${GOVERNMENT_CONFIG.address} | Email: ${GOVERNMENT_CONFIG.email} | Fax: ${GOVERNMENT_CONFIG.fax}`, centerX, 98, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), centerX, 120, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, centerX, 135, { align: 'center' });
  };
  
  const addFooter = async () => {
    const footerY = pageHeight - 110;
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Generated on:', margin, footerY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(currentDate.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), margin, footerY + 15);
    doc.text(currentDate.toLocaleTimeString('en-GB', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }), margin, footerY + 30);
    
    const sigX = pageWidth - margin - 160;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Authorized by:', sigX, footerY);
    
    let signatureLoaded = false;
    try {
      const signatureBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.signaturePath);
      if (signatureBase64) {
        doc.addImage(signatureBase64, 'PNG', sigX, footerY + 10, 100, 25);
        signatureLoaded = true;
      }
    } catch (error) {
      console.error('❌ PDF Footer Debug - Signature loading error:', error);
    }
    
    if (!signatureLoaded) {
      doc.setDrawColor(0, 100, 200);
      doc.setLineWidth(2);
      doc.line(sigX, footerY + 25, sigX + 150, footerY + 25);
      
      doc.setDrawColor(0, 80, 180);
      doc.setLineWidth(2.5);
      const sigY = footerY + 20;
      doc.line(sigX + 15, sigY, sigX + 35, sigY - 6);
      doc.line(sigX + 35, sigY - 6, sigX + 55, sigY + 4);
      doc.line(sigX + 55, sigY + 4, sigX + 85, sigY - 3);
      doc.line(sigX + 85, sigY - 3, sigX + 115, sigY + 6);
      doc.line(sigX + 115, sigY + 6, sigX + 135, sigY - 2);
    }
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Administrative Officer', sigX, footerY + 40);
    doc.text('Horana Urban Council', sigX, footerY + 52);
    
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(1);
    doc.line(margin, footerY + 70, pageWidth - margin, footerY + 70);
    
    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(pageStr, pageWidth / 2, footerY + 85, { align: 'center' });
  };

  const addSimpleHeader = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 150, 'F');
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageWidth - margin, 145);
    
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(2);
    doc.rect(margin, 40, 50, 50, 'S');
    doc.rect(pageWidth - margin - 50, 40, 50, 50, 'S');
    
    const centerX = pageWidth / 2;
    doc.setTextColor(128, 0, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(GOVERNMENT_CONFIG.country, centerX, 35, { align: 'center' });
    doc.setFontSize(16);
    doc.text(GOVERNMENT_CONFIG.council, centerX, 57, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text(GOVERNMENT_CONFIG.localName, centerX, 77, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), centerX, 120, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, centerX, 135, { align: 'center' });
  };

  await addGovernmentHeader();

  autoTable(doc, {
    startY: 165,
    headStyles: { 
      fillColor: [128, 0, 32],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11,
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 10,
      lineColor: [180, 180, 180],
      lineWidth: 0.5,
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 255]
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 8,
      halign: 'center',
      overflow: 'linebreak'
    },
    head: [columns.map(c => c.header)],
    body: rows.map(r => columns.map(c => (typeof c.accessor === 'function' ? c.accessor(r) : r[c.accessor] ?? 'N/A'))),
    didDrawPage: async (data) => {
      if (data.pageNumber > 1) {
        addSimpleHeader();
      }
      await addFooter();
    },
    margin: { top: 170, bottom: 120, left: margin, right: margin }
  });

  if (doc.internal.getNumberOfPages() === 1) {
    await addFooter();
  }

  return doc;
}

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleExport = async () => {
    if (!filteredSalaries.length) return;

    const columns = [
      { header: 'Employee ID', accessor: 'employeeId' },
      { header: 'Month', accessor: 'month' },
      { header: 'Year', accessor: 'year' },
      { header: 'Basic Salary', accessor: (r) => `Rs ${Number(r.basicSalary).toFixed(2)}` },
      { header: 'Net Salary', accessor: (r) => `Rs ${Number(r.netSalary).toFixed(2)}` }
    ];

    const now = new Date();

    try {
      const doc = await buildPdfReport({
        rows: filteredSalaries,
        columns,
        title: 'Salary Report',
        subtitle: `Generated on ${now.toLocaleString()} | Total Records: ${filteredSalaries.length}`
      });

      doc.save(`Salary_Report_${now.toISOString().slice(0, 10)}.pdf`);
      
      Swal.fire({
        title: "Success!",
        text: "PDF report has been generated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF. Please try again.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/salaries")
      .then((res) => res.json())
      .then((data) => setSalaries(data));
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This salary record will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:5000/api/salaries/${id}`, { method: "DELETE" });

        setSalaries((prev) => prev.filter((s) => s._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The salary record has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // Filter salaries based on search term
  const filteredSalaries = salaries.filter((salary) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      salary.employeeId?.toLowerCase().includes(searchLower) ||
      salary.month?.toLowerCase().includes(searchLower) ||
      salary.year?.toString().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content Wrapper */}
      <div className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          
          {/* Header Section */}
          <div className="mb-8">
            {/* Title Area */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg"
              >
                <div className="w-8 h-8 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m-6 0l-3 3m3-3l3 3m-3-3V4m0 0L9 7m3-3l3 3" />
                  </svg>
                </div>
              </motion.div>
              <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Salary Records
              </div>
              <div className="text-gray-600 text-lg">
                Manage and view all employee salary information
              </div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Employee ID, Month, or Year..."
                  className="w-full px-6 py-4 pl-12 text-sm border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600 text-center">
                  Found <span className="font-bold text-blue-600">{filteredSalaries.length}</span> of {salaries.length} records
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  onClick={() => navigate("/salary")}
                  className="cursor-pointer group relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-5 h-5 mr-2">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    Create New
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  onClick={handleExport}
                  className={`cursor-pointer group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${!filteredSalaries.length ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-5 h-5 mr-2">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Export PDF
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Statistics Cards */}
            {filteredSalaries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {/* Total Records */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <div className="w-6 h-6 text-white">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{filteredSalaries.length}</div>
                      <div className="text-gray-600">{searchTerm ? 'Filtered' : 'Total'} Records</div>
                    </div>
                  </div>
                </div>
                
                {/* Average Basic Salary */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <div className="w-6 h-6 text-white font-bold text-lg flex items-center justify-center">
                       ₨
                    </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        Rs {Math.round(filteredSalaries.reduce((sum, s) => sum + Number(s.basicSalary), 0) / filteredSalaries.length).toLocaleString()}
                      </div>
                      <div className="text-gray-600">Avg Basic Salary</div>
                    </div>
                  </div>
                </div>
                
                {/* Average Net Salary */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <div className="w-6 h-6 text-white">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        Rs {Math.round(filteredSalaries.reduce((sum, s) => sum + Number(s.netSalary), 0) / filteredSalaries.length).toLocaleString()}
                      </div>
                      <div className="text-gray-600">Avg Net Salary</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Table Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="text-xl font-bold text-gray-800">Employee Salary Records</div>
              <div className="text-gray-600 text-sm">Detailed salary information for all employees</div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {/* Table Header Row */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 grid grid-cols-6 gap-4 border-b border-gray-200">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Employee ID</div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Month</div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Year</div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Basic Salary</div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Net Salary</div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</div>
              </div>

              {/* Table Body */}
              <div className="bg-white">
                <AnimatePresence>
                  {filteredSalaries.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <div className="w-8 h-8 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-gray-500 text-lg font-medium">
                          {searchTerm ? "No matching salary records found" : "No salary records found"}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          {searchTerm ? "Try adjusting your search criteria" : "Create your first salary record to get started"}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    filteredSalaries.map((s, index) => (
                      <motion.div
                        key={s._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 grid grid-cols-6 gap-4 border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200"
                      >
                        {/* Employee ID */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <div className="text-white font-bold text-sm">{s.employeeId.slice(-2)}</div>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{s.employeeId}</div>
                        </div>

                        {/* Month */}
                        <div className="flex items-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {s.month}
                          </div>
                        </div>

                        {/* Year */}
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          {s.year}
                        </div>

                        {/* Basic Salary */}
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-900">
                            Rs {Number(s.basicSalary).toLocaleString()}
                          </div>
                        </div>

                        {/* Net Salary */}
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-green-600">
                            Rs {Number(s.netSalary).toLocaleString()}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <div
                            onClick={() => navigate(`/salary/view/${s._id}`)}
                            className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-lg transition-colors duration-200"
                          >
                            <div className="w-3 h-3 mr-1">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            View
                          </div>
                          <div
                            onClick={() => navigate(`/salary/update/${s._id}`)}
                            className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium rounded-lg transition-colors duration-200"
                          >
                            <div className="w-3 h-3 mr-1">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                            Update
                          </div>
                          <div
                            onClick={() => handleDelete(s._id)}
                            className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-medium rounded-lg transition-colors duration-200"
                          >
                            <div className="w-3 h-3 mr-1">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </div>
                            Delete
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SalaryTable;