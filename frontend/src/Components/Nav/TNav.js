import React, { useState, useEffect } from 'react';
import { Search, Phone, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function NavTamil() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-blue-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' })} இலங்கை நேரம்
              </span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>034-2266789</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center hover:text-blue-200">
              <Globe className="w-4 h-4 mr-1" />
              <span>தமிழ்</span>
            </button>
            <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-sm font-medium">
              Gov.lk
            </button>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="w-20 h-20 mr-4">
              <img
                src="/emblem.svg"
                alt="இலங்கை தேசிய சின்னம்"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ஹொரண நகர சபை</h1>
              <p className="text-blue-200">எங்கள் சமுதாயத்திற்கு சேவை</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="சேவைகளைத் தேடுங்கள்..."
                className="pl-10 pr-4 py-2 w-80 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors">
              English
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="pb-4">
          <div className="flex items-center space-x-8">
            {/* Home */}
            <Link
              to="/mainhome"
              className="flex items-center py-2 px-4 bg-red-600 rounded text-white font-medium"
            >
              <span>🏠</span>
              <span className="ml-2">முகப்பு</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition-colors">
                <span>⚙️</span>
                <span className="ml-2">சேவைகள்</span>
              </button>
              <div className="absolute left-0 hidden group-hover:block bg-white text-gray-800 rounded shadow-lg mt-1 min-w-[220px] z-50">
                <Link
                  to="/tplaygroundFrom"
                  className="block px-4 py-2 hover:bg-blue-100"
                >
                  🏟 விளையாட்டு மைதானம் பதிவு
                </Link>
                <Link
                  to="/#"
                  className="block px-4 py-2 hover:bg-blue-100"
                >
                  🏊 நீச்சல் குளம் பதிவு
                </Link>
                <Link
                  to="/tcrematorium"
                  className="block px-4 py-2 hover:bg-blue-100"
                >
                  ⚰ தகன மைதானம் பதிவு
                </Link>
              </div>
            </div>

            {/* Bookings */}
            <Link
              to="/my-bookings"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition-colors"
            >
              <span>📅</span>
              <span className="ml-2">என் பதிவுகள்</span>
            </Link>

            {/* Complaints */}
            <Link
              to="/complaint"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition-colors"
            >
              <span>📝</span>
              <span className="ml-2">புகார்கள்</span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition-colors"
            >
              <span>📞</span>
              <span className="ml-2">தொடர்பு கொள்ளவும்</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavTamil;