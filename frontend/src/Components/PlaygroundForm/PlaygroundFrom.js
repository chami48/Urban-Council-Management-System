import React, { useState } from 'react';
import Nav from "../Nav/Nav";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FileText, User, MapPin } from 'lucide-react';

const API_BASE = "http://localhost:5000/playgrounds";

function AddUser() {
  const history = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

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

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await sendRequest();
      setSubmitStatus('success');
      
      // Show success message for 2 seconds before navigating
      setTimeout(() => {
        history('/userdetails');
      }, 2000);
      
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const sendRequest = async () => {
    const response = await axios.post(API_BASE, {
      ...inputs,
      expectedAttendees: Number(inputs.expectedAttendees),
    });
    return response;
  };

  // Reset form after successful submission
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
    setSubmitStatus(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

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
                <label className="block text-sm font-medium text-gray-700 mb-2">උත්සවයේ නම *</label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="උත්සවයේ නම ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.eventName}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">උත්සව වර්ගය *</label>
                <input
                  type="text"
                  name="eventType"
                  placeholder="උත්සව වර්ගය ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.eventType}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">විස්තරය</label>
                <textarea
                  name="description"
                  placeholder="ඔබගේ උත්සවය විස්තර කරන්න..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.description}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Organizer Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
                <User className="h-6 w-6 text-[#8B0000]" />
                සංවිධායක තොරතුරු
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">සංවිධායක නම *</label>
                <input
                  type="text"
                  name="organizerName"
                  placeholder="සංවිධායක නම ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.organizerName}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">විද්‍යුත් තැපෑල *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="විද්‍යුත් තැපෑල ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.email}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">දුරකථන අංකය *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="දුරකථන අංකය ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.phone}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Booking Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
                <MapPin className="h-6 w-6 text-[#8B0000]" />
                වෙන්කිරීම් විස්තර
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ක්‍රීඩාංගන වර්ගය *</label>
                <input
                  type="text"
                  name="playgroundType"
                  placeholder="ක්‍රීඩාංගන වර්ගය ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.playgroundType}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">අපේක්ෂිත සහභාගීවන්නන් *</label>
                <input
                  type="number"
                  name="expectedAttendees"
                  placeholder="සහභාගීවන්නන් ගණන"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.expectedAttendees}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">උත්සව දිනය *</label>
                <input
                  type="date"
                  name="eventDate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.eventDate}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ආරම්භ වේලාව *</label>
                  <input
                    type="time"
                    name="startTime"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    onChange={handleChange}
                    value={inputs.startTime}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">අවසන් වේලාව *</label>
                  <input
                    type="time"
                    name="endTime"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    onChange={handleChange}
                    value={inputs.endTime}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">විශේෂ අවශ්‍යතා</label>
                <textarea
                  name="specialRequirement"
                  placeholder="විශේෂ අවශ්‍යතා ඇතුළත් කරන්න..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange}
                  value={inputs.specialRequirement}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting || submitStatus === 'success'
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
                    onClick={() => history('/userdetails')}
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
    </div>
  );
}

export default AddUser;