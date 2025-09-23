import Nav from "../Nav/Nav";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Megaphone,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const ANNOUNCEMENT_URL = "http://localhost:5000/announcements";

// Announcement Modal Component
const AnnouncementModal = ({ announcement, isOpen, onClose }) => {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone size={24} className="text-blue-600" />
            முழு அறிவிப்பு
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Announcement Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            {announcement.date && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{announcement.date}</span>
              </div>
            )}
            {announcement.time && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{announcement.time}</span>
              </div>
            )}
            {announcement.area && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <MapPin className="w-3 h-3 inline mr-1" />
                {announcement.area}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            {announcement.title}
          </h2>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {announcement.description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>ஹொறணா நகரசபை வெளியிட்டது</span>
              <span>அதிகாரப்பூர்வ அறிவிப்பு</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// All Announcements View Component
const AllAnnouncementsView = ({ announcements, isOpen, onClose, onViewFull }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">அனைத்து அறிவிப்புகள்</h1>
              <p className="text-gray-600">அனைத்து அறிவிப்புகள்</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAnnouncements.length} அறிவிப்பு{filteredAnnouncements.length !== 1 ? 'கள்' : ''} கிடைத்தன
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="அறிவிப்புகளை தேடுங்கள்..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Announcements Grid */}
        {currentAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Megaphone size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">அறிவிப்புகள் எதுவும் கிடைக்கவில்லை</h3>
            <p className="text-gray-500">
              {searchTerm ? "தேடல் சொற்களை மாற்றிப் பார்க்கவும்." : "தற்சமயம் அறிவிப்புகள் இல்லை."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentAnnouncements.map((announcement, index) => (
                <div
                  key={announcement._id || index}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-xs text-gray-500">
                      {announcement.date && (
                        <span className="flex items-center mr-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          {announcement.date}
                        </span>
                      )}
                      {announcement.time && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {announcement.time}
                        </span>
                      )}
                    </div>
                    {announcement.area && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {announcement.area}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {announcement.title}
                  </h3>

                  {/* Description Preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {announcement.description}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => onViewFull(announcement)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    முழு அறிவிப்பைப் படிக்க
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  முந்தையது
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  அடுத்தது
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // === Announcements state (from backend) ===
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [annError, setAnnError] = useState(null);

  // === Modal states ===
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        setAnnLoading(true);
        const res = await axios.get(ANNOUNCEMENT_URL);
        // API returns { announcements: [...] }
        setAnnouncements(res.data?.announcements || []);
        setAnnError(null);
      } catch (err) {
        setAnnError("அறிவிப்புகளை ஏற்ற முடியவில்லை. சர்வர் இயங்குகிறதா என்று சரிபார்க்கவும்.");
        console.error("Fetch announcements error:", err);
      } finally {
        setAnnLoading(false);
      }
    };
    getAnnouncements();
  }, []);

  // Hero slides data
  const slides = [
    {
      image:"/horanaUrban/home.png",
      title: "ஹொறணா நகரசபைக்கு வரவேற்பு",
      subtitle:
        "வெளிப்படையான நிர்வாகமும் சமூகக் கூட்டாண்மையும் மூலம் வளமான எதிர்காலம்",
      titleSinhala: "ஹொறணா நகரசபைக்கு உங்களை அன்புடன் வரவேற்கிறோம்",
      subtitleSinhala:
        "வெளிப்படையான நிர்வாகம் மற்றும் சமூக ஒத்துழைப்பின் மூலம் வளமான எதிர்காலத்தை அமைத்தல்",
    },
    {
      image:
        "/horanaUrban/Servise.png",
      
  "title": "சேவையின் மூலம் சமூக முன்னேற்றம்",
  "subtitle": "அனைவருக்கும் கல்வி, தொழில், சுகாதாரம் மற்றும் சுத்தமான சூழல்",
  "titleSinhala": "சேவையின் வழி சமூக முன்னேற்றம்",
  "subtitleSinhala": "அனைவருக்கும் கல்வி, தொழில், சுகாதாரம் மற்றும் சுத்தமான சூழல்"


    },
    {
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      title: "மின்நிலைய அரசுச் சேவைகள்",
      subtitle:
        "அனைத்து நகராட்சி சேவைகளுக்கும் விண்ணப்பங்களுக்கும் தடையற்ற ஆன்லைன் அணுகல்",
      titleSinhala: "டிஜிட்டல் அரசுச் சேவைகள்",
      subtitleSinhala:
        "அனைத்து நகராட்சி சேவைகளுக்கும் விண்ணப்பங்களுக்கும் தடையற்ற இணைய அணுகல்",
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
      title: "கட்டிட அனுமதிகள்",
      titleSinhala: "கட்டிட அனுமதிகள்",
      description:
        "கட்டிட அனுமதி விண்ணப்பங்களை சமர்ப்பித்து, அனுமதி நிலையை ஆன்லைனில் கண்காணிக்கவும்",
      link: "/displaybooking",
      category: "திட்டமிடல் & மேம்பாடு",
    },
    {
      icon: Users,
      title: "சேவை bot",
      titleSinhala: "சேவை பாட்டி",
      description:
        "அரசுச் சேவை முன்பதிவுகளை எளிமையாக்கலாம்",
        link: "/chatbot",
      category: "பொது பதிவு",
    },
    {
      icon: Award,
      title: "வணிக உரிமங்கள்",
      titleSinhala: "வணிக உரிமங்கள்",
      description:
        "புதிய வணிகங்களை பதிவு செய்து, நடப்பு வர்த்தக உரிமங்களை புதுப்பிக்கவும்",
      link: "/shop-rental-instructions",
      category: "வணிக சேவைகள்",
    },
    {
      icon: MapPin,
      title: "சொத்து வரி",
      titleSinhala: "சொத்து வரி",
      description:
        "சொத்து வரியை கணக்கிட்டு, கட்டி, மதிப்பீடுகளை ஆன்லைனில் நிர்வகிக்கவும்",
      link: "/propertytax",
      category: "வருவாய் சேவைகள்",
    },
    {
      icon: Calendar,
      title: "நிகழ்ச்சி முன்பதிவு",
      titleSinhala: "நிகழ்ச்சி முன்பதிவு",
      description:
        "சமூக மண்டபங்கள், பூங்காக்கள் மற்றும் பொதுத் தளங்களை நிகழ்வுகளுக்காக முன்பதிவு செய்யவும்",
      category: "சமூக சேவைகள்",
    },
    {
      icon: Bell,
      title: "கழிவு மேலாண்மை",
      titleSinhala: "கழிவு மேலாண்மை",
      description:
        "கழிவு சேகரிப்பை திட்டமிட்டு, சிக்கல்களை புகாரளித்து, மறுசுழற்சி திட்டங்களை அணுகவும்",
      category: "சுற்றுச்சூழல் சேவைகள்",
    },
  ];

  const quickStats = [
    { number: "50,000+", label: "Citizens Served", labelSinhala: "சேவை பெறும் குடிமக்கள்" },
    { number: "1,200+", label: "Monthly Applications", labelSinhala: "மாதாந்திர விண்ணப்பங்கள்" },
    { number: "95%", label: "Service Satisfaction", labelSinhala: "சேவை திருப்தி" },
    { number: "24/7", label: "Online Access", labelSinhala: "ஆன்லைன் அணுகல்" },
  ];

  // Handle announcement actions
  const handleViewFullAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  const handleViewAllAnnouncements = () => {
    setShowAllAnnouncements(true);
  };

  const handleCloseModal = () => {
    setShowAnnouncementModal(false);
    setSelectedAnnouncement(null);
  };

  const handleCloseAllAnnouncements = () => {
    setShowAllAnnouncements(false);
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
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <div
  className="w-full h-full relative"
  style={{ 
    backgroundImage: `url(${slide.image})`,
    backgroundSize: index === 1 ? '90%' : 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-transparent"></div>
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="text-white max-w-3xl">
                  <div className="mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 border border-white/20">
                      <Shield className="w-4 h-4 mr-2" />
                      அரசின் அதிகாரப்பூர்வ தளம்
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
                      சேவைகளைக் காண்க
                    </button>
                    <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300">
                      மொபைல் செயலியை பதிவிறக்குக
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
                index === currentSlide ? "bg-white shadow-lg" : "bg-white/40 hover:bg-white/60"
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
              அரசுச் சேவைகள்
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">நகர சேவைகள் தளம்</h2>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">நகரசபை சேவைகள் வாயில்</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              பாதுகாப்பான மின்நிலைய தளத்தில் முழுமையான அரசுச் சேவைகளை அணுகுங்கள். அனைத்து சேவைகளும் 24/7 கிடைக்கின்றன; நேரடி நிலை கண்காணிப்பு மற்றும் பாதுகாப்பான ஆவண மேலாண்மையுடன்.
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

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{service.titleSinhala}</h4>
                  <h5 className="text-lg font-semibold text-gray-600 mb-3">{service.title}</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  <Link
                    to={service.link || "/adminHome"}
                    className={`inline-flex items-center font-semibold transition-all duration-300 ${
                      service.link
                        ? "text-blue-600 hover:text-blue-800 group-hover:translate-x-1"
                        : "text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                    aria-disabled={!service.link}
                  >
                    {service.link ? "ஆன்லைனில் விண்ணப்பிக்க" : "விரைவில்"}
                    <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Information Section (Improved Announcements) */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Announcements Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Megaphone className="w-8 h-8 text-blue-600" />
                    அதிகாரப்பூர்வ அறிவிப்புகள்
                  </h2>
                  <h3 className="text-xl text-gray-600">அதிகாரப்பூர்வ செய்திகள் மற்றும் அறிவிப்புகள்</h3>
                </div>
                <button 
                  onClick={handleViewAllAnnouncements}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                >
                  அனைத்து அறிவிப்புகளையும் காண்க
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>

              {/* Loading / Error / Empty states */}
              {annLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                      <div className="animate-pulse space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-gray-200 rounded w-20" />
                          <div className="h-4 bg-gray-200 rounded w-16" />
                          <div className="h-6 bg-gray-200 rounded-full w-20" />
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded" />
                          <div className="h-4 bg-gray-200 rounded w-5/6" />
                          <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : annError ? (
                <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-center gap-3 text-red-700">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <ExternalLink size={20} />
                    </div>
                    <p>{annError}</p>
                  </div>
                </div>
              ) : announcements.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Megaphone size={32} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">இன்னும் அறிவிப்புகள் இல்லை</h4>
                  <p className="text-gray-500">பின்னர் மீண்டும் சரிபார்க்கவும்.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Show latest 3 announcements on home page */}
                  {announcements
                    .slice()
                    .reverse()
                    .slice(0, 3)
                    .map((announcement, index) => (
                      <article
                        key={announcement._id || index}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                      >
                        <div className="p-8">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              {(announcement.date || announcement.time) && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>
                                    {announcement.date ? announcement.date : ""}
                                    {announcement.time ? ` • ${announcement.time}` : ""}
                                  </span>
                                </div>
                              )}
                              {announcement.area && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                                  <MapPin className="w-3 h-3 inline mr-1" />
                                  {announcement.area}
                                </span>
                              )}
                            </div>
                          </div>

                          <h4 className="text-2xl font-bold text-gray-900 mb-3 leading-tight break-words">
                            {announcement.title}
                          </h4>
                          
                          {announcement.description && (
                            <p className="text-gray-600 leading-relaxed mb-6 break-words">
                              {announcement.description.length > 200
                                ? `${announcement.description.substring(0, 200)}...`
                                : announcement.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <button 
                              onClick={() => handleViewFullAnnouncement(announcement)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              முழு அறிவிப்பைப் படிக்க
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                            <span className="text-xs text-gray-400">
                              அதிகாரப்பூர்வம் • ஹொறணா நகரசபை
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}

                  {/* Show "View All" button if there are more than 3 announcements */}
                  {announcements.length > 3 && (
                    <div className="text-center pt-6">
                      <button 
                        onClick={handleViewAllAnnouncements}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        அனைத்து {announcements.length} அறிவிப்புகளையும் காண்க
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              )}
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
                    <h3 className="text-xl font-bold">நிர்வாக நுழைவாயில்</h3>
                    <p className="text-blue-100 text-sm">நிர்வாக வாயில்</p>
                  </div>
                </div>
                <p className="text-blue-50 mb-6 leading-relaxed">
                  அங்கீகரிக்கப்பட்ட நகராட்சி ஊழியர்கள் மற்றும் சபை உறுப்பினர்களுக்கான பாதுகாப்பான நிர்வாக டாஷ்போர்டு அணுகல்.
                </p>
                <Link
                  to="/adminHome"
                  className="inline-flex items-center w-full justify-center py-3 px-6 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <UserCheck className="w-5 h-5 mr-3" />
                  நிர்வாக டாஷ்போர்டுக்கு செல்ல
                  <ChevronRight className="w-5 h-5 ml-3" />
                </Link>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  தொடர்பு தகவல்கள்
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">நகராட்சி அலுவகம்</p>
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
                      <p className="text-sm text-gray-500">முக்கிய அலுவலகம்</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">info@horana.gov.lk</p>
                      <p className="text-sm text-gray-500">அதிகாரப்பூர்வ மின்னஞ்சல்</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-600" />
                  சேவை நேரங்கள்
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">திங்கள் - வெள்ளி</span>
                    <span className="font-semibold text-gray-900">8:30 AM - 4:15 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">சனி</span>
                    <span className="font-semibold text-gray-900">8:30 AM - 12:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">ஞாயிறு & விடுமுறை</span>
                    <span className="font-semibold text-red-600">மூடப்பட்டது</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>ஆன்லைன் சேவைகள்:</strong> எந்நேரமும் (24/7)
                  </p>
                </div>
              </div>

              {/* Quick Resources */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">விரைவு வளங்கள்</h3>
                <div className="space-y-4">
                  {[
                    { title: "மெயர் அலுவலகம்", icon: Users },
                    { title: "சபை கூட்டங்கள்", icon: Calendar },
                    { title: "பட்ஜெட் அறிக்கைகள்", icon: FileText },
                    { title: "பொது ஆவணங்கள்", icon: Download },
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
                  <p className="text-gray-300">ஹொறணா நகரசபை</p>
                  <p className="text-sm text-gray-400 mt-1">1987 இல் நிறுவப்பட்டது</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                சிறந்த சேவை, வெளிப்படைத் தன்மை, புதுமை ஆகியவற்றுடன் எங்கள் சமூகத்திற்கு அர்ப்பணிப்புடன் செயல்படுகிறோம். பொறுப்பான நிர்வாகம் மற்றும் குடிமக்கள் பங்கேற்பு மூலம் நிலைத்திருக்கக்கூடிய எதிர்காலத்தை உருவாக்குகிறோம்.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">அரசுச் சேவைகள்</h4>
              <ul className="space-y-3">
                {[
                  "கட்டிட அனுமதிகள்",
                  "வணிக உரிமங்கள்",
                  "சொத்து வரி",
                  "முன்பதிவு நிர்வாகம்",
                  "கழிவு மேலாண்மை",
                  "நிகழ்ச்சி முன்பதிவு",
                ].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">தகவல்கள்</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    சபை பற்றி
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    சபை உறுப்பினர்கள்
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    பொது கூட்டங்கள்
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    ஆண்டு அறிக்கைகள்
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    வெளிப்படைத்தன்மை தளம்
                  </a>
                </li>
                <li>
                  <Link to="/profile" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    பணியாளர் தளம் →
                  </Link>
                  
                  <br />
                  <Link to="/log" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    உள்நுழை
                  </Link>

                  <br />
                  

                  <Link to="/regi" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                    பதிவுசெய்
                  </Link>





                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                <p>&copy; 2025 ஹொறணா நகரசபை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
                <p className="mt-1">டிஜிட்டல் அரசுத் திட்டத்தின் ஆதரவுடன் | பதிப்பு 2.1</p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-red-400 font-medium">அவசரம்: 119</span>
                <span className="text-blue-400">அலுவகம்: 034-2266789</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnnouncementModal 
        announcement={selectedAnnouncement}
        isOpen={showAnnouncementModal}
        onClose={handleCloseModal}
      />

      <AllAnnouncementsView
        announcements={announcements}
        isOpen={showAllAnnouncements}
        onClose={handleCloseAllAnnouncements}
        onViewFull={handleViewFullAnnouncement}
      />
    </div>
  );
}

export default Home;
