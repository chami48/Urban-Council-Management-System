import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const initialSalary = {
  employeeId: '',
  month: '',
  year: '',
  basicSalary: '',
  allowances: { transport: '', meal: '', medical: '', other: '' },
  overtime: { normalDayHours: '', holidayHours: '' },
  deductions: { loan: '', insurance: '', other: '' }
};

const SalaryForm = () => {
  const [salary, setSalary] = useState(initialSalary);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const currentYear = 2025; // Fixed to 2025
  const currentMonth = 9; // October (0-indexed, so 9 = October)

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Employee ID validation
    if (!salary.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    // Month validation
    if (!salary.month) {
      newErrors.month = 'Month is required';
    }

    // Year validation
    if (!salary.year) {
      newErrors.year = 'Year is required';
    } else {
      const selectedYear = Number(salary.year);
      if (selectedYear !== currentYear) {
        newErrors.year = `Only year ${currentYear} is allowed`;
      }
    }

    // Month/Year combination validation
    if (salary.month && salary.year) {
      const monthIndex = getMonthNumber(salary.month);
      const selectedYear = Number(salary.year);
      if (selectedYear === currentYear && monthIndex < currentMonth) {
        newErrors.month = 'Cannot select past months. Only October and later months are allowed';
      }
    }

    // Basic salary validation
    if (!salary.basicSalary) {
      newErrors.basicSalary = 'Basic salary is required';
    } else {
      const basicSalaryNum = Number(salary.basicSalary);
      if (basicSalaryNum <= 0) {
        newErrors.basicSalary = 'Basic salary must be greater than 0';
      }
      if (basicSalaryNum < 50000) {
        newErrors.basicSalary = 'Basic salary seems too low (minimum Rs 50,000)';
      }
      if (basicSalaryNum > 500000000) {
        newErrors.basicSalary = 'Basic salary seems too high (maximum Rs 500,000,000)';
      }
    }

    // Allowances validation
    const allowanceFields = ['transport', 'meal', 'medical', 'other'];
    allowanceFields.forEach(field => {
      const value = salary.allowances[field];
      if (value && Number(value) < 0) {
        newErrors[`allowances.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} allowance cannot be negative`;
      }
      if (value && Number(value) > 50000000) {
        newErrors[`allowances.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} allowance seems too high`;
      }
    });

    // Overtime validation
    const normalDayHours = Number(salary.overtime.normalDayHours || 0);
    const holidayHours = Number(salary.overtime.holidayHours || 0);
    
    if (salary.overtime.normalDayHours && normalDayHours < 0) {
      newErrors['overtime.normalDayHours'] = 'Normal day hours cannot be negative';
    }
    if (salary.overtime.normalDayHours && normalDayHours > 500) {
      newErrors['overtime.normalDayHours'] = 'Normal day hours seems too high (max 500 per month)';
    }
    
    if (salary.overtime.holidayHours && holidayHours < 0) {
      newErrors['overtime.holidayHours'] = 'Holiday hours cannot be negative';
    }
    if (salary.overtime.holidayHours && holidayHours > 200) {
      newErrors['overtime.holidayHours'] = 'Holiday hours seems too high (max 200 per month)';
    }

    // Deductions validation
    const deductionFields = ['loan', 'insurance', 'other'];
    const basicSalaryNum = Number(salary.basicSalary || 0);
    
    deductionFields.forEach(field => {
      const value = Number(salary.deductions[field] || 0);
      if (salary.deductions[field] && value < 0) {
        newErrors[`deductions.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} deduction cannot be negative`;
      }
      if (salary.deductions[field] && value > basicSalaryNum) {
        newErrors[`deductions.${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} deduction cannot exceed basic salary`;
      }
    });

    // Total deductions validation
    const totalDeductions = deductionFields.reduce((sum, field) => sum + Number(salary.deductions[field] || 0), 0);
    if (totalDeductions > basicSalaryNum) {
      newErrors.totalDeductions = 'Total deductions cannot exceed basic salary';
    }

    return newErrors;
  };

  // Helper function to get month number
  const getMonthNumber = (monthName) => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months.indexOf(monthName);
  };

  // Clear specific field error
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Clear error when user starts typing
    clearFieldError(name);
    
    if (type === 'number') {
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
      if (value !== '' && Number(value) < 0) return;
    }
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setSalary({ ...salary, [group]: { ...salary[group], [field]: value } });
      
      // Clear nested field errors
      clearFieldError(`${group}.${field}`);
    } else {
      setSalary({ ...salary, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      
      // Show validation error with SweetAlert2
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill all required fields correctly',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        customClass: {
          popup: 'rounded-2xl',
          title: 'font-bold text-xl',
          content: 'text-base'
        },
        showCloseButton: true
      });
      
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                          document.querySelector(`[name="${firstErrorField.replace('.', '\\.')}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5000/api/salaries/${editingId}`
        : 'http://localhost:5000/api/salaries';
      const salaryToSend = {
        ...salary,
        year: Number(salary.year),
        basicSalary: Number(salary.basicSalary),
        allowances: {
          transport: Number(salary.allowances.transport || 0),
          meal: Number(salary.allowances.meal || 0),
          medical: Number(salary.allowances.medical || 0),
          other: Number(salary.allowances.other || 0)
        },
        overtime: {
          normalDayHours: Number(salary.overtime.normalDayHours || 0),
          holidayHours: Number(salary.overtime.holidayHours || 0)
        },
        deductions: {
          loan: Number(salary.deductions.loan || 0),
          insurance: Number(salary.deductions.insurance || 0),
          other: Number(salary.deductions.other || 0)
        }
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryToSend)
      });
      
      if (res.ok) {
        // Success SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: editingId ? 'Salary record updated successfully!' : 'Salary record created successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10b981',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-2xl',
            title: 'font-bold text-xl',
            content: 'text-base'
          },
          showCloseButton: true,
          allowOutsideClick: false
        });
        
        setSalary(initialSalary);
        setEditingId(null);
        setErrors({});
        setTimeout(() => navigate('/salary-table'), 2000);
      } else {
        const errorData = await res.json();
        
        // Error SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: `Error: ${errorData.message || 'Failed to save salary record'}`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-2xl',
            title: 'font-bold text-xl',
            content: 'text-base'
          },
          showCloseButton: true,
          footer: 'Please try again or contact administrator'
        });
      }
    } catch (error) {
      console.error('Error submitting salary:', error);
      
      // Network Error SweetAlert2
      Swal.fire({
        title: 'Network Error',
        text: 'Network error. Please check your connection and try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-2xl',
          title: 'font-bold text-xl',
          content: 'text-base'
        },
        showCloseButton: true,
        footer: 'Check your internet connection'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoEmployeeIds = Array.from({ length: 10 }, (_, i) => `EMP${(i + 1).toString().padStart(4, '0')}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Salary Calculation Form
          </h2>
          <p className="text-gray-600 text-lg">Create and manage employee salary records with ease</p>
        </div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Progress indicator */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-3xl"></div>
          
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-3 text-sm font-bold text-gray-700">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="employeeId"
                      value={salary.employeeId}
                      onChange={e => {
                        setSalary({ ...salary, employeeId: e.target.value });
                        clearFieldError('employeeId');
                      }}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                        errors.employeeId 
                          ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                      }`}
                    >
                      <option value="" disabled>Select Employee ID</option>
                      {demoEmployeeIds.map(id => <option key={id} value={id}>{id}</option>)}
                    </select>
                    {errors.employeeId && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.employeeId}
                    </p>}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-bold text-gray-700">
                      Month <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="month"
                      value={salary.month}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                        errors.month 
                          ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                      }`}
                    >
                      <option value="">Select Month</option>
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, index) => (
                        <option 
                          key={m} 
                          value={m}
                          disabled={salary.year == currentYear && index < currentMonth}
                        >
                          {m}
                        </option>
                      ))}
                    </select>
                    {errors.month && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.month}
                    </p>}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-bold text-gray-700">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="year"
                      value={salary.year}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                        errors.year 
                          ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                      }`}
                    >
                      <option value="">Select Year</option>
                      <option value={currentYear}>{currentYear}</option>
                    </select>
                    {errors.year && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.year}
                    </p>}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-bold text-gray-700">
                      Basic Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">Rs</span>
                      <input
                        name="basicSalary"
                        value={salary.basicSalary}
                        onChange={handleChange}
                        onKeyDown={e => {
                          if (["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","."].includes(e.key)) return;
                          if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                        }}
                        placeholder="00000.00"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                          errors.basicSalary 
                            ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                        }`}
                      />
                    </div>
                    {errors.basicSalary && <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.basicSalary}
                    </p>}
                    <p className="text-gray-500 text-xs mt-2">Range: Rs 50,000 - Rs 500,000,000</p>
                  </div>
                </div>
              </motion.div>

              {/* General validation errors */}
              {errors.totalDeductions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-red-600 font-semibold">Validation Error</p>
                      <p className="text-red-600 text-sm">{errors.totalDeductions}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Allowances and Overtime */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Allowances */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    Allowances
                  </h3>
                  
                  {['transport', 'meal', 'medical', 'other'].map(field => (
                    <div key={field} className="mb-4">
                      <label className="block mb-2 text-sm font-semibold text-gray-700 capitalize">
                        {field} Allowance
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">Rs</span>
                        <input
                          name={`allowances.${field}`}
                          value={salary.allowances[field]}
                          onChange={handleChange}
                          onKeyDown={e => {
                            if (["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","."].includes(e.key)) return;
                            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                          placeholder="00000.00"
                          type="number"
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                            errors[`allowances.${field}`] 
                              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20'
                          }`}
                        />
                      </div>
                      {errors[`allowances.${field}`] && 
                        <p className="text-red-500 text-xs mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors[`allowances.${field}`]}
                        </p>
                      }
                    </div>
                  ))}
                </motion.div>

                {/* Overtime */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Overtime Hours
                  </h3>
                  
                  {['normalDayHours', 'holidayHours'].map(field => (
                    <div key={field} className="mb-4">
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        {field === 'normalDayHours' ? 'Normal Day Hours' : 'Holiday Hours'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">hrs</span>
                        <input
                          name={`overtime.${field}`}
                          value={salary.overtime[field]}
                          onChange={handleChange}
                          onKeyDown={e => {
                            if (["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","."].includes(e.key)) return;
                            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                          placeholder="0.00"
                          type="number"
                          min="0"
                          step="0.1"
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                            errors[`overtime.${field}`] 
                              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20'
                          }`}
                        />
                      </div>
                      {errors[`overtime.${field}`] && 
                        <p className="text-red-500 text-xs mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors[`overtime.${field}`]}
                        </p>
                      }
                    </div>
                  ))}
                  <p className="text-gray-500 text-xs">Max normal: 500hrs/month | Max holiday: 200hrs/month</p>
                </motion.div>
              </div>

              {/* Deductions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  Deductions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['loan', 'insurance', 'other'].map(field => (
                    <div key={field}>
                      <label className="block mb-2 text-sm font-semibold text-gray-700 capitalize">
                        {field} Deduction
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">Rs</span>
                        <input
                          name={`deductions.${field}`}
                          value={salary.deductions[field]}
                          onChange={handleChange}
                          onKeyDown={e => {
                            if (["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","."].includes(e.key)) return;
                            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                          }}
                          placeholder="00000.00"
                          type="number"
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md ${
                            errors[`deductions.${field}`] 
                              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                          }`}
                        />
                      </div>
                      {errors[`deductions.${field}`] && 
                        <p className="text-red-500 text-xs mt-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors[`deductions.${field}`]}
                        </p>
                      }
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-4">Individual and total deductions cannot exceed basic salary</p>
              </motion.div>

              {/* Submit Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center pt-8"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingId ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingId ? 'Update Salary' : 'Create Salary'}
                      </>
                    )}
                  </span>
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      // Confirmation dialog with SweetAlert2
                      Swal.fire({
                        title: 'Cancel Editing?',
                        text: 'Are you sure you want to cancel? All unsaved changes will be lost.',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, Cancel',
                        cancelButtonText: 'Continue Editing',
                        confirmButtonColor: '#6b7280',
                        cancelButtonColor: '#3b82f6',
                        customClass: {
                          popup: 'rounded-2xl',
                          title: 'font-bold text-xl',
                          content: 'text-base'
                        },
                        reverseButtons: true
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setSalary(initialSalary); 
                          setEditingId(null); 
                          setErrors({});
                          
                          // Show cancellation confirmation
                          Swal.fire({
                            title: 'Cancelled',
                            text: 'Changes have been discarded',
                            icon: 'info',
                            timer: 1500,
                            showConfirmButton: false,
                            customClass: {
                              popup: 'rounded-2xl'
                            }
                          });
                        }
                      });
                    }}
                    disabled={isSubmitting}
                    className="group relative px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </span>
                  </button>
                )}
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SalaryForm;