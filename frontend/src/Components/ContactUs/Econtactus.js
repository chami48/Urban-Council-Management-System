import React, { useState } from "react";
import Nav from '../Nav/ENav';
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
                        title="Copy phone number"
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

function EContactUs() {
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
    ["P.K.U.D. Karunaratne", "Secretary", "0112618102"],
    ["M.G.S. Perera", "Accountant", "0112618197"],
    ["P.D. Dumini Kramar", "Administrative Officer", "0112618250"],
    ["Administrative Officer", "Administrative Officer", "0112606933"],
    ["Building Inspector", "Housing and Development Inspector", "0718269004"],
    ["Environmental Health Officer", "Environmental Health Officer", "0112618100"],
    ["T.J. Ranjith Kumar", "Public Health Officer", "0112618100"]
  ];

  const governmentDepartments = [
    ["Divisional Secretariat Office", "0112614422, 0112613451, 0112613651"],
    ["Grama Niladhari Office", "0112614499, 0112613853"],
    ["Health Services Office - Horana", "0112708533"],
    ["Health Services Office - Millaniya", "0115524450"],
    ["Social Services Office - Horana", "0112708883"],
    ["Community Center - Horana", "0112614422, 0112614258"],
    ["Community Center - Millaniya", "0112509461"],
    ["Vocational Training Center", "0112614540, 0112350322"],
    ["DRO Office - Regional", "0112702221"],
    ["DRO Office - Millaniya", "0112509241"]
  ];

  const religiousPlaces = [
    ["Buddhist Temple", "0113344556"],
    ["Hindu Kovil", "0115566778"],
    ["Christian Church", "0117788990"],
    ["Muslim Mosque", "0116677889"]
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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete contact details for Horana Municipal Council, Government Departments, and Community Services
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search contacts..."
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
            <p className="text-gray-600">Municipal Officials</p>
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
            <p className="text-gray-600">Government Departments</p>
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
            <p className="text-gray-600">Religious Places</p>
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
              title="Horana Municipal Council Officials"
              subtitle="Main Staff and Department Heads"
              isExpanded={expandedSections.officials}
              onToggle={() => toggleSection('officials')}
            >
              <ContactTable 
                data={filteredOfficials}
                columns={["Name", "Position", "Phone Number"]}
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
              title="Various Government Institutions"
              subtitle="Regional Offices and Public Services"
              isExpanded={expandedSections.departments}
              onToggle={() => toggleSection('departments')}
            >
              <ContactTable 
                data={filteredDepartments}
                columns={["Institution", "Phone Number"]}
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
              title="Various Religious Places"
              subtitle="Community Religious Centers"
              isExpanded={expandedSections.religious}
              onToggle={() => toggleSection('religious')}
            >
              <ContactTable 
                data={filteredReligious}
                columns={["Place", "Phone Number"]}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">Weekdays</p>
                <p className="text-gray-600">8:30 AM - 4:15 PM</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900">Weekends</p>
                <p className="text-gray-600">Closed</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              For emergencies outside office hours, please contact the relevant emergency services.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default EContactUs;
