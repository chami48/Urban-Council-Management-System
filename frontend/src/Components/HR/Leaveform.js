import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navigation from '../Navigation/Navigation';

const Leaveform = () => {
  const [leave, setleave] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  // Language state
  const [language, setLanguage] = useState('en'); // 'en' for English, 'si' for Sinhala, 'ta' for Tamil

  const navigate = useNavigate();

  // Language translations
  const translations = {
    en: {
      title: "Employee Leave Application",
      subtitle: "Submit your leave request for approval",
      employeeId: "Employee ID",
      leaveType: "Leave Type",
      startDate: "Start Date",
      endDate: "End Date",
      reason: "Reason",
      submit: "Submit",
      selectLeaveType: "Select Leave Type",
      enterEmployeeId: "Enter the employee ID",
      provideReason: "Please provide the reason for leave",
      characters: "0/500 characters",
      leaveTypes: {
        sick: "Sick",
        casual: "Casual",
        earned: "Earned",
        maternity: "Maternity",
        paternity: "Paternity",
        unpaid: "Unpaid"
      },
      successTitle: "Success!",
      successText: "Leave application submitted successfully!",
      errorTitle: "Error!",
      errorText: "Leave application submission failed. Please try again.",
      tryAgain: "Try Again",
      footer: "Please check your connection and try again"
    },
    si: {
      title: "සේවක නිවාඩු අයදුම්පත",
      subtitle: "අනුමැතිය සඳහා ඔබේ නිවාඩු ඉල්ලීම ඉදිරිපත් කරන්න",
      employeeId: "සේවක අංකය",
      leaveType: "නිවාඩු වර්ගය",
      startDate: "ආරම්භක දිනය",
      endDate: "අවසාන දිනය",
      reason: "හේතුව",
      submit: "ඉදිරිපත් කරන්න",
      selectLeaveType: "නිවාඩු වර්ගය තෝරන්න",
      enterEmployeeId: "සේවක අංකය ඇතුළත් කරන්න",
      provideReason: "කරුණාකර නිවාඩු සඳහා හේතුව සපයන්න",
      characters: "අක්ෂර 0/500",
      leaveTypes: {
        sick: "රෝගී",
        casual: "අනියම්",
        earned: "උපයාගත්",
        maternity: "මාතෘ",
        paternity: "පිතෘ",
        unpaid: "නොගෙවූ"
      },
      successTitle: "සාර්ථකයි!",
      successText: "නිවාඩු අයදුම්පත සාර්ථකව ඉදිරිපත් කරන ලදී!",
      errorTitle: "දෝෂයක්!",
      errorText: "නිවාඩු අයදුම්පත ඉදිරිපත් කිරීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      tryAgain: "නැවත උත්සාහ කරන්න",
      footer: "කරුණාකර ඔබේ සම්බන්ධතාව පරීක්ෂා කර නැවත උත්සාහ කරන්න"
    },
    ta: {
      title: "பணியாளர் விடுப்பு விண்ணப்பம்",
      subtitle: "அங்கீகாரத்திற்காக உங்கள் விடுப்பு கோரிக்கையை சமர்ப்பிக்கவும்",
      employeeId: "பணியாளர் எண்",
      leaveType: "விடுப்பு வகை",
      startDate: "தொடக்க தேதி",
      endDate: "முடிவு தேதி",
      reason: "காரணம்",
      submit: "சமர்ப்பிக்கவும்",
      selectLeaveType: "விடுப்பு வகையை தேர்ந்தெடுக்கவும்",
      enterEmployeeId: "பணியாளர் எண்ணை உள்ளிடவும்",
      provideReason: "தயவுசெய்து விடுப்பிற்கான காரணத்தை வழங்கவும்",
      characters: "0/500 எழுத்துக்கள்",
      leaveTypes: {
        sick: "நோய்",
        casual: "சாதாரண",
        earned: "சம்பாதித்த",
        maternity: "மகப்பேறு",
        paternity: "தந்தைவழி",
        unpaid: "ஊதியம் இல்லாத"
      },
      successTitle: "வெற்றி!",
      successText: "விடுப்பு விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      errorTitle: "பிழை!",
      errorText: "விடுப்பு விண்ணப்பம் சமர்ப்பிப்பு தோல்வியடைந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      tryAgain: "மீண்டும் முயற்சிக்கவும்",
      footer: "தயவுசெய்து உங்கள் இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்"
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setleave({
      ...leave,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/leaves/create", leave);
      
      // Success SweetAlert2
      Swal.fire({
        title: t.successTitle,
        text: t.successText,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'rounded-2xl',
          title: 'font-bold text-xl',
          content: 'text-base'
        },
        showCloseButton: true
      });
      
      setTimeout(() => navigate('/adminhome'), 3000);

      setleave({
        employeeId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
      });
    } catch (e) {
      // Error SweetAlert2
      Swal.fire({
        title: t.errorTitle,
        text: t.errorText,
        icon: 'error',
        confirmButtonText: t.tryAgain,
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-2xl',
          title: 'font-bold text-xl',
          content: 'text-base'
        },
        showCloseButton: true,
        footer: t.footer
      });
    }
  };

  return (
    <div>
      <Navigation />
      <div className="bg-white min-h-screen flex items-center justify-center relative">
        
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                language === 'en' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('si')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                language === 'si' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              සිංහල
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                language === 'ta' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          <div className="w-full bg-blue-600 text-white p-3 rounded-md mb-6">
            <h2 className="text-center text-2xl font-bold">{t.title}</h2>
            <h6 className="text-center text-sm">{t.subtitle}</h6>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  {t.employeeId} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={leave.employeeId}
                  onChange={handleChange}
                  placeholder={t.enterEmployeeId}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  {t.leaveType} <span className="text-red-500">*</span>
                </label>
                <select
                  name="leaveType"
                  value={leave.leaveType}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">{t.selectLeaveType}</option>
                  <option value="Sick">{t.leaveTypes.sick}</option>
                  <option value="Casual">{t.leaveTypes.casual}</option>
                  <option value="Earned">{t.leaveTypes.earned}</option>
                  <option value="Maternity">{t.leaveTypes.maternity}</option>
                  <option value="Paternity">{t.leaveTypes.paternity}</option>
                  <option value="Unpaid">{t.leaveTypes.unpaid}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  {t.startDate} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={leave.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-black">
                  {t.endDate} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={leave.endDate}
                  onChange={handleChange}
                  min={leave.startDate || new Date().toISOString().split("T")[0]}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                {t.reason} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={leave.reason}
                onChange={handleChange}
                placeholder={t.provideReason}
                rows={4}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <p className='text-sm text-black'>{t.characters}</p>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md mt-4 transition"
            >
              {t.submit}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Leaveform;