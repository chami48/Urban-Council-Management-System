// src/Components/Shop/OfficerDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../Navigation/Navigation";
import Swal from "sweetalert2";

const OfficerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const allResponse = await axios.get(
        "http://localhost:5000/api/shop-applications"
      );
      setApplications(allResponse.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Application?",
      text: "Are you sure you want to approve this application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    setProcessingId(id);
    try {
      await axios.post(
        `http://localhost:5000/api/shop-applications/approve/${id}`
      );
      await fetchApplications();
      Swal.fire({
        icon: "success",
        title: "Application approved successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error approving application:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error approving application. Please try again.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Application",
      input: "text",
      inputLabel: "Please provide a reason for rejection:",
      inputPlaceholder: "Enter rejection reason",
      showCancelButton: true,
    });
    if (!reason) return;

    setProcessingId(id);
    try {
      await axios.post(
        `http://localhost:5000/api/shop-applications/reject/${id}`,
        { rejectionReason: reason }
      );
      await fetchApplications();
      Swal.fire({
        icon: "success",
        title: "Application rejected successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error rejecting application. Please try again.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const showApplicationDetails = (app) => {
    Swal.fire({
      title: app.shopName,
      html: `
        <p><strong>Owner:</strong> ${app.applicantName}</p>
        <p><strong>NIC:</strong> ${app.nicNumber}</p>
        <p><strong>Category:</strong> ${app.businessCategory}</p>
        <p><strong>Status:</strong> ${app.status}</p>
      `,
      icon: "info",
    });
  };

  const renderApplicationTable = (apps) => {
    if (!apps || apps.length === 0) {
      return (
        <div className="p-8 text-center bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            No applications found
          </h3>
          <p className="text-gray-500">
            There are currently no {activeTab} applications.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-3">Shop No</th>
              <th className="px-6 py-3">Shop Name</th>
              <th className="px-6 py-3">Owner</th>
              <th className="px-6 py-3">NIC</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Business Category</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Submitted Date</th>
              {activeTab === "pending" && (
                <th className="px-6 py-3">Actions</th>
              )}
              <th className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{app.shopNo}</td>
                <td className="px-6 py-4 font-semibold">{app.shopName}</td>
                <td className="px-6 py-4">{app.applicantName}</td>
                <td className="px-6 py-4">{app.nicNumber}</td>
                <td className="px-6 py-4">
                  <div>{app.phone}</div>
                  <small className="text-gray-500">{app.email}</small>
                </td>
                <td className="px-6 py-4">{app.businessCategory}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(app.createdAt).toLocaleDateString("en-GB")}
                </td>

                {activeTab === "pending" && (
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleApprove(app._id)}
                      disabled={processingId === app._id}
                      className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow transition disabled:opacity-50"
                    >
                      {processingId === app._id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(app._id)}
                      disabled={processingId === app._id}
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition disabled:opacity-50"
                    >
                      {processingId === app._id ? "..." : "Reject"}
                    </button>
                  </td>
                )}

                <td className="px-6 py-4">
                  <button
                    onClick={() => showApplicationDetails(app)}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Navigation
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-indigo-600 font-medium">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  // Filter apps based on tab
  const displayedApps =
    activeTab === "pending"
      ? applications.filter((a) => a.status === "pending")
      : applications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        } p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "pending"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border"
              }`}
            >
              Pending Applications
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 border"
              }`}
            >
              All Applications
            </button>
          </div>
        </div>

        {renderApplicationTable(displayedApps)}
      </main>
    </div>
  );
};

export default OfficerDashboard;
