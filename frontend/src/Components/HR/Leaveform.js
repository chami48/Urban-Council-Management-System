import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

const Leaveform = () => {
  const [leave, setLeave] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave({
      ...leave,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend validation for reason length
    if (leave.reason.trim().length < 10) {
      alert("Reason must be at least 10 characters long");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/leaves/create", leave);
      alert("Successfully submitted!");
      setLeave({
        employeeId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      navigate("/leavestatus"); // redirect to leave status page
    } catch (err) {
      alert("Submission failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <Navigation />
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          <div className="w-full bg-blue-600 text-white p-3 rounded-md mb-6">
            <h2 className="text-center text-2xl font-bold">
              Employee Leave Application
            </h2>
            <h6 className="text-center text-sm">
              Submit your leave request for approval
            </h6>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-black">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="employeeId"
                value={leave.employeeId}
                onChange={handleChange}
                placeholder="Enter the employee ID"
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-black">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                name="leaveType"
                value={leave.leaveType}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Leave Type</option>
                <option value="Annual">Annual</option>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Personal">Personal</option>
                <option value="Maternity">Maternity</option>
                <option value="Paternity">Paternity</option>
                <option value="Emergency">Emergency</option>
                <option value="Vacation">Vacation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={leave.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={leave.endDate}
                  onChange={handleChange}
                  min={leave.startDate || new Date().toISOString().split("T")[0]}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-black">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={leave.reason}
                onChange={handleChange}
                placeholder="Please provide the reason for leave"
                rows={4}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-black">
                {leave.reason.length}/500 characters
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-4 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Leaveform;
