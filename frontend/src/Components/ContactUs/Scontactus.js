import React, { useState } from "react";
import Nav from '../Nav/Nav';
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Users, Building,
  ChevronDown, ChevronUp, Search, Copy, CheckCircle
} from "lucide-react";

const ContactCard = ({ icon, title, subtitle, phone, isExpanded, onToggle, children }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
  >
    <div 
      className="p-6 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            {phone && (
              <p className="text-sm font-medium text-blue-600 flex items-center gap-1 mt-1">
                <Phone size={14} />
                {phone}
              </p>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
    </div>
    
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? "auto" : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="px-6 pb-6 border-t border-gray-100">
        <div className="pt-6">
          {children}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const ContactTable = ({ data, columns }) => {
  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column, index) => (
              <th key={index} className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-4 px-4 text-sm text-gray-900">
                  {cellIndex === row.length - 1 && cell.match(/^\d/) ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cell}</span>
                      <button
                        onClick={() => copyToClipboard(cell)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="දුරකථන අංකය පිටපත් කරන්න"
                      >
                        {copiedText === cell ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function SContactUs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    officials: true,
    departments: false,
    religious: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const municipalOfficials = [
    ["පී.කේ.යූ.ඩී.කරුණාරත්න මහතා", "ලේකම්", "0112618102"],
    ["එම්.ජී.එස්.ප්‍රනාන්දු මහතා", "ගණකාධිකාරී", "0112618197"],
    ["පී. ඩී. දුමිනි ක්‍රමර් මහතා", "ක්‍රමාන්විත අධිකාරී", "0112618250"],
    ["පරිපාලන නිලධාරී", "පරිපාලන නිලධාරී", "0112606933"],
    ["ගෘහ නිර්මාණ පරීක්ෂකවරයා", "ගෘහ නිර්මාණ සහ සංවර්ධන පරීක්ෂකවරයා", "0718269004"],
    ["එම්.පී.පරිසර සෞඛ්‍ය නිලධාරී", "පරිසර සෞඛ්‍ය නිලධාරී", "0112618100"],
    ["ටී.ජී.රන්ජිත් කුමාර් මහතා", "මහජන සෞඛ්‍ය නිලධාරී", "0112618100"]
  ];

  const governmentDepartments = [
    ["ප්‍රදේශීය ලේකම් කාර්යාලය", "0112614422, 0112613451, 0112613651"],
    ["ග්‍රාම සේවක කාර්යාලය", "0112614499, 0112613853"],
    ["සෞඛ්‍ය සේවා කාර්යාලය - හොරණ", "0112708533"],
    ["සෞඛ්‍ය සේවා කාර්යාලය - මිල්ලනියාව", "0115524450"],
    ["සමාජ සේවා කාර්යාලය - හොරණ", "0112708883"],
    ["සමාජ මධ්‍යස්ථානය - හොරණ", "0112614422, 0112614258"],
    ["සමාජ මධ්‍යස්ථානය - මිල්ලනියාව", "0112509461"],
    ["වෘත්තීය පුහුණු මධ්‍යස්ථානය", "0112614540, 0112350322"],
    ["ඩී.ආර්.ඕ.කාර්යාලය - ප්‍රාදේශීය", "0112702221"],
    ["ඩී.ආර්.ඕ.කාර්යාලය - මිල්ලනියාව", "0112509241"]
  ];

  const religiousPlaces = [
    ["බෞද්ධ විහාරය", "0113344556"],
    ["හින්දු කෝවිල", "0115566778"],
    ["කිතුනු දේවස්ථානය", "0117788990"],
    ["මුස්ලිම් මස්ජිදය", "0116677889"]
  ];

  const filteredOfficials = municipalOfficials.filter(official =>
    official.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredDepartments = governmentDepartments.filter(dept =>
    dept.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredReligious = religiousPlaces.filter(place =>
    place.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Nav />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Phone className="w-10 h-10 text-blue-600" />
              අපි අමතන්න
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              හොරණ නගර සභාව, රාජ්‍ය දෙපාර්තමේන්තු සහ ප්‍රජා සේවාවන් සඳහා සම්පූර්ණ සම්බන්ධතා තොරතුරු
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="සම්බන්ධතා සොයන්න..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{municipalOfficials.length}</h3>
            <p className="text-gray-600">සභා නිලධාරින්</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{governmentDepartments.length}</h3>
            <p className="text-gray-600">රාජ්‍ය ආයතන</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{religiousPlaces.length}</h3>
            <p className="text-gray-600">ආගමික ස්ථාන</p>
          </motion.div>
        </div>

        {/* Contact Sections */}
        <div className="space-y-8">
          {/* Municipal Officials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ContactCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="හොරණ නගර සභා නිලධාරින්"
              subtitle="ප්‍රධාන කාර්ය මණ්ඩලය සහ දෙපාර්තමේන්තු ප්‍රධානීන්"
              isExpanded={expandedSections.officials}
              onToggle={() => toggleSection('officials')}
            >
              <ContactTable 
                data={filteredOfficials}
                columns={["නම", "තනතුර", "දුරකථන අංකය"]}
              />
            </ContactCard>
          </motion.div>

          {/* Government Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ContactCard
              icon={<Building className="w-6 h-6 text-green-600" />}
              title="සභා විවිධ රාජ්‍ය ආයතන"
              subtitle="ප්‍රාදේශීය කාර්යාල සහ මහජන සේවා"
              isExpanded={expandedSections.departments}
              onToggle={() => toggleSection('departments')}
            >
              <ContactTable 
                data={filteredDepartments}
                columns={["ආයතනය", "දුරකථන අංක"]}
              />
            </ContactCard>
          </motion.div>

          {/* Religious Places */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ContactCard
              icon={<MapPin className="w-6 h-6 text-purple-600" />}
              title="සභා විවිධ ආගමික ස්ථාන"
              subtitle="ප්‍රජා ආගමික මධ්‍යස්ථාන"
              isExpanded={expandedSections.religious}
              onToggle={() => toggleSection('religious')}
            >
              <ContactTable 
                data={filteredReligious}
                columns={["ස්ථානය", "දුරකථන අංකය"]}
              />
            </ContactCard>
          </motion.div>
        </div>

        {/* Footer Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">කාර්යාල වේලාවන්</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">සතියේ දිනවල</p>
                <p className="text-gray-600">පෙරවරු 8:30 - අපරාහ්න 4:15</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">සති අන්තයේ</p>
                <p className="text-gray-600">වසා</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              කාර්යාල වේලාවන්ට පිටතදී හදිසි කරුණු සඳහා, කරුණාකර අදාළ හදිසි සේවාවන්ට සම්බන්ධ වන්න.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SContactUs;