// PlaygroundFrom.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Nav from "../Nav/Nav";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, User, MapPin, AlertCircle, X, MessageCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

// NOTE: uses ONLY your existing /playgrounds REST endpoints. No new backend needed.
const API_BASE = "http://localhost:5000/playgrounds";

/* ---------- tiny helpers (no deps) ---------- */
const toDateOnly = (d) => {
  try {
    const x = new Date(d);
    const y = new Date(x.getFullYear(), x.getMonth(), x.getDate());
    const yyyy = y.getFullYear();
    const mm = String(y.getMonth() + 1).padStart(2, '0');
    const dd = String(y.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
};

const parseHHMM = (s) => {
  if (!s || typeof s !== 'string') return NaN;
  const m = s.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!m) return NaN;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
};

const overlaps = (aStart, aEnd, bStart, bEnd) => {
  // treat as [start, end) to avoid edge-case when one ends exactly when next starts
  return aStart < bEnd && bStart < aEnd;
};

function AddUser() {
  const history = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showChatbotNotification, setShowChatbotNotification] = useState(true);

  // availability UI state
  const [availabilityStatus, setAvailabilityStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'conflict'
  const [bookingConflict, setBookingConflict] = useState(null); // { message, conflictDetails }

  // cache of bookings by date + type to reduce network noise
  const [bookingsCache, setBookingsCache] = useState({}); // key: `${date}__${type}` -> array

  const [inputs, setInputs] = useState({
    eventName: "",
    eventType: "",
    description: "",
    organizerName: "",
    email: "",
    phone: "",
    playgroundType: "",
    expectedAttendees: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    specialRequirement: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ---------------- Validation ---------------- */
  // Accept Latin + Sinhala + Tamil so local names/types work
  const validationRules = {
    eventName: { required: true, minLength: 3, maxLength: 100, pattern: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u0B80-\u0BFF\u200D\u200C.,'-]+$/ },
    eventType: { required: true, minLength: 3, maxLength: 50, pattern: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u0B80-\u0BFF\u200D\u200C.,'-]+$/ },
    description: { required: true, minLength: 10, maxLength: 500 },
    organizerName: { required: true, minLength: 2, maxLength: 50, pattern: /^[a-zA-Z\s\u0D80-\u0DFF\u0B80-\u0BFF\u200D\u200C.'-]+$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, pattern: /^(\+94|0)?[1-9]\d{8}$/ },
    playgroundType: { required: true, minLength: 3, maxLength: 50, pattern: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u0B80-\u0BFF\u200D\u200C.,'-]+$/ },
    expectedAttendees: { required: true, min: 1, max: 10000 },
    eventDate: { required: true, minDate: true },
    startTime: { required: true },
    endTime: { required: true, afterStartTime: true },
    specialRequirement: { maxLength: 300 }
  };

  const getErrorMessage = (field, type, value) => {
    const m = {
      eventName: { required: 'Event name is required', minLength: `At least ${value} characters required`, maxLength: `Maximum ${value} characters allowed`, pattern: 'Use valid characters only' },
      eventType: { required: 'Event type is required', minLength: `At least ${value} characters required`, maxLength: `Maximum ${value} characters allowed`, pattern: 'Use valid characters only' },
      description: { required: 'Description is required', minLength: `At least ${value} characters required`, maxLength: `Maximum ${value} characters allowed` },
      organizerName: { required: 'Organizer name is required', minLength: `At least ${value} characters required`, maxLength: `Maximum ${value} characters allowed`, pattern: 'Use valid characters only' },
      email: { required: 'Email is required', pattern: 'Enter a valid email address' },
      phone: { required: 'Phone number is required', pattern: 'Enter a valid Sri Lankan number (0771234567 or +94771234567)' },
      playgroundType: { required: 'Playground type is required', minLength: `At least ${value} characters required`, maxLength: `Maximum ${value} characters allowed`, pattern: 'Use valid characters only' },
      expectedAttendees: { required: 'Expected attendees is required', min: `Minimum ${value} required`, max: `Maximum ${value} allowed` },
      eventDate: { required: 'Event date is required', minDate: 'Cannot select a past date' },
      startTime: { required: 'Start time is required' },
      endTime: { required: 'End time is required', afterStartTime: 'End time must be after start time' },
      specialRequirement: { maxLength: `Maximum ${value} characters allowed` }
    };
    return m[field]?.[type] || 'Invalid value';
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && (!value || String(value).trim() === '')) return getErrorMessage(name, 'required');
    if (!value || String(value).trim() === '') return '';

    if (rules.minLength && value.trim().length < rules.minLength) return getErrorMessage(name, 'minLength', rules.minLength);
    if (rules.maxLength && value.trim().length > rules.maxLength) return getErrorMessage(name, 'maxLength', rules.maxLength);
    if (rules.pattern && !rules.pattern.test(value.trim())) return getErrorMessage(name, 'pattern');

    if (rules.min !== undefined) {
      const n = Number(value); if (isNaN(n) || n < rules.min) return getErrorMessage(name, 'min', rules.min);
    }
    if (rules.max !== undefined) {
      const n = Number(value); if (isNaN(n) || n > rules.max) return getErrorMessage(name, 'max', rules.max);
    }

    if (rules.minDate && name === 'eventDate') {
      const selected = new Date(value); const today = new Date(); today.setHours(0,0,0,0);
      if (selected < today) return getErrorMessage(name, 'minDate');
    }
    if (rules.afterStartTime && name === 'endTime') {
      const st = inputs.startTime; if (st && value && parseHHMM(value) <= parseHHMM(st)) return getErrorMessage(name, 'afterStartTime');
    }
    return '';
  };

  const validateAllFields = () => {
    const newErrors = {}; let ok = true;
    Object.keys(inputs).forEach((k) => { const e = validateField(k, inputs[k]); if (e) { newErrors[k] = e; ok = false; } });
    setErrors(newErrors); return ok;
  };

  /* ---------------- Availability (client-side from DB list) ---------------- */
  const keyFor = (dateISO, type) => `${toDateOnly(dateISO)}__${String(type || '').trim().toLowerCase()}`;

  const fetchForKey = async (k, dateISO, type) => {
    try {
      // We keep it simple: get all bookings then filter here
      const res = await axios.get(API_BASE, { withCredentials: true });
      const items = Array.isArray(res.data) ? res.data : (res.data?.items || res.data?.data || res.data?.bookings || []);
      const targetDate = toDateOnly(dateISO);
      const targetType = String(type || '').trim().toLowerCase();
      const filtered = (items || []).filter((b) => {
        const bookedDate = toDateOnly(b.eventDate);
        const bookedType = String(b.playgroundType || '').trim().toLowerCase();
        const status = (b.status || 'Pending').toLowerCase();
        // Block if same date + same type and booking is not rejected
        return bookedDate === targetDate && bookedType === targetType && status !== 'rejected';
      });
      setBookingsCache((prev) => ({ ...prev, [k]: filtered }));
      return filtered;
    } catch (e) {
      console.error('Availability fetch failed:', e);
      setBookingsCache((prev) => ({ ...prev, [k]: [] }));
      return [];
    }
  };

  const checkAgainstCached = (dateISO, start, end, type) => {
    const k = keyFor(dateISO, type);
    const list = bookingsCache[k] || [];
    const aStart = parseHHMM(start); const aEnd = parseHHMM(end);
    if (isNaN(aStart) || isNaN(aEnd)) return { available: false, conflictDetails: 'Invalid time' };

    for (const b of list) {
      const bStart = parseHHMM(b.startTime);
      const bEnd = parseHHMM(b.endTime);
      if (isNaN(bStart) || isNaN(bEnd)) continue;
      if (overlaps(aStart, aEnd, bStart, bEnd)) {
        return {
          available: false,
          conflictDetails: `${b.startTime} - ${b.endTime} (${b.eventName || 'Booking'})`
        };
      }
    }
    return { available: true };
  };

  const shouldCheck = useMemo(() => {
    const dateOk = inputs.eventDate && !validateField('eventDate', inputs.eventDate);
    const startOk = inputs.startTime && !validateField('startTime', inputs.startTime);
    const endOk = inputs.endTime && !validateField('endTime', inputs.endTime);
    const typeOk = inputs.playgroundType && !validateField('playgroundType', inputs.playgroundType);
    return dateOk && startOk && endOk && typeOk;
  }, [inputs.eventDate, inputs.startTime, inputs.endTime, inputs.playgroundType]);

  const debounceRef = useRef(null);
  useEffect(() => {
    if (!shouldCheck) { setAvailabilityStatus('idle'); setBookingConflict(null); return; }
    const { eventDate, startTime, endTime, playgroundType } = inputs;
    const k = keyFor(eventDate, playgroundType);

    setAvailabilityStatus('checking');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const list = bookingsCache[k] || await fetchForKey(k, eventDate, playgroundType);
      const result = checkAgainstCached(eventDate, startTime, endTime, playgroundType);
      if (result.available) { setAvailabilityStatus('available'); setBookingConflict(null); }
      else { setAvailabilityStatus('conflict'); setBookingConflict({ message: 'The selected time is already booked.', conflictDetails: result.conflictDetails }); }
    }, 300);

    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [shouldCheck, inputs.eventDate, inputs.startTime, inputs.endTime, inputs.playgroundType]);

  /* ---------------- Handlers ---------------- */
  const handleChatbotRedirect = () => history('/chatbot');
  const handleCloseChatbotNotification = () => setShowChatbotNotification(false);

  const handleChange = (e) => {
    const { name, value } = e.target; const rules = validationRules[name];
    let newValue = value;
    if (rules?.maxLength && value.length > rules.maxLength) newValue = value.substring(0, rules.maxLength);
    if (name === 'expectedAttendees') {
      newValue = newValue.replace(/[^0-9]/g, '');
      if (newValue.length > 5) newValue = newValue.substring(0, 5);
      if (parseInt(newValue) > 10000) newValue = '10000';
    }
    if (name === 'phone') {
      newValue = newValue.replace(/[^\d+]/g, '');
      if (newValue.startsWith('+94')) { if (newValue.length > 12) newValue = newValue.substring(0, 12); }
      else if (newValue.startsWith('0')) { if (newValue.length > 10) newValue = newValue.substring(0, 10); }
      else { if (newValue.length > 9) newValue = newValue.substring(0, 9); }
    }
    setInputs((p) => ({ ...p, [name]: newValue }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validateField(name, newValue) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target; setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const sendRequest = async () => {
    const response = await axios.post(API_BASE, { ...inputs, expectedAttendees: Number(inputs.expectedAttendees) }, { withCredentials: true });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = {}; Object.keys(inputs).forEach(k => allTouched[k] = true); setTouched(allTouched);
    if (!validateAllFields()) return;

    // final local conflict check using cached list
    const k = keyFor(inputs.eventDate, inputs.playgroundType);
    if (!bookingsCache[k]) await fetchForKey(k, inputs.eventDate, inputs.playgroundType);
    const finalCheck = checkAgainstCached(inputs.eventDate, inputs.startTime, inputs.endTime, inputs.playgroundType);
    if (!finalCheck.available) {
      setAvailabilityStatus('conflict');
      setBookingConflict({ message: 'The selected time is already booked.', conflictDetails: finalCheck.conflictDetails });
      return;
    }

    setIsSubmitting(true); setSubmitStatus(null);
    try {
      await sendRequest();
      setSubmitStatus('success'); setAvailabilityStatus('available');
      setTimeout(() => history('/userdetails'), 1800);
    } catch (error) {
      if (error?.response?.status === 401) { history('/log', { state: { alert: 'Please log in to continue.' } }); return; }
      setSubmitStatus('error'); setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setInputs({ eventName: "", eventType: "", description: "", organizerName: "", email: "", phone: "", playgroundType: "", expectedAttendees: "", eventDate: "", startTime: "", endTime: "", specialRequirement: "" });
    setErrors({}); setTouched({}); setSubmitStatus(null); setIsSubmitting(false); setBookingConflict(null); setAvailabilityStatus('idle');
  };

  /* ---------------- UI helpers ---------------- */
  const getInputClasses = (fieldName) => {
    const base = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors";
    const err = "border-red-500 focus:ring-red-200 bg-red-50";
    const ok = "border-gray-300 focus:ring-[#8B0000]";
    return `${base} ${errors[fieldName] ? err : ok}`;
  };

  const renderError = (fieldName) => {
    const rules = validationRules[fieldName];
    const currentValue = inputs[fieldName] || '';
    const hasError = errors[fieldName] && touched[fieldName];
    const isNearLimit = rules?.maxLength && currentValue.length > rules.maxLength * 0.8;
    return (
      <div className="mt-1">
        {hasError && (
          <div className="flex items-center text-red-600 text-sm"><AlertCircle className="h-4 w-4 mr-1" />{errors[fieldName]}</div>
        )}
        {rules?.maxLength && (
          <div className={`text-xs mt-1 ${currentValue.length >= rules.maxLength ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'}`}>
            {currentValue.length}/{rules.maxLength} characters
            {currentValue.length >= rules.maxLength && (<span className="ml-2 font-semibold">Character limit reached!</span>)}
          </div>
        )}
        {fieldName === 'expectedAttendees' && (
          <div className={`text-xs mt-1 ${parseInt(currentValue) >= 10000 ? 'text-red-600' : parseInt(currentValue) > 8000 ? 'text-yellow-600' : 'text-gray-500'}`}>
            {currentValue ? parseInt(currentValue).toLocaleString() : '0'}/10,000 max attendees
            {parseInt(currentValue) >= 10000 && (<span className="ml-2 font-semibold">Maximum limit reached!</span>)}
          </div>
        )}
        {fieldName === 'phone' && !hasError && (<div className="text-xs mt-1 text-gray-500">Format: 0771234567 or +94771234567</div>)}
      </div>
    );
  };

  const AvailabilityBadge = () => {
    if (availabilityStatus === 'idle') return null;
    if (availabilityStatus === 'checking') return (
      <div className="flex items-center text-sm text-gray-600">
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        Checking...
      </div>
    );
    if (availabilityStatus === 'available') return (<div className="flex items-center text-green-700 text-sm"><CheckCircle2 className="h-4 w-4 mr-1"/> Time is available</div>);
    return (<div className="flex items-center text-red-700 text-sm"><XCircle className="h-4 w-4 mr-1"/> Time is not available</div>);
  };

  const submitDisabled = useMemo(() => {
    const hasErrors = Object.values(errors).some(Boolean);
    return isSubmitting || submitStatus === 'success' || hasErrors || availabilityStatus === 'conflict' || availabilityStatus === 'checking';
  }, [errors, isSubmitting, submitStatus, availabilityStatus]);

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      {/* Chatbot Notification */}
      {showChatbotNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-4 text-white transform animate-slide-in-right">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0"><MessageCircle className="h-6 w-6 text-white" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">New!</h3>
                  <p className="text-sm opacity-90 mt-1">Use our AI Chatbot for a smoother booking experience</p>
                  <div className="mt-3 flex space-x-2">
                    <button onClick={handleChatbotRedirect} className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium hover:bg-white/30 transition-all duration-200">
                      Try the Chatbot
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={handleCloseChatbotNotification} className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-white/20 transition-colors duration-200" aria-label="Close notification">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="rounded-t-xl px-8 py-6" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
          <h1 className="text-3xl font-bold flex items-center gap-3"><MapPin className="h-8 w-8 text-white" />Playground Booking Form</h1>
          <p className="text-white mt-2">Reserve our playgrounds for your event</p>
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-b-none">
            <div className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><strong>Success!</strong> Booking submitted successfully.</div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-b-none">
            <div className="flex items-center justify-between"><div className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg><strong>Error!</strong> Something went wrong. Please try again.</div><button onClick={() => setSubmitStatus(null)} className="text-red-700 hover:text-red-900">✕</button></div>
          </div>
        )}

        {bookingConflict && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-b-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <div><strong>Booking conflict!</strong> {bookingConflict.message}<br /><span className="text-sm">Conflicting slot: {bookingConflict.conflictDetails}</span></div>
              </div>
              <button onClick={() => setBookingConflict(null)} className="text-yellow-700 hover:text-yellow-900">✕</button>
            </div>
          </div>
        )}

        <div className={`bg-white shadow-lg p-8 ${submitStatus ? 'rounded-t-none' : 'rounded-b-xl'}`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2"><FileText className="h-6 w-6 text-[#8B0000]" />Event Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                <input type="text" name="eventName" placeholder="Enter event name" maxLength="100" className={getInputClasses('eventName')} onChange={handleChange} onBlur={handleBlur} value={inputs.eventName} disabled={isSubmitting} />
                {renderError('eventName')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                <input type="text" name="eventType" placeholder="Enter event type" maxLength="50" className={getInputClasses('eventType')} onChange={handleChange} onBlur={handleBlur} value={inputs.eventType} disabled={isSubmitting} />
                {renderError('eventType')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" placeholder="Describe your event..." rows="3" maxLength="500" className={getInputClasses('description')} onChange={handleChange} onBlur={handleBlur} value={inputs.description} disabled={isSubmitting} />
                {renderError('description')}
              </div>
            </div>

            {/* Organizer */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2"><User className="h-6 w-6 text-[#8B0000]" />Organizer Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Name *</label>
                <input type="text" name="organizerName" placeholder="Enter organizer name" maxLength="50" className={getInputClasses('organizerName')} onChange={handleChange} onBlur={handleBlur} value={inputs.organizerName} disabled={isSubmitting} />
                {renderError('organizerName')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" placeholder="Enter email" className={getInputClasses('email')} onChange={handleChange} onBlur={handleBlur} value={inputs.email} disabled={isSubmitting} />
                {renderError('email')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" name="phone" placeholder="Phone number (0771234567)" className={getInputClasses('phone')} onChange={handleChange} onBlur={handleBlur} value={inputs.phone} disabled={isSubmitting} />
                {renderError('phone')}
              </div>
            </div>

            {/* Booking details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2"><MapPin className="h-6 w-6 text-[#8B0000]" />Booking Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Playground Type *</label>
                <input type="text" name="playgroundType" placeholder="Enter playground type" maxLength="50" className={getInputClasses('playgroundType')} onChange={handleChange} onBlur={handleBlur} value={inputs.playgroundType} disabled={isSubmitting} />
                {renderError('playgroundType')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendees *</label>
                <input type="number" name="expectedAttendees" placeholder="Number of attendees" min="1" max="10000" className={getInputClasses('expectedAttendees')} onChange={handleChange} onBlur={handleBlur} value={inputs.expectedAttendees} disabled={isSubmitting} />
                {renderError('expectedAttendees')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input type="date" name="eventDate" min={new Date().toISOString().split('T')[0]} className={getInputClasses('eventDate')} onChange={handleChange} onBlur={handleBlur} value={inputs.eventDate} disabled={isSubmitting} />
                {renderError('eventDate')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <input type="time" name="startTime" className={getInputClasses('startTime')} onChange={handleChange} onBlur={handleBlur} value={inputs.startTime} disabled={isSubmitting} />
                  {renderError('startTime')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                  <input type="time" name="endTime" className={getInputClasses('endTime')} onChange={handleChange} onBlur={handleBlur} value={inputs.endTime} disabled={isSubmitting} />
                  {renderError('endTime')}
                </div>
              </div>

              <div className="pt-2"><AvailabilityBadge />{availabilityStatus === 'conflict' && (<p className="text-xs text-red-700 mt-1">Please choose another time or date.</p>)}</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea name="specialRequirement" placeholder="Enter any special requirements..." rows="3" maxLength="300" className={getInputClasses('specialRequirement')} onChange={handleChange} onBlur={handleBlur} value={inputs.specialRequirement} disabled={isSubmitting} />
                {renderError('specialRequirement')}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button type="submit" disabled={submitDisabled} className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${submitDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-[#8B0000] text-white hover:bg-red-950'}`}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Submitting...
                  </span>
                ) : submitStatus === 'success' ? 'Submitted Successfully!' : 'Submit Booking'}
              </button>

              {submitStatus === 'success' && (
                <div className="flex gap-2">
                  <button type="button" onClick={resetForm} className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors">New Booking</button>
                  <button type="button" onClick={() => history('/displaybooking')} className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">View Bookings</button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default AddUser;