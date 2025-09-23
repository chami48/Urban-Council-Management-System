import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';

const HoranaCouncilLanding = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with image overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9)),
            url('\parliment.webp')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Palm frond shadows removed as requested */}
      </div>

      {/* Social Media Icons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
        <div className="bg-blue-600 p-3 rounded hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
          <Facebook className="w-5 h-5 text-white" />
        </div>
        <div className="bg-pink-600 p-3 rounded hover:bg-pink-700 transition-colors cursor-pointer shadow-lg">
          <Instagram className="w-5 h-5 text-white" />
        </div>
        <div className="bg-blue-400 p-3 rounded hover:bg-blue-500 transition-colors cursor-pointer shadow-lg">
          <Twitter className="w-5 h-5 text-white" />
        </div>
        <div className="bg-blue-800 p-3 rounded hover:bg-blue-900 transition-colors cursor-pointer shadow-lg">
          <Linkedin className="w-5 h-5 text-white" />
        </div>
        <div className="bg-red-600 p-3 rounded hover:bg-red-700 transition-colors cursor-pointer shadow-lg">
          <Youtube className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* WhatsApp Button */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="bg-green-500 p-4 rounded-full hover:bg-green-600 transition-colors cursor-pointer shadow-lg">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-8">
          <div className="flex items-center justify-center gap-8 mb-4">
            {/* Sri Lanka Government Emblem */}
            <div className="w-20 h-20 relative">
              <img 
                src="/emblem.svg" 
                alt="Sri Lanka Coat of Arms"
                className=""
              />
            </div>
            
            <div className="text-white">
              <h1 className="text-xl md:text-3xl mt-8 font-bold leading-tight">  හොරණ නගර සභාව - ශ්‍රී ලංකාව </h1>
              <h2 className="text-xl md:text-3xl mt-1 text-blue-200">இலங்கை நகர சபை - ஹோரண</h2>
              <h3 className="text-xl md:text-3xl mt-1.5 font-semibold text-gray-200">HORANA URBAN COUNCIL - SRI LANKA</h3>
            </div>

            {/* Urban Council Logo */}
            <div className="w-20 h-20 relative">
                <img 
                src="\horanalogo.png" 
                alt="Sri Lanka Coat of Arms"
                className=""
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-7xl w-full">
            
            {/* English Section */}
            <div className="relative group">
              {/* Realistic Coconut Shell */}
              <div className="relative w-80 h-80 mx-auto">
                {/* Outer coconut shell with fiber texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-full shadow-2xl">
                  {/* Coconut fiber texture rings */}
                  <div className="absolute inset-3 border-4 border-amber-800 rounded-full opacity-80">
                    <div className="absolute inset-3 border-2 border-amber-700 rounded-full opacity-70">
                      <div className="absolute inset-3 border border-amber-600 rounded-full opacity-60">
                        <div className="absolute inset-4 border border-amber-500 rounded-full opacity-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome</h3>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    Official Horana Urban Council<br/>
                    Serving Our Community<br/>
                    with Excellence and Integrity
                  </p>
                </div>
              </div>
              
              {/* Button */}
              <div className="text-center mt-8">
                 <a href="/mainhome">
                <button className="bg-blue-800 hover:bg-blue-900 text-white px-16 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-blue-600">
                  ENGLISH
                </button>
                </a>
              </div>
            </div>

            {/* Sinhala Section */}
            <div className="relative group">
              <div className="relative w-80 h-80 mx-auto ">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-full shadow-2xl">
                  <div className="absolute inset-3 border-4 border-amber-800 rounded-full opacity-80">
                    <div className="absolute inset-3 border-2 border-amber-700 rounded-full opacity-70">
                      <div className="absolute inset-3 border border-amber-600 rounded-full opacity-60">
                        <div className="absolute inset-4 border border-amber-500 rounded-full opacity-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">ආයුබෝවන්</h3>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    ශ්‍රී ලංකා නගර සභාව - හොරණ<br/>
                    අපගේ ප්‍රජාවට උසස් ගුණත්වයෙන්<br/>
                    සේවා කරන ආයතනයකි
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                 <a href="/mainhome">
                <button className="bg-blue-800 hover:bg-blue-900 text-white px-16 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-blue-600">
                  සිංහල
                </button>
                </a>
              </div>
            </div>

            {/* Tamil Section */}
            <div className="relative group">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-full shadow-2xl">
                  <div className="absolute inset-3 border-4 border-amber-800 rounded-full opacity-80">
                    <div className="absolute inset-3 border-2 border-amber-700 rounded-full opacity-70">
                      <div className="absolute inset-3 border border-amber-600 rounded-full opacity-60">
                        <div className="absolute inset-4 border border-amber-500 rounded-full opacity-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">வணக்கம்</h3>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    இலங்கை நகர சபை - ஹோரண<br/>
                    எங்கள் சமுதாயத்திற்கு சிறந்த<br/>
                    சேவையுடன் கூடிய அமைப்பு
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <button className="bg-blue-800 hover:bg-blue-900 text-white px-16 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-blue-600">
                  தமிழ்
                </button>
              </div>
            </div>

          </div>
        </div>

      
      </div>
    </div>
  );
};

export default HoranaCouncilLanding;