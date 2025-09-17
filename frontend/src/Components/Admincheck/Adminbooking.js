import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from '../Navigation/Navigation';

import {
  Calendar, Clock, Users, MapPin, Mail, Phone,
  AlertCircle, CheckCircle, XCircle, ChevronDown,
  User, FileText, Flame, Activity, Download, Building, Home, Hash,
  List, ChevronLeft, ChevronRight, Filter, Eye, Search, Bell
} from "lucide-react";

// API endpoints
const PLAYGROUND_URL = "http://localhost:5000/users";
const CREMATORIUM_URL = "http://localhost:5000/crematorium";

// Custom Components
const StatusBadge = ({ booking }) => {
  if (booking.approve) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-full border border-emerald-200 shadow-sm">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
        <span>Approved</span>
      </div>
    );
  }
  if (booking.reject) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full border border-red-200 shadow-sm">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        <span>Rejected</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-full border border-amber-200 shadow-sm">
      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
      <span>Pending Review</span>
    </div>
  );
};

const InfoCard = ({ icon, label, children, highlight = false }) => (
  <div className={`p-4 rounded-xl border transition-all duration-200 ${
    highlight 
      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
      : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
  }`}>
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        highlight 
          ? 'bg-blue-100 text-blue-600' 
          : 'bg-gray-200 text-gray-600'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{children || "Not specified"}</p>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading requests</h3>
      <p className="text-sm text-gray-500">Please wait while we fetch the latest data...</p>
    </div>
  </div>
);

const CalendarEvent = ({ booking, type, onClick }) => {
  const getStatusColor = () => {
    if (booking.approve) return 'bg-emerald-500 border-l-emerald-600';
    if (booking.reject) return 'bg-red-500 border-l-red-600';
    return 'bg-amber-500 border-l-amber-600';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -1 }}
      onClick={() => onClick(booking)}
      className={`p-3 mb-2 rounded-lg text-white text-xs cursor-pointer border-l-4 ${getStatusColor()} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="font-medium truncate mb-1">{title}</div>
      <div className="opacity-90 text-xs">{time}</div>
      {type === 'playground' && booking.organizerName && (
        <div className="opacity-75 truncate text-xs mt-1">{booking.organizerName}</div>
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Schedule for {selectedDate?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <p className="text-sm text-gray-600">
          {activeTab === 'playground' ? 'Playground Events' : 'Crematorium Bookings'}
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map(timeSlot => {
          const slotBookings = getBookingsForTimeSlot(timeSlot);
          
          return (
            <div key={timeSlot} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
              <div className="flex">
                <div className="w-24 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200 flex items-center">
                  <div className="text-sm font-semibold text-gray-700">
                    {formatTimeSlot(timeSlot)}
                  </div>
                </div>
                <div className="flex-1 p-4 min-h-[80px]">
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
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500">Available</span>
                      </div>
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
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowTimeSlots(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={16} />
            Back to Calendar
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <Calendar size={16} />
            <span className="text-sm font-medium">
              {getBookingsForDate(selectedDate).length} bookings scheduled
            </span>
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-white/80 rounded-lg transition-colors border border-transparent hover:border-gray-300"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-white/80 rounded-lg transition-colors border border-transparent hover:border-gray-300"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayBookings = day ? getBookingsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 rounded-lg border transition-all duration-200 ${
                  day ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'border-gray-200'} ${
                  isSelected ? 'ring-2 ring-blue-300 border-blue-400' : ''
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-blue-700' : 'text-gray-900'
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
                        <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 text-center">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                      {dayBookings.length > 0 && (
                        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium w-full text-center py-1">
                          View Schedule →
                        </button>
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
  const [viewMode, setViewMode] = useState("list");
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
    const matchesSearch = activeTab === "playground"
      ? booking.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.organizerName?.toLowerCase().includes(searchTerm.toLowerCase())
      : booking.deceasedFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.applicantFullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        <InfoCard icon={<User size={16} />} label="Event Organizer" highlight={isHighlighted}>
          {booking.organizerName}
        </InfoCard>
        <InfoCard icon={<Mail size={16} />} label="Contact Email">
          {booking.email}
        </InfoCard>
        <InfoCard icon={<Calendar size={16} />} label="Event Date">
          {new Date(booking.eventDate).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </InfoCard>
      </>
    ) : (
      <>
        <InfoCard icon={<User size={16} />} label="Applicant Name" highlight={isHighlighted}>
          {booking.applicantFullName}
        </InfoCard>
        <InfoCard icon={<MapPin size={16} />} label="Address">
          {booking.address}
        </InfoCard>
        <InfoCard icon={<Calendar size={16} />} label="Cremation Date">
          {new Date(booking.cremationDate).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </InfoCard>
      </>
    );

    const expandedDetails = isPlayground ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={<Activity size={16} />} label="Event Type">
          {booking.eventType}
        </InfoCard>
        <InfoCard icon={<Building size={16} />} label="Venue">
          {booking.playgroundType}
        </InfoCard>
        <InfoCard icon={<Phone size={16} />} label="Contact Number">
          {booking.phone}
        </InfoCard>
        <InfoCard icon={<Users size={16} />} label="Expected Attendees">
          {booking.expectedAttendees}
        </InfoCard>
        <InfoCard icon={<Clock size={16} />} label="Duration">
          {`${booking.startTime} - ${booking.endTime}`}
        </InfoCard>
        {booking.description && (
          <div className="md:col-span-2 lg:col-span-3">
            <InfoCard icon={<FileText size={16} />} label="Event Description">
              {booking.description}
            </InfoCard>
          </div>
        )}
        {booking.specialRequirement && (
          <div className="md:col-span-2 lg:col-span-3">
            <InfoCard icon={<AlertCircle size={16} />} label="Special Requirements">
              {booking.specialRequirement}
            </InfoCard>
          </div>
        )}
      </div>
    ) : (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard icon={<User size={16} />} label="Deceased Full Name">
            {booking.deceasedFullName}
          </InfoCard>
          <InfoCard icon={<Calendar size={16} />} label="Date of Death">
            {new Date(booking.dateOfDeath).toLocaleDateString()}
          </InfoCard>
          <InfoCard icon={<Home size={16} />} label="Residence Area">
            {booking.residenceArea}
          </InfoCard>
          <InfoCard icon={<Hash size={16} />} label="NIC Number">
            {booking.nic}
          </InfoCard>
          <InfoCard icon={<Hash size={16} />} label="Registration Number">
            {booking.registrationNumber}
          </InfoCard>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Required Documents
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {booking.deathCertificateImage && (
              <a 
                href={`http://localhost:5000/${booking.deathCertificateImage.replace(/\\/g, "/")}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Death Certificate</p>
                  <p className="text-sm text-gray-500">Click to download</p>
                </div>
              </a>
            )}
            {booking.beOrderImage && (
              <a 
                href={`http://localhost:5000/${booking.beOrderImage.replace(/\\/g, "/")}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">B.E. Order</p>
                  <p className="text-sm text-gray-500">Click to download</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <motion.div
        key={booking._id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
          isHighlighted 
            ? 'border-blue-300 shadow-lg ring-4 ring-blue-100' 
            : 'border-gray-200 hover:shadow-md hover:border-gray-300'
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                {isPlayground ? (
                  <Activity className="w-5 h-5 text-blue-600" />
                ) : (
                  <Flame className="w-5 h-5 text-orange-600" />
                )}
                {isPlayground ? booking.eventName : `Request: ${booking.deceasedFullName}`}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar size={14} />
                <span>Submitted on {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
            <StatusBadge booking={booking} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {summaryDetails}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6">
                  {expandedDetails}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => toggleExpand(booking._id)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Eye size={16} />
              {isExpanded ? "Hide Details" : "View Full Details"}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>

          {(!booking.approve && !booking.reject) ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <label htmlFor={`comment-${booking._id}`} className="block text-sm font-semibold text-gray-700 mb-3">
                  Admin Review Comments
                </label>
                <textarea
                  id={`comment-${booking._id}`}
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                  placeholder="Provide detailed feedback or reasoning for your decision..."
                  value={commentInputs[booking._id] || ""}
                  onChange={e => handleCommentChange(booking._id, e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => updateStatus(booking._id, true, false)}
                  className="flex-1 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <CheckCircle size={18} />
                  <span>Approve Request</span>
                </button>
                <button 
                  onClick={() => updateStatus(booking._id, false, true)}
                  className="flex-1 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <XCircle size={18} />
                  <span>Reject Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  booking.approve 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {booking.approve ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Request {booking.approve ? 'Approved' : 'Rejected'}
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Comments:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {booking.comment || "No additional comments provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  {activeTab === 'playground' ? (
                    <Activity className="w-8 h-8 text-blue-600" />
                  ) : (
                    <Flame className="w-8 h-8 text-orange-600" />
                  )}
                  Booking Approval Center
                </h1>
                <p className="text-lg text-gray-600">
                  Review and manage {activeTab === "playground" ? "playground event" : "crematorium"} requests
                </p>
              </div>
              <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
                  <p className="text-sm text-gray-500">Shown</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab === "playground" ? "events" : "requests"}...`}
                      className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <select
                    className="px-4 py-3 text-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden bg-white">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'list' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <List size={16} /> List View
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'calendar' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Calendar size={16} /> Calendar View
                    </button>
                  </div>
                  
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden bg-white">
                    <button
                      onClick={() => setActiveTab("playground")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === 'playground' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Activity size={16} /> Playground
                    </button>
                    <button
                      onClick={() => setActiveTab("crematorium")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === 'crematorium' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Flame size={16} /> Crematorium
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
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
                className="space-y-6"
              >
                {filteredBookings.map(booking => renderBookingContent(booking))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center bg-white rounded-2xl border border-gray-200 p-16 shadow-sm"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  {activeTab === 'playground' ? (
                    <Activity size={40} className="text-gray-400" />
                  ) : (
                    <Flame size={40} className="text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search criteria or filters to find relevant requests."
                    : `No ${activeTab} requests are currently available for review.`}
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