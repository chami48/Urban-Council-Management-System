// Layout.js
import React from 'react';
import LanguageSwitcher from '../HR/LanguageSwitcher';
import { useLanguage } from '../HR/LanguageContext';
import { getTranslation } from '../HR/translations';

const Layout = ({ children, showLanguageSwitcher = true }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">{t.leaveManagement}</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                {t.dashboard}
              </a>
              <a href="/leave-form" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                {t.title}
              </a>
              <a href="/leave-list" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                {t.leaveAnalytics}
              </a>
            </div>

            {/* Conditional Language Switcher */}
            {showLanguageSwitcher && <LanguageSwitcher />}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 {t.leaveManagement} - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;