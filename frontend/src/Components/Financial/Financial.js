import React from "react";
import { Wrench, AlertTriangle, Clock } from "lucide-react";
import Navigation from "../Navigation/Navigation";

const Financial = () => {
  return (
    <div>
        <Navigation/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl shadow-lg animate-bounce">
          <Wrench className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Financial Module
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 leading-relaxed mb-6">
          <AlertTriangle className="inline w-5 h-5 text-yellow-500 mr-1" />
          Oops! This page is currently <b>under development</b>.
          <br />
          Our team is working hard to bring you modern financial features.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 w-3/4 animate-pulse"></div>
        </div>

        {/* ETA */}
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Expected launch: Coming soon 🚀
        </p>
      </div>
    </div>
    </div>
  );
};

export default Financial;
