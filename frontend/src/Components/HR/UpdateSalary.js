import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/salaries/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          employeeId: data.employeeId,
          month: data.month,
          year: data.year,
          basicSalary: data.basicSalary,
          allowances: { ...data.allowances },
          overtime: { ...data.overtime },
          deductions: { ...data.deductions }
        });
      });
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
      if (value !== '' && Number(value) < 0) return;
    }
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setForm({
        ...form,
        [group]: {
          ...form[group],
          [field]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      year: Number(form.year),
      basicSalary: Number(form.basicSalary),
      allowances: {
        transport: Number(form.allowances.transport),
        meal: Number(form.allowances.meal),
        medical: Number(form.allowances.medical),
        other: Number(form.allowances.other)
      },
      overtime: {
        normalDayHours: Number(form.overtime.normalDayHours),
        holidayHours: Number(form.overtime.holidayHours)
      },
      deductions: {
        loan: Number(form.deductions.loan),
        insurance: Number(form.deductions.insurance),
        other: Number(form.deductions.other)
      }
    };
    await fetch(`http://localhost:5000/api/salaries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    navigate('/salary-table');
  };

  if (!form) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-xl text-gray-700 font-medium">Loading salary details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Update Salary Record
          </h1>
          <p className="text-gray-600">Modify employee salary details with precision</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
          {/* Card Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Basic Information Section */}
            <div className="relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                    Employee ID
                  </label>
                  <input
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-gray-300"
                  />
                </div>
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                    Month
                  </label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-gray-300 bg-white"
                  >
                    <option value="">Select Month</option>
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                    Year
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-gray-300 bg-white"
                  >
                    <option value="">Select Year</option>
                    {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="group">
                  <label className="block mb-2 text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                    Basic Salary
                  </label>
                  <input
                    name="basicSalary"
                    value={form.basicSalary}
                    onChange={handleFormChange}
                    onKeyDown={e => {
                      if (["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","."].includes(e.key)) return;
                      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
                    }}
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Allowances and Overtime Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Allowances */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  Allowances
                </h4>
                <div className="space-y-3">
                  <input name="allowances.transport" value={form.allowances.transport} onChange={handleFormChange} placeholder="Transport Allowance" type="number" min="0" className="w-full px-4 py-3 border border-green-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all bg-white/70" />
                  <input name="allowances.meal" value={form.allowances.meal} onChange={handleFormChange} placeholder="Meal Allowance" type="number" min="0" className="w-full px-4 py-3 border border-green-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all bg-white/70" />
                  <input name="allowances.medical" value={form.allowances.medical} onChange={handleFormChange} placeholder="Medical Allowance" type="number" min="0" className="w-full px-4 py-3 border border-green-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all bg-white/70" />
                  <input name="allowances.other" value={form.allowances.other} onChange={handleFormChange} placeholder="Other Allowances" type="number" min="0" className="w-full px-4 py-3 border border-green-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all bg-white/70" />
                </div>
              </div>

              {/* Overtime */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  Overtime Hours
                </h4>
                <div className="space-y-3">
                  <input name="overtime.normalDayHours" value={form.overtime.normalDayHours} onChange={handleFormChange} placeholder="Normal Day Hours" type="number" min="0" className="w-full px-4 py-3 border border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white/70" />
                  <input name="overtime.holidayHours" value={form.overtime.holidayHours} onChange={handleFormChange} placeholder="Holiday Hours" type="number" min="0" className="w-full px-4 py-3 border border-blue-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white/70" />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                  </svg>
                </div>
                Deductions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="deductions.loan" value={form.deductions.loan} onChange={handleFormChange} placeholder="Loan Deduction" type="number" min="0" className="w-full px-4 py-3 border border-red-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-white/70" />
                <input name="deductions.insurance" value={form.deductions.insurance} onChange={handleFormChange} placeholder="Insurance" type="number" min="0" className="w-full px-4 py-3 border border-red-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-white/70" />
                <input name="deductions.other" value={form.deductions.other} onChange={handleFormChange} placeholder="Other Deductions" type="number" min="0" className="w-full px-4 py-3 border border-red-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-white/70" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Update Salary
                </span>
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/salary-table')} 
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 shadow-lg hover:shadow-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSalary;