import React, { useEffect, useState } from 'react';
import Navigation from '../Navigation/Navigation';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Search, Filter,  Trash2, FileText,
  Mail, Phone, MapPin, User, Calendar, AlertCircle,
  CheckCircle, XCircle, Eye, EyeOff, Send, X,
  Download, Paperclip, RefreshCw, Edit, Clock,
  Megaphone, Plus, List
} from "lucide-react";

// ✅ Government letterhead configuration (moved above all other code blocks)
const GOVERNMENT_CONFIG = {
  emblemPath: "/emblem.png",           // Sri Lankan Government Emblem (using PNG)
  logoPath: "/horanalogo.png",         // Horana Urban Council Logo
  signaturePath: "/signature.png",     // Digital signature image
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  localName: "Horana Nagara Sabhaawa", // Sinhala transliteration
  address: "123, Mathugama Horana",
  email: "horanaurbancouncil123@gmail.com",
  fax: "1235565"
};

const URL = "http://localhost:5000/complaints";
const ANNOUNCEMENT_URL = "http://localhost:5000/announcements";

// API Functions
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.status, error.response?.data);
    throw error;
  }
};

const fetchAnnouncements = async () => {
  try {
    const res = await axios.get(ANNOUNCEMENT_URL);
    return res.data?.announcements || [];
  } catch (err) {
    console.error("Fetch announcements error:", err);
    return [];
  }
};

// Loading Component
const LoadingSpinner = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-sm text-gray-500">Please wait while we fetch the latest data...</p>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ complaint }) => {
  if (complaint.status === 'resolved') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
        <CheckCircle size={12} />
        Resolved
      </div>
    );
  }
  if (complaint.status === 'rejected') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full border border-red-200">
        <XCircle size={12} />
        Rejected
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-full border border-amber-200">
      <AlertCircle size={12} />
      Pending
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, label, children, className = "" }) => (
  <div className={`p-4 bg-gray-50 rounded-xl border border-gray-200 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{children || "Not specified"}</p>
      </div>
    </div>
  </div>
);

// Email Modal Component
const EmailModal = ({ isOpen, onClose, email, onSend }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      await onSend(email, subject, message);
      setSubject("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail size={20} className="text-blue-600" />
            Send Email
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send to: {email}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
              rows={5}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!subject.trim() || !message.trim() || sending}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {sending ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Complaint Card Component
const ComplaintCard = ({ complaint, onReject, onDelete, onSendEmail, isExpanded, onToggleExpand }) => {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleReject = async () => {
    try {
      await onReject(complaint._id);
      setShowRejectConfirm(false);
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(complaint._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{complaint.NatureofComplaint}</h3>
              <StatusBadge complaint={complaint} />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Submitted on {new Date(complaint.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoCard icon={<User size={16} />} label="Name">
            {complaint.Name}
          </InfoCard>
          <InfoCard icon={<Phone size={16} />} label="Phone">
            {complaint.Phone_Number}
          </InfoCard>
          <InfoCard icon={<Mail size={16} />} label="Email">
            {complaint.Email}
          </InfoCard>
          <InfoCard icon={<MapPin size={16} />} label="Location">
            {complaint.Location}
          </InfoCard>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoCard icon={<FileText size={16} />} label="NIC Number">
                    {complaint.NIC_Number}
                  </InfoCard>
                  <InfoCard icon={<MapPin size={16} />} label="Address">
                    {complaint.Address}
                  </InfoCard>
                  <InfoCard icon={<MapPin size={16} />} label="GN Division" className="md:col-span-2">
                    {complaint.Grama_Niladhari_Division}
                  </InfoCard>
                </div>

                {complaint.Description && (
                  <div className="mb-6">
                    <InfoCard icon={<FileText size={16} />} label="Description" className="md:col-span-2">
                      {complaint.Description}
                    </InfoCard>
                  </div>
                )}

                {complaint.Attach_Files && complaint.Attach_Files.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Paperclip className="w-5 h-5 text-blue-600" />
                      Attachments
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {complaint.Attach_Files.map((file, index) => (
                        <a
                          key={index}
                          href={`http://localhost:5000/uploads/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Download size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">File {index + 1}</p>
                            <p className="text-sm text-gray-500">Click to download</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleExpand(complaint._id)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
            {isExpanded ? "Hide Details" : "View Details"}
          </button>

          <div className="flex gap-2 flex-wrap">
            {/* Send Email Button */}
           

            {/* Reject Button */}
            {!showRejectConfirm ? (
              <button
                onClick={() => setShowRejectConfirm(true)}
                disabled={complaint.status === 'rejected'}
                className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <XCircle size={16} />
                {complaint.status === 'rejected' ? 'Rejected' : 'Reject'}
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={handleReject}
                  className="px-2 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowRejectConfirm(false)}
                  className="px-2 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Delete Button */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={handleDelete}
                  className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Complaints Tab Component
const ComplaintsTab = ({ complaints, loading, error, onReject, onDelete, onSendEmail, onGenerateReport }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedComplaints, setExpandedComplaints] = useState({});

  const toggleExpanded = (id) => {
    setExpandedComplaints(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredComplaints = complaints.filter(complaint => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      complaint.NatureofComplaint?.toLowerCase().includes(term) ||
      complaint.Name?.toLowerCase().includes(term) ||
      complaint.Location?.toLowerCase().includes(term);

    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "pending" && (!complaint.status || complaint.status === "pending")) ||
      (filterStatus === "resolved" && complaint.status === "resolved") ||
      (filterStatus === "rejected" && complaint.status === "rejected");

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Loading complaints" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaints Management</h2>
          <p className="text-gray-600">Review and manage citizen complaints and feedback</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <button
            onClick={onGenerateReport}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Generate Report PDF
          </button>

          <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredComplaints.length}</p>
              <p className="text-sm text-gray-500">Shown</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{complaints.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search complaints by nature, name, or location..."
                className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                className="pl-10 pr-8 py-3 text-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <AnimatePresence mode="wait">
        {filteredComplaints.length > 0 ? (
          <motion.div
            key="complaints-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {filteredComplaints.map(complaint => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onReject={onReject}
                onDelete={onDelete}
                onSendEmail={onSendEmail}
                isExpanded={!!expandedComplaints[complaint._id]}
                onToggleExpand={toggleExpanded}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-complaints"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center bg-white rounded-2xl border border-gray-200 p-16 shadow-sm"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search criteria or filters to find relevant complaints."
                : "No complaints are currently available for review."}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Announcements Tab Component
const AnnouncementsTab = ({ announcements, loading, error, onSubmit, onEdit, onDelete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [announceError, setAnnounceError] = useState(null);
  const [announceSuccess, setAnnounceSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date.trim() || !time.trim() || !area.trim()) {
      setAnnounceError("Please fill all fields (Title, Description, Date, Time, and Area).");
      return;
    }

    setSubmitting(true);
    setAnnounceError(null);
    setAnnounceSuccess(null);

    try {
      await onSubmit({ title, description, date, time, area }, editingId);
      
      if (editingId) {
        setAnnounceSuccess("Announcement updated successfully!");
        setEditingId(null);
      } else {
        setAnnounceSuccess("Announcement created successfully!");
      }
      
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setArea("");
    } catch (err) {
      setAnnounceError("Failed to submit announcement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setTitle(announcement.title || "");
    setDescription(announcement.description || "");
    setDate(announcement.date || "");
    setTime(announcement.time || "");
    setArea(announcement.area || "");
    setAnnounceSuccess(null);
    setAnnounceError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setArea("");
    setAnnounceSuccess(null);
    setAnnounceError(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading announcements" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Announcements Management</h2>
        <p className="text-gray-600">Create and manage public announcements for citizens</p>
      </div>

      {/* Create/Edit Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          {editingId ? <Edit className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
          {editingId ? "Edit Announcement" : "Create New Announcement"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
              rows={4}
            />
          </div>
<div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Description <span className="text-red-500">*</span>
    </label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter detailed description about the announcement"
      className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
      rows={4}
    />
  </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter relevant area"
                className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>

          {announceError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {announceError}
              </p>
            </div>
          )}

          {announceSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                {announceSuccess}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors"
            >
              {submitting ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : editingId ? (
                <Edit size={20} />
              ) : (
                <Plus size={20} />
              )}
              {submitting ? "Processing..." : (editingId ? "Update Announcement" : "Create Announcement")}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <List className="w-6 h-6 text-blue-600" />
          Published Announcements
        </h3>

        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Megaphone size={32} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h4>
            <p className="text-gray-500">Create your first announcement to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements
              .slice()
              .reverse()
              .map((announcement) => (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 break-words">
                        {announcement.title}
                      </h4>
                      <p className="text-gray-700 mb-4 break-words">
                        {announcement.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {announcement.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {announcement.date}
                          </span>
                        )}
                        {announcement.time && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {announcement.time}
                          </span>
                        )}
                        {announcement.area && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {announcement.area}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(announcement._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
function ComplaintsAndAnnouncements() {
  const [activeTab, setActiveTab] = useState("complaints");
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [emailModal, setEmailModal] = useState({ isOpen: false, email: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [complaintsData, announcementsData] = await Promise.all([
          fetchHandler(),
          fetchAnnouncements()
        ]);
        setComplaints(complaintsData?.complaints || []);
        setAnnouncements(announcementsData);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please check if the server is running.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteComplaint = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setComplaints(prev => prev.filter(complaint => complaint._id !== id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
      throw err;
    }
  };

  const handleRejectComplaint = async (id) => {
    try {
      // Status එක "rejected" කරනවා
      await axios.put(`${URL}/${id}`, { status: 'rejected' });
      setComplaints(prev => 
        prev.map(complaint => 
          complaint._id === id 
            ? { ...complaint, status: 'rejected' }
            : complaint
        )
      );
    } catch (err) {
      console.error("Error updating complaint status:", err);
      throw err;
    }
  };

  const handleSendEmail = async (email, subject, message) => {
    try {
      await axios.post("http://localhost:5000/complaints/send-email", {
        to: email,
        subject: subject,
        text: message
      });
    } catch (err) {
      console.error("Error sending email:", err);
      throw err;
    }
  };

  const openEmailModal = (email) => {
    setEmailModal({ isOpen: true, email });
  };

  const closeEmailModal = () => {
    setEmailModal({ isOpen: false, email: "" });
  };



const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
};


  const generateComplaintsReport = async () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // HEADER SECTION
  const addGovernmentHeader = async () => {
    try {
      const emblemBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.emblemPath);
      const logoBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.logoPath);
      doc.addImage(emblemBase64, "PNG", margin, 40, 50, 50);
      doc.addImage(logoBase64, "PNG", pageWidth - margin - 50, 40, 50, 50);
    } catch {
      // placeholders if missing
      doc.rect(margin, 40, 50, 50);
      doc.rect(pageWidth - margin - 50, 40, 50, 50);
    }

    const centerX = pageWidth / 2;
    doc.setTextColor(128, 0, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(GOVERNMENT_CONFIG.country, centerX, 35, { align: "center" });
    doc.setFontSize(16);
    doc.text(GOVERNMENT_CONFIG.council, centerX, 57, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(GOVERNMENT_CONFIG.localName, centerX, 77, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${GOVERNMENT_CONFIG.address} | Email: ${GOVERNMENT_CONFIG.email} | Fax: ${GOVERNMENT_CONFIG.fax}`,
      centerX,
      98,
      { align: "center" }
    );

    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageWidth - margin, 145);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("COMPLAINTS MANAGEMENT REPORT", centerX, 120, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      centerX,
      135,
      { align: "center" }
    );
  };

  await addGovernmentHeader();

  // TABLE CONTENT
  const total = complaints.length || 1;
  const pending = complaints.filter(c => !c.status || c.status === "pending").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const rejected = complaints.filter(c => c.status === "rejected").length;

  autoTable(doc, {
    startY: 165,
    head: [["Status", "Count", "Percentage"]],
    body: [
      ["Pending", pending, `${((pending / total) * 100).toFixed(1)}%`],
      ["Resolved", resolved, `${((resolved / total) * 100).toFixed(1)}%`],
      ["Rejected", rejected, `${((rejected / total) * 100).toFixed(1)}%`],
    ],
    headStyles: { fillColor: [128, 0, 32], textColor: 255 },
    bodyStyles: { textColor: 20 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: margin, right: margin },
  });

  const yPosition = doc.lastAutoTable.finalY + 30;
  autoTable(doc, {
    startY: yPosition,
    head: [["Name", "Nature of Complaint", "Email", "Location", "Status", "Date"]],
    body: complaints.map(c => [
      c.Name || "N/A",
      c.NatureofComplaint || "N/A",
      c.Email || "N/A",
      c.Location || "N/A",
      c.status || "Pending",
      new Date(c.createdAt || Date.now()).toLocaleDateString(),
    ]),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [128, 0, 32], textColor: 255 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: margin, right: margin },
  });

  // FOOTER
  const addFooter = async () => {
    const footerY = pageHeight - 90;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      margin,
      footerY + 15
    );
    try {
      const sigBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.signaturePath);
      doc.addImage(sigBase64, "PNG", pageWidth - margin - 120, footerY - 5, 100, 30);
    } catch {
      doc.line(pageWidth - margin - 120, footerY + 10, pageWidth - margin, footerY + 10);
    }
    doc.text("Administrative Officer", pageWidth - margin - 120, footerY + 45);
    doc.text("Horana Urban Council", pageWidth - margin - 120, footerY + 58);
    doc.setDrawColor(128, 0, 32);
    doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
  };

  await addFooter();

  doc.save(`Complaints_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

  const handleAnnouncementSubmit = async (announcementData, editingId) => {
    if (editingId) {
      // Update existing announcement
      await axios.put(`${ANNOUNCEMENT_URL}/${editingId}`, announcementData);
      setAnnouncements(prev =>
        prev.map(a => (a._id === editingId ? { ...a, ...announcementData } : a))
      );
    } else {
      // Create new announcement
      const res = await axios.post(ANNOUNCEMENT_URL, announcementData);
      const newAnn = res.data?.announcement || { _id: Math.random().toString(), ...announcementData };
      setAnnouncements(prev => [...prev, newAnn]);
    }
  };

  const handleAnnouncementDelete = async (id) => {
    try {
      await axios.delete(`${ANNOUNCEMENT_URL}/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error("Announcement delete error:", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Dashboard</h1>
            <p className="text-lg text-gray-600">Manage complaints and announcements in one place</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm inline-flex">
              <button
                onClick={() => setActiveTab("complaints")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "complaints"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <FileText size={20} />
                Complaints
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "announcements"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Megaphone size={20} />
                Announcements
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "complaints" ? (
              <motion.div
                key="complaints-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ComplaintsTab
                  complaints={complaints}
                  loading={loading}
                  error={error}
                  onReject={handleRejectComplaint}
                  onDelete={handleDeleteComplaint}
                  onSendEmail={openEmailModal}
                  onGenerateReport={generateComplaintsReport}
                />
              </motion.div>
            ) : (
              <motion.div
                key="announcements-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AnnouncementsTab
                  announcements={announcements}
                  loading={loading}
                  error={error}
                  onSubmit={handleAnnouncementSubmit}
                  onEdit={() => {}} // Handled within the component
                  onDelete={handleAnnouncementDelete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Email Modal */}
      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={closeEmailModal}
        email={emailModal.email}
        onSend={handleSendEmail}
      />
    </div>
  );
}

export default ComplaintsAndAnnouncements; 