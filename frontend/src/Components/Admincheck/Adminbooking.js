import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from '../Navigation/Navigation';

import {
  Calendar, Clock, Users, MapPin, Mail, Phone,
  AlertCircle, CheckCircle, XCircle, ChevronDown,
  User, FileText, Flame, Activity, Download, Building, Home, Hash,
  List, ChevronLeft, ChevronRight, Filter
} from "lucide-react";

// API endpoints
const PLAYGROUND_URL = "http://localhost:5000/users";
const CREMATORIUM_URL = "http://localhost:5000/crematorium";

// Custom Components
const StatusBadge = ({ booking }) => {
  if (booking.approve) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1 rounded-full">
        <CheckCircle size={14} />
        <span>Approved</span>
      </div>
    );
  }
  if (booking.reject) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 px-3 py-1 rounded-full">
        <XCircle size={14} />
        <span>Rejected</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 rounded-full">
      <AlertCircle size={14} />
      <span>Pending</span>
    </div>
  );
};

const InfoItem = ({ icon, label, children }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
    <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="truncate">{children || "N/A"}</span>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
      <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-blue-400 border-l-blue-400 animate-spin-reverse"></div>
    </div>
    <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading requests...</p>
  </div>
);

const CalendarEvent = ({ booking, type, onClick }) => {
  const getStatusColor = () => {
    if (booking.approve) return 'bg-emerald-500 border-emerald-600';
    if (booking.reject) return 'bg-red-500 border-red-600';
    return 'bg-amber-500 border-amber-600';
  };

  const title = type === 'playground' 
    ? booking.eventName || 'Playground Event'
    : `Cremation - ${booking.deceasedFullName}`;

  const time = type === 'playground'
    ? `${booking.startTime} - ${booking.endTime}`
    : new Date(booking.cremationDate).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(booking)}
      className={`p-2 mb-1 rounded text-white text-xs cursor-pointer border-l-4 ${getStatusColor()} hover:shadow-md transition-all`}
    >
      <div className="font-medium truncate">{title}</div>
      <div className="opacity-90">{time}</div>
      {type === 'playground' && booking.organizerName && (
        <div className="opacity-75 truncate">{booking.organizerName}</div>
      )}
    </motion.div>
  );
};

const TimeSlotCalendar = ({ bookings, activeTab, onEventClick, selectedDate }) => {
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const getBookingsForTimeSlot = (timeSlot) => {
    if (!selectedDate) return [];
    
    return bookings.filter(booking => {
      const bookingDate = activeTab === 'playground' 
        ? new Date(booking.eventDate)
        : new Date(booking.cremationDate);
      
      if (bookingDate.toDateString() !== selectedDate.toDateString()) {
        return false;
      }

      if (activeTab === 'playground') {
        const startTime = booking.startTime;
        const startHour = startTime ? startTime.split(':')[0].padStart(2, '0') + ':00' : null;
        return startHour === timeSlot;
      } else {
        const cremationHour = bookingDate.getHours().toString().padStart(2, '0') + ':00';
        return cremationHour === timeSlot;
      }
    });
  };

  const formatTimeSlot = (timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:00 ${period}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Schedule for {selectedDate?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {activeTab === 'playground' ? 'Playground Events' : 'Crematorium Bookings'}
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map(timeSlot => {
          const slotBookings = getBookingsForTimeSlot(timeSlot);
          
          return (
            <div key={timeSlot} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
              <div className="flex">
                <div className="w-20 p-3 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {formatTimeSlot(timeSlot)}
                  </div>
                </div>
                <div className="flex-1 p-3 min-h-[60px]">
                  {slotBookings.length > 0 ? (
                    <div className="space-y-2">
                      {slotBookings.map(booking => (
                        <CalendarEvent
                          key={booking._id}
                          booking={booking}
                          type={activeTab}
                          onClick={onEventClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
                      <span className="text-sm">Available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarView = ({ bookings, activeTab, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    
    return bookings.filter(booking => {
      const bookingDate = activeTab === 'playground' 
        ? new Date(booking.eventDate)
        : new Date(booking.cremationDate);
      
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowTimeSlots(true);
  };

  const days = getDaysInMonth(currentDate);

  if (showTimeSlots) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowTimeSlots(false)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Calendar
          </button>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {getBookingsForDate(selectedDate).length} bookings scheduled
          </div>
        </div>
        <TimeSlotCalendar 
          bookings={bookings}
          activeTab={activeTab}
          onEventClick={onEventClick}
          selectedDate={selectedDate}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayBookings = day ? getBookingsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border border-slate-200 dark:border-slate-700 ${
                  day ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''
                } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map(booking => (
                        <CalendarEvent
                          key={booking._id}
                          booking={booking}
                          type={activeTab}
                          onClick={onEventClick}
                        />
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                      {dayBookings.length > 0 && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
                          View Schedule →
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function Adminbooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("playground");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeTab === "playground" ? PLAYGROUND_URL : CREMATORIUM_URL;
      const response = await axios.get(url);
      const data = activeTab === "playground" ? response.data.users : response.data.data;
      setBookings(data || []);
    } catch (error) {
      console.error(`Failed to fetch ${activeTab} bookings:`, error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCommentChange = (bookingId, value) => {
    setCommentInputs(prev => ({ ...prev, [bookingId]: value }));
  };

  const updateStatus = async (bookingId, approve, reject) => {
    try {
      const comment = commentInputs[bookingId] || "";
      const url = activeTab === "playground"
        ? `${PLAYGROUND_URL}/update-status/${bookingId}`
        : `${CREMATORIUM_URL}/update-status/${bookingId}`;
      
      await axios.patch(url, { approve, reject, comment });
      
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? { ...b, approve, reject, comment } : b))
      );
      setCommentInputs(prev => {
        const newComments = { ...prev };
        delete newComments[bookingId];
        return newComments;
      });
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredBookings = bookings.filter(booking => {
    // Search filter
    const matchesSearch = activeTab === "playground"
      ? booking.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.organizerName?.toLowerCase().includes(searchTerm.toLowerCase())
      : booking.deceasedFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.applicantFullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "pending" && !booking.approve && !booking.reject) ||
      (filterStatus === "approved" && booking.approve) ||
      (filterStatus === "rejected" && booking.reject);
    
    return matchesSearch && matchesStatus;
  });

  const handleEventClick = (booking) => {
    setSelectedBooking(booking);
    setViewMode("list");
    setExpanded({ [booking._id]: true });
  };

  const renderBookingContent = (booking) => {
    const isPlayground = activeTab === "playground";
    const isExpanded = !!expanded[booking._id];
    const isHighlighted = selectedBooking && selectedBooking._id === booking._id;
    
    const summaryDetails = isPlayground ? (
      <>
        <InfoItem icon={<User size={14} />} label="Organizer">{booking.organizerName}</InfoItem>
        <InfoItem icon={<Mail size={14} />} label="Email">{booking.email}</InfoItem>
        <InfoItem icon={<Calendar size={14} />} label="Event Date">{new Date(booking.eventDate).toLocaleString()}</InfoItem>
      </>
    ) : (
      <>
        <InfoItem icon={<User size={14} />} label="Applicant">{booking.applicantFullName}</InfoItem>
        <InfoItem icon={<MapPin size={14} />} label="Address">{booking.address}</InfoItem>
        <InfoItem icon={<Calendar size={14} />} label="Cremation Date">{new Date(booking.cremationDate).toLocaleString()}</InfoItem>
      </>
    );

    const expandedDetails = isPlayground ? (
      <>
        <InfoItem icon={<Activity size={14} />} label="Event Type">{booking.eventType}</InfoItem>
        <InfoItem icon={<Building size={14} />} label="Venue">{booking.playgroundType}</InfoItem>
        <InfoItem icon={<Phone size={14} />} label="Contact">{booking.phone}</InfoItem>
        <InfoItem icon={<Users size={14} />} label="Attendees">{booking.expectedAttendees}</InfoItem>
        <InfoItem icon={<Clock size={14} />} label="Time">{`${booking.startTime} - ${booking.endTime}`}</InfoItem>
        {booking.description && <InfoItem icon={<FileText size={14} />} label="Description">{booking.description}</InfoItem>}
        {booking.specialRequirement && <InfoItem icon={<FileText size={14} />} label="Special Requirements">{booking.specialRequirement}</InfoItem>}
      </>
    ) : (
      <>
        <InfoItem icon={<User size={14} />} label="Deceased Name">{booking.deceasedFullName}</InfoItem>
        <InfoItem icon={<Calendar size={14} />} label="Date of Death">{new Date(booking.dateOfDeath).toLocaleString()}</InfoItem>
        <InfoItem icon={<Home size={14} />} label="Residence Area">{booking.residenceArea}</InfoItem>
        <InfoItem icon={<Hash size={14} />} label="NIC">{booking.nic}</InfoItem>
        <InfoItem icon={<Hash size={14} />} label="Registration No.">{booking.registrationNumber}</InfoItem>
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Documents</p>
          <div className="flex flex-col gap-2 mt-1">
            {booking.deathCertificateImage && (
              <a 
                href={`http://localhost:5000/${booking.deathCertificateImage.replace(/\\/g, "/")}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Download size={14} /> Death Certificate
              </a>
            )}
            {booking.beOrderImage && (
              <a 
                href={`http://localhost:5000/${booking.beOrderImage.replace(/\\/g, "/")}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Download size={14} /> B.E. Order
              </a>
            )}
          </div>
        </div>
      </>
    );

    return (
      <motion.div
        key={booking._id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`bg-white dark:bg-slate-800 rounded-lg border overflow-hidden ${
          isHighlighted 
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">
                {isPlayground ? booking.eventName : `Request: ${booking.deceasedFullName}`}
              </h3>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                {summaryDetails}
              </div>
            </div>
            <StatusBadge booking={booking} />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t border-slate-200 dark:border-slate-700 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <button
              onClick={() => toggleExpand(booking._id)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
            >
              {isExpanded ? "Show Less" : "View Details"}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>

          {(!booking.approve && !booking.reject) ? (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor={`comment-${booking._id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Comment</label>
                <textarea
                  id={`comment-${booking._id}`}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  placeholder="Provide feedback for the applicant..."
                  value={commentInputs[booking._id] || ""}
                  onChange={e => handleCommentChange(booking._id, e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => updateStatus(booking._id, true, false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition-colors"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button 
                  onClick={() => updateStatus(booking._id, false, true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 hover:bg-rose-700 px-3 py-2 text-sm font-medium text-white transition-colors"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-md bg-slate-100 dark:bg-slate-700/50">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Admin Comment:</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.comment || "No comment provided."}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Component */}
      <Navigation 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Booking Requests</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage {activeTab === "playground" ? "playground" : "crematorium"} bookings
                </p>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Showing <span className="font-medium">{filteredBookings.length}</span> of <span className="font-medium">{bookings.length}</span> requests
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === "playground" ? "events" : "requests"}...`}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  className="text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <List size={14} /> List
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === 'calendar' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Calendar size={14} /> Calendar
                  </button>
                </div>
                
                <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden">
                  <button
                    onClick={() => setActiveTab("playground")}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'playground' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    Playground
                  </button>
                  <button
                    onClick={() => setActiveTab("crematorium")}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === 'crematorium' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                  >
                    Crematorium
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "calendar" ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CalendarView 
                  bookings={filteredBookings} 
                  activeTab={activeTab}
                  onEventClick={handleEventClick}
                />
              </motion.div>
            ) : filteredBookings.length > 0 ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-5"
              >
                {filteredBookings.map(booking => renderBookingContent(booking))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12"
              >
                <div className="mx-auto h-12 w-12 text-slate-400">
                  {activeTab === 'playground' ? <Activity size={48} /> : <Flame size={48} />}
                </div>
                <h3 className="mt-3 text-lg font-medium text-slate-900 dark:text-white">No matching requests</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : `All caught up! No ${activeTab} requests found.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Adminbooking;