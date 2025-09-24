import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation'; // Import the Navigation component
import {
  MessageSquare,
  FileText,
  CreditCard,
  Users,
  Settings,
  TrendingUp,
  MapPin,
  DollarSign,
  ChevronRight,
  X,
  ArrowRight
} from 'lucide-react';

const AdminHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Sample data using your exact names
  const moduleStats = {
    serviceRequests: { total: 1247, pending: 89, completed: 1089, inProgress: 69 },
    licenses: { total: 456, approved: 398, pending: 34, rejected: 24 },
    payments: { totalRevenue: 2450000, monthlyPayments: 892, pendingPayments: 23 },
    hr: { employees: 6, onLeave: 1, pendingLeaves: 12 },
    users: { totalUsers: 15430, activeUsers: 12890, newRegistrations: 234 }
  };

  const serviceRequests = [
    {
      id: 'SR001',
      type: 'Street Light Issue',
      typeSinhala: 'වීදි ලාම්පු ගැටලුව',
      location: 'Colombo 07',
      citizen: 'K. Perera',
      status: 'In Progress',
      priority: 'High',
      assignedOfficer: 'Prasanna Nirmal',
      date: '2025-08-25',
      description: 'Multiple street lights not working on Galle Road'
    },
    {
      id: 'SR002',
      type: 'Garbage Collection',
      typeSinhala: 'කුණු එකතු කිරීම',
      location: 'Mount Lavinia',
      citizen: 'S. Fernando',
      status: 'Completed',
      priority: 'Medium',
      assignedOfficer: 'Sankalpa Basnayaka',
      date: '2025-08-24',
      description: 'Garbage not collected for 3 days in residential area'
    },
    {
      id: 'SR003',
      type: 'Road Repair',
      typeSinhala: 'මාර්ග අලුත්වැඩියා',
      location: 'Nugegoda',
      citizen: 'A. Silva',
      status: 'Pending',
      priority: 'Critical',
      assignedOfficer: 'Heshan Gunawardhena',
      date: '2025-08-26',
      description: 'Large pothole causing traffic issues'
    }
  ];

  // Updated modules with navigation routes
  const modules = [
    {
      id: 'serviceRequests',
      title: 'Service Requests & Announcements',
      titleSinhala: 'සේවා ඉල්ලීම් සහ නිවේදන',
      icon: MessageSquare,
      color: 'green',
      description: 'Citizen complaints and municipal announcements',
      route: '/ComplaintsDetails'
    },
    {
      id: 'licenses',
      title: 'License & Permit Applications',
      titleSinhala: 'බලපත්‍ර සහ අවසර අයදුම්පත්',
      icon: FileText,
      color: 'purple',
      description: 'Business licenses and building permits',
      route: '/admincheck'
    },
    {
      id: 'payments',
      title: 'Financial & Payment Gateway',
      titleSinhala: 'මූල්‍ය සහ ගෙවීම් ද්වාරය',
      icon: CreditCard,
      color: 'orange',
      description: 'Payment processing and financial management',
      route: '/addassessment'
    },
    {
      id: 'hr',
      title: 'HR & Salary Management',
      titleSinhala: 'මානව සම්පත් සහ වැටුප් කළමනාකරණය',
      icon: Users,
      color: 'indigo',
      description: 'Employee management and payroll',
      route: '/hr'
    },
    {
      id: 'userManagement',
      title: 'User & Admin Management',
      titleSinhala: 'පරිශීලක සහ පරිපාලක කළමනාකරණය',
      icon: Settings,
      color: 'red',
      description: 'User roles and system administration',
      route: '/users'
    }
  ];

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      title: "Urban Council Management System",
      subtitle: "Complete digital transformation for efficient municipal governance",
      titleSinhala: "නගර සභා කළමනාකරණ පද්ධතිය",
      subtitleSinhala: "කාර්යක්ෂම නාගරික පාලනය සඳහා සම්පූර්ණ ඩිජිටල් පරිවර්තනය"
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      title: "Citizen Service Excellence",
      subtitle: "Streamlined permit processing and service requests",
      titleSinhala: "පුරවැසි සේවා විශිෂ්ටත්වය",
      subtitleSinhala: "සරල කරන ලද බලපත්‍ර ප්‍රක්‍රියාකරණය සහ සේවා ඉල්ලීම්"
    },
    {
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop",
      title: "Smart Digital Solutions",
      subtitle: "Modern HR management and automated workflows",
      titleSinhala: "ස්මාර්ට් ඩිජිටල් විසඳුම්",
      subtitleSinhala: "නවීන මානව සම්පත් කළමනාකරණය සහ ස්වයංක්‍රීය වැඩ ප්‍රවාහ"
    }
  ];

  const officers = [
    {
      name: 'Rebeka De Silva',
      title: 'Financial Manager',
      department: 'Finance Department',
      profileLink: '/profile/financial-manager',
      status: 'online'
    },
    {
      name: "Heshan Gunawardhena",
      title: "Assessment Officer",
      department: "Operations",
      profileLink: "/assessmentdetails",
      status: "online"
    },
    {
      name: 'Bhathiya Jayakodi',
      title: 'Permit Approve Officer',
      department: 'Legal Affairs',
      profileLink: '/profile/permit-approve-officer',
      status: 'offline'
    },
    {
      name: 'Prasanna Nirmal',
      title: 'Service Officer',
      department: 'Customer Service',
      profileLink: '/profile/service-officer',
      status: 'online'
    },
    {
      name: 'Sankalpa Basnayaka',
      title: 'Inventory Officer',
      department: 'Supply Chain',
      profileLink: '/profile/inventory-officer',
      status: 'online'
    },
    {
      name: 'Prasantha Desy',
      title: 'HR Manager',
      department: 'Human Resources',
      profileLink: '/profile/hr-manager',
      status: 'offline'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Critical': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleModuleNavigation = (route) => {
    navigate(route);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleOfficerClick = (profileLink) => {
    navigate(profileLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Component */}
      <Navigation 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Hero Section */}
        <section className="relative h-96 mx-8 mt-6 rounded-2xl overflow-hidden shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-8">
                  <h2 className="text-5xl font-black mb-4">{slide.titleSinhala}</h2>
                  <h3 className="text-3xl font-bold text-blue-100 mb-4">{slide.title}</h3>
                  <p className="text-xl text-blue-50 mb-8 leading-relaxed">{slide.subtitleSinhala}</p>
                  <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 shadow-xl">
                    Explore System Features
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{moduleStats.serviceRequests.total.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Service Requests</p>
              <p className="text-xs text-gray-500">සේවා ඉල්ලීම්</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8.3%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{moduleStats.licenses.total}</h3>
              <p className="text-gray-600 font-medium">License Applications</p>
              <p className="text-xs text-gray-500">බලපත්‍ර අයදුම්පත්</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+15.7%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">LKR {(moduleStats.payments.totalRevenue / 1000000).toFixed(1)}M</h3>
              <p className="text-gray-600 font-medium">Monthly Revenue</p>
              <p className="text-xs text-gray-500">මාසික ආදායම</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2.1%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{moduleStats.users.activeUsers.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Active Users</p>
              <p className="text-xs text-gray-500">සක්‍රීය පරිශීලකයන්</p>
            </div>
          </div>

          {/* Module Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => handleModuleNavigation(module.route)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${module.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{module.titleSinhala}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{module.description}</p>
                <div className="mt-4">
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleNavigation(module.route);
                    }}
                  >
                    Access Module
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity & System Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Recent Service Requests</h3>
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    onClick={() => handleModuleNavigation('/admincheck')}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {serviceRequests.slice(0, 3).map((request) => (
                    <div 
                      key={request.id} 
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => openModal(request)}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{request.type}</h4>
                        <p className="text-sm text-gray-600">{request.typeSinhala}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{request.location}</span>
                          <span>•</span>
                          <span>{request.date}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">System Performance</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">API Response Time</span>
                    <span className="text-sm font-bold text-gray-900">145ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Database Performance</span>
                    <span className="text-sm font-bold text-gray-900">98.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '98%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">System Uptime</span>
                    <span className="text-sm font-bold text-gray-900">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Officers Section */}
        <section className="px-8 pb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Officers</h2>
              <p className="text-gray-600">Active municipal staff members</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officers.map((officer, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleOfficerClick(officer.profileLink)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {officer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        officer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{officer.name}</h4>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{officer.title}</p>
                  <p className="text-gray-600 text-sm">{officer.department}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Service Request Details</h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Request ID</label>
                  <span className="text-gray-900 font-mono">{selectedRequest.id}</span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Type</label>
                  <div>
                    <div className="text-gray-900 font-semibold">{selectedRequest.type}</div>
                    <div className="text-sm text-gray-600">{selectedRequest.typeSinhala}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Location</label>
                  <span className="text-gray-900">{selectedRequest.location}</span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Citizen</label>
                  <span className="text-gray-900">{selectedRequest.citizen}</span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Assigned Officer</label>
                  <span className="text-gray-900">{selectedRequest.assignedOfficer}</span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Status</label>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500 block mb-2">Description</label>
                  <p className="text-gray-900 leading-relaxed">{selectedRequest.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;