import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../Components/LanguageContext';
import { getTranslation } from './Components/translation';

const LanguageSwitcher = ({ className = "" }) => {
  const { language, changeLanguage } = useLanguage();
  const t = getTranslation(language);

  const languages = [
    { code: 'si', name: t.sinhala, flag: '🇱🇰' },
    { code: 'ta', name: t.tamil, flag: '🇱🇰' },
    { code: 'en', name: t.english, flag: '🇺🇸' }
  ];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
            language === lang.code
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 border border-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">{lang.flag}</span>
          <span>{lang.name}</span>
          {language === lang.code && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl -z-10"
              layoutId="activeLanguage"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;