import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from '../Navigation/Navigation';

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Calendar, Clock, Users, MapPin, Mail, Phone,
  AlertCircle, CheckCircle, XCircle, ChevronDown,
  User, FileText, Flame, Activity, Download, Building, Home, Hash,
  List, ChevronLeft, ChevronRight, Filter, Eye, Search, Bell, FileDown, FileSpreadsheet
} from "lucide-react";

// ---------------------------------------------
// THEME (60–30–10 rule)
// 60% = Primary (maroon/deep red)
// 30% = Secondary (slate/neutral)
// 10% = Accent (emerald)
// ---------------------------------------------
const primaryBG = "bg-gradient-to-br from-red-50 via-rose-50 to-white";
const secondaryCard = "bg-white border border-slate-200";
const accent = {
  pill: "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
  btn: "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
};

// FIXED: API endpoints to match your actual backend
const PLAYGROUND_URL = "http://localhost:5000/playgrounds";
const CREMATORIUM_URL = "http://localhost:5000/crematorium";

// Government letterhead configuration
const GOVERNMENT_CONFIG = {
  emblemPath: "/emblem.png",           // Sri Lankan Government Emblem (using PNG instead of SVG)
  logoPath: "/horanalogo.png",         // Horana Urban Council Logo
  signaturePath: "/signature.png",     // Digital signature image
  country: "DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA",
  council: "HORANA URBAN COUNCIL",
  localName: "Horana Nagara Sabhaawa", // Sinhala transliteration
  address: "123, Mathugama Horana",
  email: "horanaurbancouncil123@gmail.com",
  fax: "1235565"
};

// ---------------------------------------------
// Small UI Components
// ---------------------------------------------
const StatusBadge = ({ booking }) => {
  // FIXED: Use the status field from your backend
  const status = booking.status || "Pending";
  
  if (status === "Approved") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-full border border-emerald-200 shadow-sm">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
        <span>Approved</span>
      </div>
    );
  }
  if (status === "Rejected") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 rounded-full border border-rose-200 shadow-sm">
        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
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
      ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
      : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80'
  }`}>
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        highlight ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-900 break-words">{children || "Not specified"}</p>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading requests</h3>
      <p className="text-sm text-slate-500">Please wait while we fetch the latest data...</p>
    </div>
  </div>
);

// ---------------------------------------------
// Calendar Components
// ---------------------------------------------
const CalendarEvent = ({ booking, type, onClick }) => {
  const getStatusColor = () => {
    const status = booking.status || "Pending";
    if (status === "Approved") return 'bg-emerald-500 border-l-emerald-600';
    if (status === "Rejected") return 'bg-rose-500 border-l-rose-600';
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
    <div className={`${secondaryCard} rounded-2xl shadow-sm overflow-hidden`}>
      <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Schedule for {selectedDate?.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
        <p className="text-sm text-slate-600">
          {activeTab === 'playground' ? 'Playground Events' : 'Crematorium Bookings'}
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map(timeSlot => {
          const slotBookings = getBookingsForTimeSlot(timeSlot);

          return (
            <div key={timeSlot} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
              <div className="flex">
                <div className="w-24 p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-r border-slate-200 flex items-center">
                  <div className="text-sm font-semibold text-slate-700">
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
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-500">Available</span>
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={16} />
            Back to Calendar
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
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
    <div className={`${secondaryCard} rounded-2xl shadow-sm overflow-hidden`}>
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-200">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-white/80 rounded-lg transition-colors border border-transparent hover:border-slate-300"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>

        <h2 className="text-xl font-bold text-slate-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-white/80 rounded-lg transition-colors border border-transparent hover:border-slate-300"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayBookings = day ? getBookingsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = day && new Date(day).setHours(0,0,0,0) === new Date().setHours(0,0,0,0);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 rounded-lg border transition-all duration-200 ${
                  day ? 'cursor-pointer hover:border-red-300 hover:shadow-sm bg-white' : 'bg-slate-50'
                } ${isToday ? 'bg-red-50 border-red-200 ring-2 ring-red-100' : 'border-slate-200'} ${
                  isSelected ? 'ring-2 ring-red-300 border-red-400' : ''
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-red-700' : 'text-slate-900'
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
                        <div className="text-xs text-slate-500 bg-slate-100 rounded px-2 py-1 text-center">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                      {dayBookings.length > 0 && (
                        <button className="text-xs text-red-600 hover:text-red-800 font-medium w-full text-center py-1">
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

// ---------------------------------------------
// FIXED PDF GENERATION WITH PROPER IMAGE HANDLING
// ---------------------------------------------

// Helper function to load PNG images as base64 with detailed logging
const loadImageAsBase64 = (src) => {
  console.log('🔍 PNG Loading Debug - Starting to load PNG from:', src);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ PNG Loading Debug - Image loaded successfully');
      console.log('🔍 PNG Loading Debug - Image dimensions:', img.width, 'x', img.height);
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        console.log('✅ PNG Loading Debug - Successfully converted to base64, length:', dataURL.length);
        resolve(dataURL);
      } catch (error) {
        console.error('❌ PNG Loading Debug - Canvas error:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('❌ PNG Loading Debug - Failed to load image:', src);
      console.error('❌ PNG Loading Debug - Error event:', error);
      reject(error);
    };
    
    // Log the full URL being attempted
    const fullUrl = new URL(src, window.location.origin).href;
    console.log('🔍 PNG Loading Debug - Full URL:', fullUrl);
    
    img.src = src;
  });
};

// FIXED: Enhanced government-style PDF report builder with proper image loading
async function buildPdfReport({ rows, columns, title, subtitle }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const currentDate = new Date();
  
  // FIXED: Enhanced government header with PNG emblem and detailed logging
  const addGovernmentHeader = async () => {
    console.log('🔧 PDF Generation Debug - Starting government header creation');
    
    // Clean white background for header
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 150, 'F');
    
    // Government header border in official maroon
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageWidth - margin, 145);
    
    let emblemLoaded = false;
    let logoLoaded = false;
    
    // Try to load Sri Lankan Government Emblem (PNG - switched from SVG)
    console.log('🔧 PDF Generation Debug - Attempting to load emblem (PNG)...');
    console.log('🔧 PDF Generation Debug - Emblem path from config:', GOVERNMENT_CONFIG.emblemPath);
    
    try {
      const emblemBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.emblemPath);
      if (emblemBase64) {
        console.log('✅ PDF Generation Debug - Emblem loaded, adding to PDF at position:', margin, 40);
        doc.addImage(emblemBase64, 'PNG', margin, 40, 50, 50); // Reduced from 70x70 to 50x50, moved down from 35 to 40
        emblemLoaded = true;
        console.log('✅ PDF Generation Debug - Emblem successfully added to PDF');
      } else {
        console.log('❌ PDF Generation Debug - Emblem loading returned null');
      }
    } catch (error) {
      console.error('❌ PDF Generation Debug - Emblem loading error:', error);
    }
    
    // Try to load Horana Urban Council Logo (PNG)
    console.log('🔧 PDF Generation Debug - Attempting to load logo...');
    console.log('🔧 PDF Generation Debug - Logo path from config:', GOVERNMENT_CONFIG.logoPath);
    
    try {
      const logoBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.logoPath);
      if (logoBase64) {
        console.log('✅ PDF Generation Debug - Logo loaded, adding to PDF at position:', pageWidth - margin - 50, 40);
        doc.addImage(logoBase64, 'PNG', pageWidth - margin - 50, 40, 50, 50); // Reduced from 70x70 to 50x50, moved down from 35 to 40
        logoLoaded = true;
        console.log('✅ PDF Generation Debug - Logo successfully added to PDF');
      } else {
        console.log('❌ PDF Generation Debug - Logo loading returned null');
      }
    } catch (error) {
      console.error('❌ PDF Generation Debug - Logo loading error:', error);
    }
    
    // Log final status
    console.log('🔧 PDF Generation Debug - Final status: Emblem loaded:', emblemLoaded, '| Logo loaded:', logoLoaded);
    
    // FIXED: Only show placeholders if images actually failed to load
    if (!emblemLoaded) {
      console.log('⚠️ PDF Generation Debug - Adding emblem placeholder');
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(2);
      doc.rect(margin, 40, 50, 50, 'S'); // Reduced from 70x70 to 50x50, moved down from 35 to 40
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text('EMBLEM', margin + 10, 60, { align: 'left' }); // Adjusted text position
      doc.text('NOT FOUND', margin + 5, 75, { align: 'left' }); // Adjusted text position
    }
    
    if (!logoLoaded) {
      console.log('⚠️ PDF Generation Debug - Adding logo placeholder');
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(2);
      doc.rect(pageWidth - margin - 50, 40, 50, 50, 'S'); // Reduced from 70x70 to 50x50, moved down from 35 to 40
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text('LOGO', pageWidth - margin - 35, 60, { align: 'left' }); // Adjusted text position
      doc.text('NOT FOUND', pageWidth - margin - 45, 75, { align: 'left' }); // Adjusted text position
    }
    
    // Official government titles in center (positioned to not overlap with images)
    const centerX = pageWidth / 2;
    
    console.log('🔧 PDF Generation Debug - Adding government titles at center position:', centerX);
    
    // Main country title
    doc.setTextColor(128, 0, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(GOVERNMENT_CONFIG.country, centerX, 35, { align: 'center' }); // Moved up from 40 to 35
    
    // Council name
    doc.setFontSize(16);
    doc.text(GOVERNMENT_CONFIG.council, centerX, 57, { align: 'center' }); // Moved up from 62 to 57
    
    // Local language name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text(GOVERNMENT_CONFIG.localName, centerX, 77, { align: 'center' }); // Moved up from 82 to 77
    
    // Contact information
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`${GOVERNMENT_CONFIG.address} | Email: ${GOVERNMENT_CONFIG.email} | Fax: ${GOVERNMENT_CONFIG.fax}`, centerX, 98, { align: 'center' });
    
    // Report title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), centerX, 120, { align: 'center' });
    
    // Report subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, centerX, 135, { align: 'center' });
    
    console.log('✅ PDF Generation Debug - Government header creation completed');
  };
  
  // Enhanced footer with actual signature image and timestamp
  const addFooter = async () => {
    const footerY = pageHeight - 110;
    
    // Left side - Generation timestamp
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Generated on:', margin, footerY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(currentDate.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), margin, footerY + 15);
    doc.text(currentDate.toLocaleTimeString('en-GB', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }), margin, footerY + 30);
    
    // Right side - Authorization signature with actual signature image
    const sigX = pageWidth - margin - 160;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Authorized by:', sigX, footerY);
    
    // Try to load and add signature image
    let signatureLoaded = false;
    console.log('🔧 PDF Footer Debug - Attempting to load signature...');
    console.log('🔧 PDF Footer Debug - Signature path:', GOVERNMENT_CONFIG.signaturePath);
    
    try {
      const signatureBase64 = await loadImageAsBase64(GOVERNMENT_CONFIG.signaturePath);
      if (signatureBase64) {
        console.log('✅ PDF Footer Debug - Signature loaded, adding to PDF');
        // Add signature image (adjust size as needed)
        doc.addImage(signatureBase64, 'PNG', sigX, footerY + 10, 100, 25);
        signatureLoaded = true;
      } else {
        console.log('❌ PDF Footer Debug - Signature loading returned null');
      }
    } catch (error) {
      console.error('❌ PDF Footer Debug - Signature loading error:', error);
    }
    
    // Fallback: Blue signature line and drawn signature if image fails
    if (!signatureLoaded) {
      console.log('⚠️ PDF Footer Debug - Using fallback drawn signature');
      
      // Blue signature line
      doc.setDrawColor(0, 100, 200);
      doc.setLineWidth(2);
      doc.line(sigX, footerY + 25, sigX + 150, footerY + 25);
      
      // Digital signature simulation (blue pen style)
      doc.setDrawColor(0, 80, 180);
      doc.setLineWidth(2.5);
      const sigY = footerY + 20;
      // Signature curves
      doc.line(sigX + 15, sigY, sigX + 35, sigY - 6);
      doc.line(sigX + 35, sigY - 6, sigX + 55, sigY + 4);
      doc.line(sigX + 55, sigY + 4, sigX + 85, sigY - 3);
      doc.line(sigX + 85, sigY - 3, sigX + 115, sigY + 6);
      doc.line(sigX + 115, sigY + 6, sigX + 135, sigY - 2);
    }
    
    // Officer details
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Administrative Officer', sigX, footerY + 40);
    doc.text('Horana Urban Council', sigX, footerY + 52);
    
    // Bottom border line
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(1);
    doc.line(margin, footerY + 70, pageWidth - margin, footerY + 70);
    
    // Page number
    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(pageStr, pageWidth / 2, footerY + 85, { align: 'center' });
  };

  // FIXED: Simplified header for additional pages (without async image loading)
  const addSimpleHeader = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 150, 'F');
    doc.setDrawColor(128, 0, 32);
    doc.setLineWidth(3);
    doc.line(margin, 145, pageWidth - margin, 145);
    
    // Simple placeholders for additional pages (no overlapping text)
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(2);
    doc.rect(margin, 40, 50, 50, 'S'); // Reduced from 70x70 to 50x50, moved down from 35 to 40
    doc.rect(pageWidth - margin - 50, 40, 50, 50, 'S'); // Reduced from 70x70 to 50x50, moved down from 35 to 40
    
    // Clear titles for additional pages (properly centered)
    const centerX = pageWidth / 2;
    doc.setTextColor(128, 0, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(GOVERNMENT_CONFIG.country, centerX, 35, { align: 'center' }); // Moved up from 40 to 35
    doc.setFontSize(16);
    doc.text(GOVERNMENT_CONFIG.council, centerX, 57, { align: 'center' }); // Moved up from 62 to 57
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text(GOVERNMENT_CONFIG.localName, centerX, 77, { align: 'center' }); // Moved up from 82 to 77
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), centerX, 120, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, centerX, 135, { align: 'center' });
  };

  // Generate PDF with header and content
  await addGovernmentHeader();

  // Government-styled data table
  autoTable(doc, {
    startY: 165,
    headStyles: { 
      fillColor: [128, 0, 32],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11,
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 10,
      lineColor: [180, 180, 180],
      lineWidth: 0.5,
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 255]
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 8,
      halign: 'center',
      overflow: 'linebreak'
    },
    head: [columns.map(c => c.header)],
    body: rows.map(r => columns.map(c => (typeof c.accessor === 'function' ? c.accessor(r) : r[c.accessor] ?? 'N/A'))),
    didDrawPage: async (data) => {
      // FIXED: Add simplified header for additional pages
      if (data.pageNumber > 1) {
        addSimpleHeader();
      }
      await addFooter();
    },
    margin: { top: 170, bottom: 120, left: margin, right: margin }
  });

  // Add footer to first page if needed
  if (doc.internal.getNumberOfPages() === 1) {
    await addFooter();
  }

  return doc;
}

// ---------------------------------------------
// MAIN ADMIN BOOKING COMPONENT
// ---------------------------------------------
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

  // FIXED: Data extraction to match your backend structure
  const extractBookingData = (response, type) => {
    console.log(`Extracting ${type} data from response:`, response.data);
    
    if (type === "playground") {
      // Based on your backend: res.status(200).json({ items, count: items.length });
      if (response.data.items && Array.isArray(response.data.items)) {
        return response.data.items;
      }
      // Fallback patterns
      if (Array.isArray(response.data)) return response.data;
      if (response.data.bookings && Array.isArray(response.data.bookings)) return response.data.bookings;
    } else {
      // For crematorium (keeping original logic)
      return response.data.data || [];
    }
    
    console.warn(`Could not extract ${type} data, returning empty array`);
    return [];
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeTab === "playground" ? PLAYGROUND_URL : CREMATORIUM_URL;
      console.log(`Fetching ${activeTab} bookings from:`, url);
      
      const response = await axios.get(url);
      console.log(`${activeTab} response:`, response.data);
      
      const data = extractBookingData(response, activeTab);
      console.log(`Extracted ${activeTab} data:`, data);
      
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

  // FIXED: Update status to use your backend's API structure
  const updateStatus = async (bookingId, isApprove) => {
    try {
      const comment = commentInputs[bookingId] || "";
      
      if (activeTab === "playground") {
        // Use your backend's PATCH /playgrounds/update-status/:id endpoint
        const action = isApprove ? "approve" : "reject";
        await axios.patch(`${PLAYGROUND_URL}/update-status/${bookingId}`, { 
          action, 
          comment 
        });
      } else {
        // Keep crematorium logic as is
        await axios.patch(`${CREMATORIUM_URL}/update-status/${bookingId}`, { 
          approve: isApprove, 
          reject: !isApprove, 
          comment 
        });
      }

      // Update local state to reflect the change
      setBookings(prev =>
        prev.map(b => (
          b._id === bookingId 
            ? { 
                ...b, 
                status: isApprove ? "Approved" : "Rejected",
                comment,
                statusUpdatedAt: new Date().toISOString()
              }
            : b
        ))
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

    const status = booking.status || "Pending";
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "pending" && status === "Pending") ||
      (filterStatus === "approved" && status === "Approved") ||
      (filterStatus === "rejected" && status === "Rejected");

    return matchesSearch && matchesStatus;
  });

  const handleEventClick = (booking) => {
    setSelectedBooking(booking);
    setViewMode("list");
    setExpanded({ [booking._id]: true });
  };

  // PDF Report Generation Functions
  const buildColumnsForTab = (tab) => {
    if (tab === 'playground') {
      return [
        { header: 'Event Name', accessor: 'eventName' },
        { header: 'Organizer', accessor: 'organizerName' },
        { header: 'Email', accessor: 'email' },
        { header: 'Date', accessor: (r) => new Date(r.eventDate).toLocaleDateString() },
        { header: 'Time', accessor: (r) => `${r.startTime || ''} - ${r.endTime || ''}` },
        { header: 'Attendees', accessor: 'expectedAttendees' },
        { header: 'Status', accessor: (r) => r.status || 'Pending' },
      ];
    }
    return [
      { header: 'Deceased', accessor: 'deceasedFullName' },
      { header: 'Applicant', accessor: 'applicantFullName' },
      { header: 'Residence', accessor: 'residenceArea' },
      { header: 'NIC', accessor: 'nic' },
      { header: 'Cremation Date', accessor: (r) => new Date(r.cremationDate).toLocaleString() },
      { header: 'Status', accessor: (r) => r.approve ? 'Approved' : r.reject ? 'Rejected' : 'Pending' },
    ];
  };

  const downloadPdf = async (mode = 'active') => {
    const now = new Date();

    const makeDoc = async (tab, rows) => {
      const columns = buildColumnsForTab(tab);
      console.log(`Generating ${tab} PDF with ${rows.length} rows`);
      const doc = await buildPdfReport({
        rows,
        columns,
        title: `${tab === 'playground' ? 'Playground' : 'Crematorium'} Bookings Report`,
        subtitle: `Generated on ${now.toLocaleString()} | Total Records: ${rows.length}`,
      });
      return doc;
    };

    const fetchFor = async (tab) => {
      if (activeTab === tab) {
        return filteredBookings;
      }
      try {
        const url = tab === 'playground' ? PLAYGROUND_URL : CREMATORIUM_URL;
        const response = await axios.get(url);
        return extractBookingData(response, tab);
      } catch (e) {
        console.error('Export fetch error', e);
        return [];
      }
    };

    if (mode === 'both') {
      const playgroundRows = await fetchFor('playground');
      const cremRows = await fetchFor('crematorium');

      const playgroundDoc = await makeDoc('playground', playgroundRows);
      const crematoriumDoc = await makeDoc('crematorium', cremRows);

      playgroundDoc.save(`Playground_Bookings_Report_${now.toISOString().slice(0,10)}.pdf`);
      crematoriumDoc.save(`Crematorium_Bookings_Report_${now.toISOString().slice(0,10)}.pdf`);
      return;
    }

    const tab = mode === 'active' ? activeTab : mode;
    const rows = await fetchFor(tab);
    const doc = await makeDoc(tab, rows);
    doc.save(`${tab}_Bookings_Report_${now.toISOString().slice(0,10)}.pdf`);
  };

  const renderBookingContent = (booking) => {
    const isPlayground = activeTab === "playground";
    const isExpanded = !!expanded[booking._id];
    const isHighlighted = selectedBooking && selectedBooking._id === booking._id;
    const status = booking.status || "Pending";

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

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Required Documents
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {booking.deathCertificateImage && (
              <a
                href={`http://localhost:5000/${booking.deathCertificateImage.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Download size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Death Certificate</p>
                  <p className="text-sm text-slate-500">Click to download</p>
                </div>
              </a>
            )}
            {booking.beOrderImage && (
              <a
                href={`http://localhost:5000/${booking.beOrderImage.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Download size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">B.E. Order</p>
                  <p className="text-sm text-slate-500">Click to download</p>
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
            ? 'border-red-300 shadow-lg ring-4 ring-red-100'
            : 'border-slate-200 hover:shadow-md hover:border-slate-300'
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                {isPlayground ? (
                  <Activity className="w-5 h-5 text-red-600" />
                ) : (
                  <Flame className="w-5 h-5 text-rose-600" />
                )}
                {isPlayground ? booking.eventName : `Request: ${booking.deceasedFullName}`}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
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
              <div className="px-6 pb-6 border-t border-slate-100">
                <div className="pt-6">
                  {expandedDetails}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => toggleExpand(booking._id)}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors"
            >
              <Eye size={16} />
              {isExpanded ? "Hide Details" : "View Full Details"}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>

          {status === "Pending" ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <label htmlFor={`comment-${booking._id}`} className="block text-sm font-semibold text-slate-700 mb-3">
                  Admin Review Comments
                </label>
                <textarea
                  id={`comment-${booking._id}`}
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 resize-none"
                  placeholder="Provide detailed feedback or reasoning for your decision..."
                  value={commentInputs[booking._id] || ""}
                  onChange={e => handleCommentChange(booking._id, e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(booking._id, true)}
                  className={`flex-1 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r ${accent.btn} px-6 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5`}
                >
                  <CheckCircle size={18} />
                  <span>Approve Request</span>
                </button>
                <button
                  onClick={() => updateStatus(booking._id, false)}
                  className="flex-1 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <XCircle size={18} />
                  <span>Reject Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === "Approved"
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                }`}>
                  {status === "Approved" ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    Request {status}
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-1">Admin Comments:</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
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
    <div className={`min-h-screen ${primaryBG}`}>
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  {activeTab === 'playground' ? (
                    <Activity className="w-8 h-8 text-red-600" />
                  ) : (
                    <Flame className="w-8 h-8 text-rose-600" />
                  )}
                  Booking Approval Center
                </h1>
                <p className="text-lg text-slate-600">
                  Review and manage {activeTab === "playground" ? "playground event" : "crematorium"} requests
                </p>
              </div>

              {/* Stats + Export */}
              <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{filteredBookings.length}</p>
                  <p className="text-sm text-slate-500">Shown</p>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{bookings.length}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPdf('active')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                    title="Download current tab report (applies filters)"
                  >
                    <FileDown size={16} /> Active PDF
                  </button>
                  <button
                    onClick={() => downloadPdf('both')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                    title="Download both Playground and Crematorium reports"
                  >
                    <FileSpreadsheet size={16} /> Both PDFs
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className={`${secondaryCard} rounded-2xl p-6 shadow-sm mb-8`}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab === "playground" ? "events" : "requests"}...`}
                      className="w-full pl-12 pr-4 py-3 text-sm border border-slate-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    className="px-4 py-3 text-sm border border-slate-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'list'
                          ? 'bg-red-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <List size={16} /> List View
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        viewMode === 'calendar'
                          ? 'bg-red-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Calendar size={16} /> Calendar View
                    </button>
                  </div>

                  <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
                    <button
                      onClick={() => setActiveTab("playground")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === 'playground'
                          ? 'bg-red-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Activity size={16} /> Playground
                    </button>
                    <button
                      onClick={() => setActiveTab("crematorium")}
                      className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === 'crematorium'
                          ? 'bg-red-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
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
                className={`${secondaryCard} text-center rounded-2xl p-16 shadow-sm`}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
                  {activeTab === 'playground' ? (
                    <Activity size={40} className="text-slate-400" />
                  ) : (
                    <Flame size={40} className="text-slate-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No requests found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
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