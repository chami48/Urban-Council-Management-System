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
      subtitle: "Serving our community with excellence and transparency",
      titleSinhala: "හොරණ නගර සභාවට ඔබව සාදරයෙන් පිළිගනිමු",
    },
    {
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
      title: "Building a Better Tomorrow",
      subtitle: "Infrastructure development and community growth",
      titleSinhala: "වඩා හොඳ හෙටක් ගොඩනැගීම",
    },
    {
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      title: "Digital Services Available",
      subtitle: "Apply for permits and services online",
      titleSinhala: "ඩිජිටල් සේවා ලබා ගත හැකිය",
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const services = [
    {
      icon: FileText,
      title: "Building Permits",
      titleSinhala: "ගොඩනැගිලි බලපත්‍ර",
      description: "Apply for construction permits online",
      link: "/displaybooking",
    },
    {
      icon: Users,
      title: "Birth Certificates",
      titleSinhala: "උප්පැන්න සහතික",
      description: "Get certified birth certificates",
      // link can be added later e.g. "/birth-certificates"
    },
    {
      icon: Award,
      title: "Business Licenses",
      titleSinhala: "ව්‍යාපාර බලපත්‍ර",
      description: "Register and license your business",
    },
    {
      icon: MapPin,
      title: "Property Tax",
      titleSinhala: "දේපල බද්ද",
      description: "Pay property taxes online",
    },
    {
      icon: Calendar,
      title: "Event Booking",
      titleSinhala: "උත්සව වෙන්කරවීම",
      description: "Book community halls and venues",
    },
    {
      icon: Bell,
      title: "Waste Management",
      titleSinhala: "අපද්‍රව්‍ය කළමනාකරණය",
      description: "Schedule waste collection services",
    },
  ];

  const news = [
    {
      date: "2025-08-05",
      title: "New Community Center Opening",
      titleSinhala: "නව ප්‍රජා මධ්‍යස්ථානය විවෘත කිරීම",
      description: "Grand opening ceremony scheduled for next week",
    },
    {
      date: "2025-08-03",
      title: "Road Development Project Update",
      titleSinhala: "මාර්ග සංවර්ධන ව්‍යාපෘති යාවත්කාලීන",
      description: "Phase 2 construction begins on Main Street",
    },
    {
      date: "2025-08-01",
      title: "Public Meeting - Budget 2025",
      titleSinhala: "පොදු රැස්වීම - 2025 අයවැය",
      description: "Community input session for annual budget planning",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="text-white max-w-2xl">
                  <h2 className="text-4xl font-bold mb-2">
                    {slide.titleSinhala}
                  </h2>
                  <h3 className="text-2xl font-semibold mb-4">{slide.title}</h3>
                  <p className="text-xl text-blue-100">{slide.subtitle}</p>
                  <button className="mt-6 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Our Services
            </h2>
            <h3 className="text-2xl font-semibold text-gray-600">
              අපගේ සේවාවන් 
            </h3>
            <p className="text-gray-600 mt-4">
              Access government services quickly and efficiently
               Access government services quickly and efficiently
                Access government services quickly and efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:border-blue-500"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <service.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      {service.titleSinhala}
                    </h4>
                    <h5 className="text-md font-medium text-gray-600 mb-2">
                      {service.title}
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>

                    {/* Use Link instead of a plain button so it navigates */}
                    <Link
                      to={service.link || "#"}
                      className={`mt-3 font-medium flex items-center ${
                        service.link
                          ? "text-blue-600 hover:text-blue-800"
                          : "text-gray-400 cursor-not-allowed pointer-events-none"
                      }`}
                      aria-disabled={!service.link}
                    >
                      Apply Now ggg
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Latest News
                  </h2>
                  <h3 className="text-xl text-gray-600">නවතම ප්‍රවෘත්ති</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="space-y-6">
                {news.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                          {item.titleSinhala}
                        </h4>
                        <h5 className="text-lg font-medium text-gray-600 mb-3">
                          {item.title}
                        </h5>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 ml-4">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Main Office</p>
                      <p className="text-gray-600 text-sm">
                        123 Main Street, Horana
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">034-2266789</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">info@horana.gov.lk</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Office Hours
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">8:30 AM - 4:15 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">8:30 AM - 12:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-red-600">Closed</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="block text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Mayor's Office
                  </a>
                  <a
                    href="#"
                    className="block text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Council Meetings
                  </a>
                  <a
                    href="#"
                    className="block text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Budget Reports
                  </a>
                  <a
                    href="#"
                    className="block text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Public Documents
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">HC</span>
                </div>
                <div>
                  <h4 className="font-bold">Horana Urban Council</h4>
                  <p className="text-sm text-gray-300">හොරණ නගර සභාව</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Committed to serving our community with excellence,
                transparency, and dedication.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Building Permits
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Business Licenses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Property Tax
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Waste Management
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    About Council
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Council Members
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Public Meetings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Annual Reports
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
              <div className="text-sm text-gray-300">
                <p>Emergency: 119</p>
                <p>Office: 034-2266789</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>
              &copy; 2025 Horana Urban Council. All rights reserved. | Powered
              by Gov.lk
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
