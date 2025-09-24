import React, { useState } from 'react';
import Nav from "../Nav/Nav";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, User, MapPin, AlertCircle, X, MessageCircle, ArrowRight } from 'lucide-react';

const API_BASE = "http://localhost:5000/playgrounds";

function AddUser() {
  const history = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showChatbotNotification, setShowChatbotNotification] = useState(true);
  const [bookingConflict, setBookingConflict] = useState(null);

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

  // Validation rules
  const validationRules = {
    eventName: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u200D\u200C.,'-]+$/
    },
    eventType: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u200D\u200C.,'-]+$/
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    organizerName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\u0D80-\u0DFF\u200D\u200C.'-]+$/
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      required: true,
      pattern: /^(\+94|0)?[1-9]\d{8}$/
    },
    playgroundType: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u200D\u200C.,'-]+$/
    },
    expectedAttendees: {
      required: true,
      min: 1,
      max: 10000
    },
    eventDate: {
      required: true,
      minDate: true
    },
    startTime: {
      required: true
    },
    endTime: {
      required: true,
      afterStartTime: true
    },
    specialRequirement: {
      maxLength: 300
    }
  };

  // Check for booking conflicts
  const checkBookingConflicts = async (eventDate, startTime, endTime, playgroundType) => {
    try {
      const response = await axios.get(`${API_BASE}/check-availability`, {
        params: {
          date: eventDate,
          startTime: startTime,
          endTime: endTime,
          playgroundType: playgroundType
        },
        withCredentials: true
      });
      
      return response.data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return true; // Assume available if check fails
    }
  };
  const handleChatbotRedirect = () => {
    history('/chatbot');
  };

  // Close chatbot notification
  const handleCloseChatbotNotification = () => {
    setShowChatbotNotification(false);
  };

  // Validation functions
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && (!value || value.trim() === '')) {
      return getErrorMessage(name, 'required');
    }

    if (!value || value.trim() === '') return '';

    if (rules.minLength && value.trim().length < rules.minLength) {
      return getErrorMessage(name, 'minLength', rules.minLength);
    }

    if (rules.maxLength && value.trim().length > rules.maxLength) {
      return getErrorMessage(name, 'maxLength', rules.maxLength);
    }

    if (rules.pattern && !rules.pattern.test(value.trim())) {
      return getErrorMessage(name, 'pattern');
    }

    if (rules.min !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < rules.min) {
        return getErrorMessage(name, 'min', rules.min);
      }
    }

    if (rules.max !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue > rules.max) {
        return getErrorMessage(name, 'max', rules.max);
      }
    }

    if (rules.minDate && name === 'eventDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return getErrorMessage(name, 'minDate');
      }
    }

    if (rules.afterStartTime && name === 'endTime') {
      const startTime = inputs.startTime;
      if (startTime && value && value <= startTime) {
        return getErrorMessage(name, 'afterStartTime');
      }
    }

    return '';
  };

  const getErrorMessage = (field, type, value) => {
    const messages = {
      eventName: {
        required: 'උත්සවයේ නම අනිවාර්ය වේ',
        minLength: `අවම වශයෙන් අක්ෂර ${value}ක් අවශ්‍ය වේ`,
        maxLength: `උපරිම අක්ෂර ${value}ක් පමණක් ඉඩ දේ`,
        pattern: 'නම සඳහා වලංගු අක්ෂර පමණක් භාවිතා කරන්න'
      },
      eventType: {
        required: 'උත්සව වර්ගය අනිවාර්ය වේ',
        minLength: `අවම වශයෙන් අක්ෂර ${value}ක් අවශ්‍ය වේ`,
        maxLength: `උපරිම අක්ෂර ${value}ක් පමණක් ඉඩ දේ`,
        pattern: 'වර්ගය සඳහා වලංගු අක්ෂර පමණක් භාවිතා කරන්න'
      },
      description: {
        required: 'විස්තරය අනිවාර්ය වේ',
        minLength: `අවම වශයෙන් අක්ෂර ${value}ක් අවශ්‍ය වේ`,
        maxLength: `උපරිම අක්ෂර ${value}ක් පමණක් ඉඩ දේ`
      },
      organizerName: {
        required: 'සංවිධායක නම අනිවාර්ය වේ',
        minLength: `අවම වශයෙන් අක්ෂර ${value}ක් අවශ්‍ය වේ`,
        maxLength: `උපරිම අක්ෂර ${value}ක් පමණක් ඉඩ දේ`,
        pattern: 'නම සඳහා වලංගු අක්ෂර පමණක් භාවිතා කරන්න'
      },
      email: {
        required: 'විද්‍යුත් තැපෑල අනිවාර්ය වේ',
        pattern: 'වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න'
      },
      phone: {
        required: 'දුරකථන අංකය අනිවාර්ය වේ',
        pattern: 'වලංගු ශ්‍රී ලාංකික දුරකථන අංකයක් ඇතුළත් කරන්න (0771234567 හෝ +94771234567)'
      },
      playgroundType: {
        required: 'ක්‍රීඩාංගන වර්ගය අනිවාර්ය වේ',
        minLength: `අවම වශයෙන් අක්ෂර ${value}ක් අවශ්‍ය වේ`,
        maxLength: `උපරිම අක්ෂර ${value}ක් පමණක් ඉඩ දේ`,
        pattern: 'වර්ගය සඳහා වලංගු අක්ෂර පමණක් භාවිතා කරන්න'
      },
      expectedAttendees: {
        required: 'අපේක්ෂිත සහභාගීවන්නන් සංඛ්‍යාව අනිවාර්ය වේ',
        min: `අවම වශයෙන් ${value} සහභාගීවන්නෙක් අවශ්‍ය වේ`,
        max: `උපරිම ${value} සහභාගීවන්නන් පමණක් ඉඩ දේ`
      },
      eventDate: {
        required: 'උත්සව දිනය අනිවාර්ය වේ',
        minDate: 'අද දිනයට පෙර දිනයක් තෝරා ගත නොහැක'
      },
      startTime: {
        required: 'ආරම්භ වේලාව අනිවාර්ය වේ'
      },
      endTime: {
        required: 'අවසන් වේලාව අනිවාර්ය වේ',
        afterStartTime: 'අවසන් වේලාව ආරම්භ වේලාවට වඩා පසුව සිටිය යුතුය'
      },
      specialRequirement: {
        maxLength: `උපරිම අක්ෂර ${value}ක් පමණක් ඉඩ දේ`
      }
    };

    return messages[field]?.[type] || 'වලංගු නොවන අගයක්';
  };

  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(inputs).forEach(name => {
      const error = validateField(name, inputs[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const rules = validationRules[name];
    
    let newValue = value;
    
    if (rules?.maxLength && value.length > rules.maxLength) {
      newValue = value.substring(0, rules.maxLength);
    }
    
    if (name === 'expectedAttendees') {
      newValue = newValue.replace(/[^0-9]/g, '');
      if (newValue.length > 5) {
        newValue = newValue.substring(0, 5);
      }
      if (parseInt(newValue) > 10000) {
        newValue = '10000';
      }
    }
    
    if (name === 'phone') {
      newValue = newValue.replace(/[^\d+]/g, '');
      if (newValue.startsWith('+94')) {
        if (newValue.length > 12) {
          newValue = newValue.substring(0, 12);
        }
      } else if (newValue.startsWith('0')) {
        if (newValue.length > 10) {
          newValue = newValue.substring(0, 10);
        }
      } else {
        if (newValue.length > 9) {
          newValue = newValue.substring(0, 9);
        }
      }
    }
    
    setInputs((prevState) => ({
      ...prevState,
      [name]: newValue
    }));

    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(inputs).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await sendRequest();
      setSubmitStatus('success');
      
      setTimeout(() => {
        history('/userdetails');
      }, 2000);
      
    } catch (error) {
      if (error?.response?.status === 401) {
        history('/log', { state: { alert: 'Please log in to continue.' } });
        return;
      }

      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const sendRequest = async () => {
    const response = await axios.post(
      API_BASE,
      {
        ...inputs,
        expectedAttendees: Number(inputs.expectedAttendees),
      },
      {
        withCredentials: true,
      }
    );

    return response;
  };

  const resetForm = () => {
    setInputs({
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
    setErrors({});
    setTouched({});
    setSubmitStatus(null);
    setIsSubmitting(false);
    setBookingConflict(null);
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors";
    const errorClasses = "border-red-500 focus:ring-red-200 bg-red-50";
    const normalClasses = "border-gray-300 focus:ring-[#8B0000]";
    
    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  const renderError = (fieldName) => {
    const rules = validationRules[fieldName];
    const currentValue = inputs[fieldName] || '';
    const hasError = errors[fieldName] && touched[fieldName];
    const isNearLimit = rules?.maxLength && currentValue.length > rules.maxLength * 0.8;
    
    return (
      <div className="mt-1">
        {hasError && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors[fieldName]}
          </div>
        )}
        
        {rules?.maxLength && (
          <div className={`text-xs mt-1 ${
            currentValue.length >= rules.maxLength 
              ? 'text-red-600' 
              : isNearLimit 
                ? 'text-yellow-600' 
                : 'text-gray-500'
          }`}>
            {currentValue.length}/{rules.maxLength} characters
            {currentValue.length >= rules.maxLength && (
              <span className="ml-2 font-semibold">Character limit reached!</span>
            )}
          </div>
        )}
        
        {fieldName === 'expectedAttendees' && (
          <div className={`text-xs mt-1 ${
            parseInt(currentValue) >= 10000 
              ? 'text-red-600' 
              : parseInt(currentValue) > 8000
                ? 'text-yellow-600' 
                : 'text-gray-500'
          }`}>
            {currentValue ? parseInt(currentValue).toLocaleString() : '0'}/10,000 max attendees
            {parseInt(currentValue) >= 10000 && (
              <span className="ml-2 font-semibold">Maximum limit reached!</span>
            )}
          </div>
        )}
        
        {fieldName === 'phone' && !hasError && (
          <div className="text-xs mt-1 text-gray-500">
            Format: 0771234567 or +94771234567
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      {/* Chatbot Notification */}
      {showChatbotNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-4 text-white transform animate-slide-in-right">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">නව අංගයක්!</h3>
                  <p className="text-sm opacity-90 mt-1">
                    අපගේ AI Chatbot භාවිතා කරන්න වඩාත් පහසුව සඳහා
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={handleChatbotRedirect}
                      className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium hover:bg-white/30 transition-all duration-200"
                    >
                      Chatbot අත්හදා බලන්න
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseChatbotNotification}
                className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-white/20 transition-colors duration-200"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="rounded-t-xl px-8 py-6" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MapPin className="h-8 w-8 text-white" />
            ක්‍රීඩාංගන වෙන්කිරීම් පෝරමය
          </h1>
          <p className="text-white mt-2">ඔබගේ උත්සවය සඳහා අපගේ ක්‍රීඩාංගන වෙන්කරන්න</p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-b-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <strong>සාර්ථකයි!</strong> වෙන්කිරීම සාර්ථකව යවා ඇත. ඔබව වෙන්කිරීම් ලැයිස්තුවට යොමු කරමින්...
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-b-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <strong>දෝෂයක්!</strong> යමක් වැරදී ඇත. කරුණාකර නැවත උත්සාහ කරන්න.
              </div>
              <button 
                onClick={() => setSubmitStatus(null)}
                className="text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Booking Conflict Message */}
        {bookingConflict && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-b-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong>වෙන්කිරීම් ගැටුමක්!</strong> {bookingConflict.message}
                  <br />
                  <span className="text-sm">ගැටුම් වේලාව: {bookingConflict.conflictDetails}</span>
                </div>
              </div>
              <button 
                onClick={() => setBookingConflict(null)}
                className="text-yellow-700 hover:text-yellow-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className={`bg-white shadow-lg p-8 ${submitStatus ? 'rounded-t-none' : 'rounded-b-xl'}`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#8B0000]" />
                උත්සව තොරතුරු
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  උත්සවයේ නම *
                </label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="උත්සවයේ නම ඇතුළත් කරන්න"
                  maxLength="100"
                  className={getInputClasses('eventName')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.eventName}
                  disabled={isSubmitting}
                />
                {renderError('eventName')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  උත්සව වර්ගය *
                </label>
                <input
                  type="text"
                  name="eventType"
                  placeholder="උත්සව වර්ගය ඇතුළත් කරන්න"
                  maxLength="50"
                  className={getInputClasses('eventType')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.eventType}
                  disabled={isSubmitting}
                />
                {renderError('eventType')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  විස්තරය *
                </label>
                <textarea
                  name="description"
                  placeholder="ඔබගේ උත්සවය විස්තර කරන්න..."
                  rows="3"
                  maxLength="500"
                  className={getInputClasses('description')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.description}
                  disabled={isSubmitting}
                />
                {renderError('description')}
              </div>
            </div>

            {/* Organizer Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
                <User className="h-6 w-6 text-[#8B0000]" />
                සංවිධායක තොරතුරු
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  සංවිධායක නම *
                </label>
                <input
                  type="text"
                  name="organizerName"
                  placeholder="සංවිධායක නම ඇතුළත් කරන්න"
                  maxLength="50"
                  className={getInputClasses('organizerName')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.organizerName}
                  disabled={isSubmitting}
                />
                {renderError('organizerName')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  විද්‍යුත් තැපෑල *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="විද්‍යුත් තැපෑල ඇතුළත් කරන්න"
                  className={getInputClasses('email')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.email}
                  disabled={isSubmitting}
                />
                {renderError('email')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  දුරකථන අංකය *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="දුරකථන අංකය ඇතුළත් කරන්න (0771234567)"
                  className={getInputClasses('phone')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.phone}
                  disabled={isSubmitting}
                />
                {renderError('phone')}
              </div>
            </div>

            {/* Booking Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
                <MapPin className="h-6 w-6 text-[#8B0000]" />
                වෙන්කිරීම් විස්තර
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ක්‍රීඩාංගන වර්ගය *
                </label>
                <input
                  type="text"
                  name="playgroundType"
                  placeholder="ක්‍රීඩාංගන වර්ගය ඇතුළත් කරන්න"
                  maxLength="50"
                  className={getInputClasses('playgroundType')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.playgroundType}
                  disabled={isSubmitting}
                />
                {renderError('playgroundType')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  අපේක්ෂිත සහභාගීවන්නන් *
                </label>
                <input
                  type="number"
                  name="expectedAttendees"
                  placeholder="සහභාගීවන්නන් ගණන"
                  min="1"
                  max="10000"
                  className={getInputClasses('expectedAttendees')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.expectedAttendees}
                  disabled={isSubmitting}
                />
                {renderError('expectedAttendees')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  උත්සව දිනය *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  min={new Date().toISOString().split('T')[0]}
                  className={getInputClasses('eventDate')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.eventDate}
                  disabled={isSubmitting}
                />
                {renderError('eventDate')}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ආරම්භ වේලාව *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    className={getInputClasses('startTime')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={inputs.startTime}
                    disabled={isSubmitting}
                  />
                  {renderError('startTime')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    අවසන් වේලාව *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    className={getInputClasses('endTime')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={inputs.endTime}
                    disabled={isSubmitting}
                  />
                  {renderError('endTime')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  විශේෂ අවශ්‍යතා
                </label>
                <textarea
                  name="specialRequirement"
                  placeholder="විශේෂ අවශ්‍යතා ඇතුළත් කරන්න..."
                  rows="3"
                  maxLength="300"
                  className={getInputClasses('specialRequirement')}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={inputs.specialRequirement}
                  disabled={isSubmitting}
                />
                {renderError('specialRequirement')}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success' || Object.keys(errors).some(key => errors[key])}
                className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting || submitStatus === 'success' || Object.keys(errors).some(key => errors[key])
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-[#8B0000] text-white hover:bg-red-950'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    ඉදිරිපත් කරමින්...
                  </span>
                ) : submitStatus === 'success' ? (
                  'සාර්ථකව ඉදිරිපත් විය!'
                ) : (
                  'වෙන්කිරීම ඉදිරිපත් කරන්න'
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    නව වෙන්කිරීමක් කරන්න
                  </button>
                  <button
                    type="button"
                    onClick={() => history('/displaybooking')}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    වෙන්කිරීම් බලන්න
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AddUser;