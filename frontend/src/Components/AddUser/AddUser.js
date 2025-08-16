import React, { useState } from 'react';
import Nav from "../Nav/Nav";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FileText, User, MapPin } from 'lucide-react';

function AddUser() {
  const history = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history('/userdetails'));
  };

  const sendRequest = async () => {
    try {
      await axios.post("http://localhost:5000/users", {
        ...inputs,
        expectedAttendees: Number(inputs.expectedAttendees),
      });
      alert("වෙන්කිරීම සාර්ථකව යැවියි!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("යමක් වැරදී ඇත. කරුණාකර ඔබේ backend සේවාදායකය පරික්ෂා කරන්න.");
    }
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

        {/* Form Container */}
        <div className="bg-white rounded-b-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Event Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#8B0000]" />
                උත්සව තොරතුරු
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">උත්සවයේ නම *</label>
                <input type="text" name="eventName" placeholder="උත්සවයේ නම ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.eventName} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">උත්සව වර්ගය *</label>
                <input type="text" name="eventType" placeholder="උත්සව වර්ගය ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.eventType} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">විස්තරය</label>
                <textarea name="description" placeholder="ඔබගේ උත්සවය විස්තර කරන්න..." rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.description} required />
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
                <input type="text" name="organizerName" placeholder="සංවිධායක නම ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.organizerName} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">විද්‍යුත් තැපෑල *</label>
                <input type="email" name="email" placeholder="විද්‍යුත් තැපෑල ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.email} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">දුරකථන අංකය *</label>
                <input type="tel" name="phone" placeholder="දුරකථන අංකය ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.phone} required />
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
                <input type="text" name="playgroundType" placeholder="ක්‍රීඩාංගන වර්ගය ඇතුළත් කරන්න"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.playgroundType} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">අපේක්ෂිත සහභාගීවන්නන් *</label>
                <input type="number" name="expectedAttendees" placeholder="සහභාගීවන්නන් ගණන"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.expectedAttendees} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">උත්සව දිනය *</label>
                <input type="date" name="eventDate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.eventDate} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ආරම්භ වේලාව *</label>
                  <input type="time" name="startTime"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    onChange={handleChange} value={inputs.startTime} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">අවසන් වේලාව *</label>
                  <input type="time" name="endTime"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                    onChange={handleChange} value={inputs.endTime} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">විශේෂ අවශ්‍යතා</label>
                <textarea name="specialRequirement" placeholder="විශේෂ අවශ්‍යතා ඇතුළත් කරන්න..." rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
                  onChange={handleChange} value={inputs.specialRequirement} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit"
                className="w-full bg-[#8B0000] text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-red-950 transition-colors">
                වෙන්කිරීම ඉදිරිපත් කරන්න
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
