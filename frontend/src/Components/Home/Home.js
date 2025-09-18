import Nav from "../Nav/Nav";
import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Users,
  FileText,
  Calendar,
  Award,
  ChevronRight,
  Bell,
  Facebook,
  Twitter,
  Youtube,
  Phone,
  Building2,
  Clock,
  UserCheck,
  Settings,
  Shield,
  Globe,
  Download,
  Search,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      title: "Welcome to Horana Urban Council",
      subtitle: "Building a prosperous future through transparent governance and community partnership",
      titleSinhala: "හොරණ නගර සභාවට ඔබව සාදරයෙන් පිළිගනිමු",
      subtitleSinhala: "විනිවිද පාලනය සහ ප්‍රජා සහයෝගීතාවය තුළින් සමෘද්ධිමත් අනාගතයක් ගොඩනැගීම",
    },
    {
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
      title: "Infrastructure Development Excellence",
      subtitle: "Modern facilities and sustainable urban planning for our growing community",
      titleSinhala: "යටිතල පහසුකම් සංවර්ධන විශිෂ්ටත්වය",
      subtitleSinhala: "අපගේ වර්ධනය වන ප්‍රජාව සඳහා නවීන පහසුකම් සහ තිරසාර නාගරික සැලසුම්කරණය",
    },
    {
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      title: "Digital Government Services",
      subtitle: "Seamless online access to all municipal services and applications",
      titleSinhala: "ඩිජිටල් රජයේ සේවා",
      subtitleSinhala: "සියලුම නාගරික සේවා සහ අයදුම්පත් සඳහා බාධාවකින් තොර අන්තර්ජාල ප්‍රවේශය",
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const services = [
    {
      icon: FileText,
      title: "Building Permits",
      titleSinhala: "ගොඩනැගිලි බලපත්‍ර",
      description: "Submit building permit applications and track approval status online",
      link: "/displaybooking",
      category: "Planning & Development"
    },
    {
      icon: Users,
      title: "Birth Certificates",
      titleSinhala: "උප්පැන්න සහතික",
      description: "Apply for certified birth certificates with secure online verification",
      category: "Civil Registration"
    },
    {
      icon: Award,
      title: "Business Licenses",
      titleSinhala: "ව්‍යාපාර බලපත්‍ර",
      description: "Register new businesses and renew existing commercial licenses",
      category: "Business Services"
    },
    {
      icon: MapPin,
      title: "Property Tax",
      titleSinhala: "දේපල බද්ද",
      description: "Calculate, pay and manage property tax assessments online",
      link: "/propertytax",
      category: "Revenue Services"
    },
    {
      icon: Calendar,
      title: "Event Booking",
      titleSinhala: "උත්සව වෙන්කරවීම",
      description: "Reserve community halls, parks and public venues for events",
      category: "Community Services"
    },
    {
      icon: Bell,
      title: "Waste Management",
      titleSinhala: "අපද්‍රව්‍ය කළමනාකරණය",
      description: "Schedule waste collection, report issues and access recycling programs",
      category: "Environmental Services"
    },
  ];

  const quickStats = [
    { number: "50,000+", label: "Citizens Served", labelSinhala: "සේවය ලබන පුරවැසියන්" },
    { number: "1,200+", label: "Monthly Applications", labelSinhala: "මාසික අයදුම්පත්" },
    { number: "95%", label: "Service Satisfaction", labelSinhala: "සේවා තෘප්තිය" },
    { number: "24/7", label: "Online Access", labelSinhala: "අන්තර්ජාල ප්‍රවේශය" },
  ];

  const news = [
    {
      date: "2025-08-25",
      title: "Digital Infrastructure Modernization Project",
      titleSinhala: "ඩිජිටල් යටිතල පහසුකම් නවීකරණ ව්‍යාපෘතිය",
      description: "New fiber optic network installation to improve internet connectivity across all municipal services and public areas",
      category: "Technology",
      priority: "high"
    },
    {
      date: "2025-08-23",
      title: "Community Development Budget Allocation 2025",
      titleSinhala: "ප්‍රජා සංවර්ධන අයවැය වෙන්කිරීම 2025",
      description: "LKR 150 million allocated for infrastructure improvements, education programs, and healthcare initiatives",
      category: "Finance",
      priority: "medium"
    },
    {
      date: "2025-08-20",
      title: "Public Consultation - Urban Planning Framework",
      titleSinhala: "මහජන උපදේශන - නාගරික සැලසුම් රාමුව",
      description: "Community input sessions for the new 10-year urban development master plan scheduled for September",
      category: "Planning",
      priority: "medium"
    },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-transparent"></div>
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="text-white max-w-3xl">
                  <div className="mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 border border-white/20">
                      <Shield className="w-4 h-4 mr-2" />
                      Official Government Portal
                    </div>
                  </div>
                  <h1 className="text-5xl font-bold mb-3 leading-tight">
                    {slide.titleSinhala}
                  </h1>
                  <h2 className="text-3xl font-semibold mb-4 text-blue-100">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-blue-50 mb-6 leading-relaxed max-w-2xl">
                    {slide.subtitleSinhala}
                  </p>
                  <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      Explore Services
                    </button>
                    <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                      Download Mobile App
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white shadow-lg" 
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.labelSinhala}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
              <Globe className="w-4 h-4 mr-2" />
              Government Services
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Municipal Services Portal
            </h2>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              පළාත් සභා සේවා ද්වාරය
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access comprehensive government services through our secure digital platform. 
              All services are available 24/7 with real-time status tracking and secure document management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 hover:border-blue-300 bg-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {service.titleSinhala}
                  </h4>
                  <h5 className="text-lg font-semibold text-gray-600 mb-3">
                    {service.title}
                  </h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <Link
                    to={service.link || "/adminHome"}
                    className={`inline-flex items-center font-semibold transition-all duration-300 ${
                      service.link
                        ? "text-blue-600 hover:text-blue-800 group-hover:translate-x-1"
                        : "text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                    aria-disabled={!service.link}
                  >
                    {service.link ? "Apply Online" : "Coming Soon"}
                    <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Information Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* News Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Official Announcements
                  </h2>
                  <h3 className="text-xl text-gray-600">
                    නිල නිවේදන සහ ප්‍රවෘත්ති
                  </h3>
                </div>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  View All Announcements
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>

              <div className="space-y-8">
                {news.map((item, index) => (
                  <article
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {item.titleSinhala}
                    </h4>
                    <h5 className="text-lg font-semibold text-gray-700 mb-4">
                      {item.title}
                    </h5>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      Read Full Announcement
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Admin Access - Single Clear Path */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Administration Portal</h3>
                    <p className="text-blue-100 text-sm">පරිපාලන ද්වාරය</p>
                  </div>
                </div>
                <p className="text-blue-50 mb-6 leading-relaxed">
                  Secure access to administrative dashboard for authorized municipal staff and council members.
                </p>
                <Link
                  to="/adminHome"
                  className="inline-flex items-center w-full justify-center py-3 px-6 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <UserCheck className="w-5 h-5 mr-3" />
                  Access Admin Dashboard
                  <ChevronRight className="w-5 h-5 ml-3" />
                </Link>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Municipal Office</p>
                      <p className="text-gray-600">123 Main Street</p>
                      <p className="text-gray-600">Horana, Sri Lanka</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">034-2266789</p>
                      <p className="text-sm text-gray-500">Main Office</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">info@horana.gov.lk</p>
                      <p className="text-sm text-gray-500">Official Email</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-600" />
                  Service Hours
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold text-gray-900">8:30 AM - 4:15 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-900">8:30 AM - 12:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Sunday & Holidays</span>
                    <span className="font-semibold text-red-600">Closed</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Online Services:</strong> Available 24/7
                  </p>
                </div>
              </div>

              {/* Quick Resources */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Quick Resources
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "Mayor's Office", icon: Users },
                    { title: "Council Meetings", icon: Calendar },
                    { title: "Budget Reports", icon: FileText },
                    { title: "Public Documents", icon: Download },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <item.icon className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-700 group-hover:text-blue-600">
                        {item.title}
                      </span>
                      <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="py-16 grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">HC</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold">Horana Urban Council</h4>
                  <p className="text-gray-300">හොරණ නගර සභාව</p>
                  <p className="text-sm text-gray-400 mt-1">Established 1987</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Committed to serving our community with excellence, transparency, and innovation. 
                Building a sustainable future through responsible governance and civic engagement.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Government Services</h4>
              <ul className="space-y-3">
                {['Building Permits', 'Business Licenses', 'Property Tax', 'Birth Certificates', 'Waste Management', 'Event Booking'].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Information</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">About Council</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Council Members</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Public Meetings</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Annual Reports</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Transparency Portal</a></li>
                <li>
                  <Link to="/admin-dashboard" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    Staff Portal →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                <p>&copy; 2025 Horana Urban Council. All rights reserved.</p>
                <p className="mt-1">Powered by Digital Government Initiative | Version 2.1</p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-red-400 font-medium">Emergency: 119</span>
                <span className="text-blue-400">Office: 034-2266789</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;