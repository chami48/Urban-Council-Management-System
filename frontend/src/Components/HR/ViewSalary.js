import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Header component
const Header = () => (
  <header className="bg-blue-800 text-white p-4 shadow-md">
    <div className="max-w-7xl mx-auto text-center font-bold text-xl">
      Company Payroll Management
    </div>
  </header>
);

// Footer component
const Footer = () => (
  <footer className="bg-blue-800 text-white p-4 mt-10 shadow-inner">
    <div className="max-w-7xl mx-auto text-center text-sm">
      &copy; {new Date().getFullYear()} Company Name. All rights reserved.
    </div>
  </footer>
);

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/salaries/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Salary not found');
        return res.json();
      })
      .then(data => {
        setSalary(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salary) return <div className="p-8 text-center text-white">No data found.</div>;

  return (
    <>
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto p-6 bg-gray-500 rounded-xl shadow-xl mt-10 text-black"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Salary Details
        </h2>

        <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Employee ID</td>
              <td className="px-6 py-3">{salary.employeeId}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Month</td>
              <td className="px-6 py-3">{salary.month}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Year</td>
              <td className="px-6 py-3">{salary.year}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Basic Salary</td>
              <td className="px-6 py-3">{salary.basicSalary}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-6 py-3 font-semibold">Net Salary</td>
              <td className="px-6 py-3">{Number(salary.netSalary).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Allowances */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Allowances</h3>
          <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <tbody>
              {salary.allowances && Object.entries(salary.allowances).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-6 py-3 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overtime */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Overtime</h3>
          <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <tbody>
              {salary.overtime && Object.entries(salary.overtime).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-6 py-3 font-semibold">{key === 'normalDayHours' ? 'Normal Day Hours' : 'Holiday Hours'}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Deductions</h3>
          <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <tbody>
              {salary.deductions && Object.entries(salary.deductions).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-700">
                  <td className="px-6 py-3 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-700 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold text-white shadow-lg transition transform hover:-translate-y-1 duration-300"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default ViewSalary;
