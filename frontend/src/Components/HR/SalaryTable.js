import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Navigation from "../Navigation/Navigation";

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([]);
  const navigate = useNavigate();

  const handleExport = () => {
    if (!salaries.length) return;

    const headers = ["Employee ID", "Month", "Year", "Basic Salary", "Net Salary"];
    const rows = salaries.map((s) => [
      s.employeeId,
      s.month,
      s.year,
      Number(s.basicSalary).toFixed(2),
      Number(s.netSalary).toFixed(2),
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [
      { wch: 15 },
      { wch: 10 },
      { wch: 8 },
      { wch: 12 },
      { wch: 12 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Report");
    XLSX.writeFile(wb, "salary_report.xlsx");
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
                  className={`cursor-pointer group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${!salaries.length ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-5 h-5 mr-2">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Export Excel
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Statistics Cards */}
            {salaries.length > 0 && (
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
                      <div className="text-2xl font-bold text-gray-800">{salaries.length}</div>
                      <div className="text-gray-600">Total Records</div>
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
                        Rs {Math.round(salaries.reduce((sum, s) => sum + Number(s.basicSalary), 0) / salaries.length).toLocaleString()}
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
                        Rs {Math.round(salaries.reduce((sum, s) => sum + Number(s.netSalary), 0) / salaries.length).toLocaleString()}
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
                  {salaries.length === 0 ? (
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
                        <div className="text-gray-500 text-lg font-medium">No salary records found</div>
                        <div className="text-gray-400 text-sm mt-1">Create your first salary record to get started</div>
                      </div>
                    </motion.div>
                  ) : (
                    salaries.map((s, index) => (
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