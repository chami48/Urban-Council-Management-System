// LeaveList.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const Leavestatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/leaves/");
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      setUpdateLoading((prev) => ({ ...prev, [leaveId]: true }));
      const res = await axios.patch(
        `http://localhost:5000/api/leaves/${leaveId}`,
        { status: newStatus }
      );
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId ? { ...leave, status: res.data.status } : leave
        )
      );
      setOpenDropdown(null);
    } catch (err) {
      console.error("Status update error:", err);
      fetchLeaves();
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [leaveId]: false }));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full bg-gray-200 text-black p-4 rounded-md shadow-md mb-6">
        <h2 className="text-center text-2xl font-bold tracking-wide">
          All Leave Requests
        </h2>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 mt-4">
          Loading leave requests...
        </div>
      ) : leaves.length === 0 ? (
        <p className="text-gray-500">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <AnimatePresence>
                {leaves.map((leave, idx) => (
                  <motion.tr
                    key={leave._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-gray-50 transition"
                        : "bg-gray-50 hover:bg-gray-100 transition"
                    }
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {leave.employeeId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {leave.leaveType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 text-sm relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === leave._id ? null : leave._id
                          )
                        }
                        className={`w-full px-4 py-2 font-medium text-sm border rounded-md shadow ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800 border-green-400"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-800 border-red-400"
                            : "bg-yellow-100 text-yellow-800 border-yellow-400"
                        }`}
                        disabled={updateLoading[leave._id]}
                      >
                        {leave.status}
                      </button>
                      {openDropdown === leave._id && (
                        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-md z-50 p-2 flex flex-col gap-2">
                          {["Pending", "Approved", "Rejected"].map(
                            (statusOption) => (
                              <button
                                key={statusOption}
                                onClick={() =>
                                  handleStatusChange(leave._id, statusOption)
                                }
                                className={`w-full px-3 py-2 font-medium text-sm border rounded-md transition ${
                                  statusOption === "Approved"
                                    ? "bg-green-100 text-green-800 border-green-400"
                                    : statusOption === "Rejected"
                                    ? "bg-red-100 text-red-800 border-red-400"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-400"
                                } hover:shadow-inner hover:ring-1 hover:ring-blue-500`}
                                disabled={updateLoading[leave._id]}
                              >
                                {statusOption}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leavestatus;
