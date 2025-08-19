import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav.js';

// Simple icon components
const FileText = () => <span>📄</span>;
const Users = () => <span>👥</span>;
const Award = () => <span>🏆</span>;
const MapPin = () => <span>📍</span>;
const Calendar = () => <span>📅</span>;
const Bell = () => <span>🔔</span>;
const Phone = () => <span>📞</span>;
const Mail = () => <span>✉️</span>;
const ChevronRight = () => <span>→</span>;
const Facebook = () => <span>📘</span>;
const Twitter = () => <span>🐦</span>;
const Youtube = () => <span>📺</span>;

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      title: "Welcome to Horana Urban Council",
      subtitle: "Serving our community with excellence and transparency",
      titleSinhala: "හොරණ නගර සභාවට ඔබව සාදරයෙන් පිළිගනිමු"
    },
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
      title: "Building a Better Tomorrow",
      subtitle: "Infrastructure development and community growth",
      titleSinhala: "වඩා හොඳ හෙටක් ගොඩනැගීම"
    },
    {
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      title: "Digital Services Available",
      subtitle: "Apply for permits and services online",
      titleSinhala: "ඩිජිටල් සේවා ලබා ගත හැකිය"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const services = [
    { icon: FileText, title: "Building Permits", titleSinhala: "ගොඩනැගිලි බලපත්‍ර", description: "Apply for construction permits online" },
    { icon: Users, title: "Birth Certificates", titleSinhala: "උප්පැන්න සහතික", description: "Get certified birth certificates" },
    { icon: Award, title: "Business Licenses", titleSinhala: "ව්‍යාපාර බලපත්‍ර", description: "Register and license your business" },
    { icon: MapPin, title: "Property Tax", titleSinhala: "දේපල බද්ද", description: "Pay property taxes online" },
    { icon: Calendar, title: "Event Booking", titleSinhala: "උත්සව වෙන්කරවීම", description: "Book community halls and venues" },
    { icon: Bell, title: "Waste Management", titleSinhala: "අපද්‍රව්‍ය කළමනාකරණය", description: "Schedule waste collection services" }
  ];

  const news = [
    {
      date: "2025-08-05",
      title: "New Community Center Opening",
      titleSinhala: "නව ප්‍රජා මධ්‍යස්ථානය විවෘත කිරීම",
      description: "Grand opening ceremony scheduled for next week"
    },
    {
      date: "2025-08-03",
      title: "Road Development Project Update",
      titleSinhala: "මාර්ග සංවර්ධන ව්‍යාපෘති යාවත්කාලීන",
      description: "Phase 2 construction begins on Main Street"
    },
    {
      date: "2025-08-01",
      title: "Public Meeting - Budget 2025",
      titleSinhala: "පොදු රැස්වීම - 2025 අයවැය",
      description: "Community input session for annual budget planning"
    }
  ];

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    containerDiv: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      height: '400px',
      position: 'relative',
      overflow: 'hidden'
    },
    slide: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'transform 1s ease-in-out'
    },
    slideActive: {
      transform: 'translateX(0)'
    },
    slidePrev: {
      transform: 'translateX(-100%)'
    },
    slideNext: {
      transform: 'translateX(100%)'
    },
    slideOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(30, 64, 175, 0.6)'
    },
    slideContent: {
      position: 'absolute',
      top: '50%',
      left: 0,
      width: '100%',
      transform: 'translateY(-50%)',
      color: 'white',
      padding: '0 20px'
    },
    slideTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    slideSubtitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '15px'
    },
    slideText: {
      fontSize: '1.2rem',
      color: '#bfdbfe',
      marginBottom: '25px'
    },
    btnPrimary: {
      background: '#ea580c',
      color: 'white',
      padding: '12px 32px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      textDecoration: 'none',
      display: 'inline-block'
    },
    slideIndicators: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px'
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.5)',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    indicatorActive: {
      background: 'white'
    },
    services: {
      padding: '80px 0',
      background: 'white'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '60px'
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    sectionSubtitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#4b5563',
      marginBottom: '16px'
    },
    sectionText: {
      color: '#6b7280'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px'
    },
    serviceCard: {
      padding: '30px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    serviceCardContent: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    serviceIcon: {
      width: '48px',
      height: '48px',
      background: '#dbeafe',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '20px',
      transition: 'background-color 0.3s',
      flexShrink: 0,
      fontSize: '24px'
    },
    serviceText: {
      flex: 1
    },
    serviceTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '5px'
    },
    serviceSubtitle: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#4b5563',
      marginBottom: '10px'
    },
    serviceDesc: {
      color: '#6b7280',
      fontSize: '0.9rem',
      marginBottom: '15px'
    },
    serviceLink: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center'
    },
    newsSection: {
      padding: '80px 0',
      background: '#f9fafb'
    },
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px'
    },
    newsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '40px'
    },
    newsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    newsItem: {
      background: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s'
    },
    newsContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    newsText: {
      flex: 1
    },
    newsDate: {
      display: 'flex',
      alignItems: 'center',
      color: '#6b7280',
      fontSize: '0.9rem',
      marginBottom: '15px'
    },
    newsTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '10px'
    },
    newsSubtitle: {
      fontSize: '1.1rem',
      fontWeight: '500',
      color: '#4b5563',
      marginBottom: '15px'
    },
    newsDesc: {
      color: '#6b7280'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    },
    sidebarCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    sidebarTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '20px'
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    contactIcon: {
      color: '#3b82f6',
      marginRight: '15px',
      marginTop: '2px',
      flexShrink: 0
    },
    officeHours: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    hourItem: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    quickLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    quickLink: {
      color: '#3b82f6',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center'
    },
    footer: {
      background: '#1f2937',
      color: 'white',
      padding: '60px 0 20px'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
      marginBottom: '40px'
    },
    footerBrand: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px'
    },
    footerLogo: {
      width: '48px',
      height: '48px',
      background: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '15px',
      color: '#3b82f6',
      fontWeight: 'bold'
    },
    footerDesc: {
      color: '#d1d5db',
      fontSize: '0.9rem',
      lineHeight: '1.6'
    },
    footerLinks: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      margin: 0,
      padding: 0
    },
    footerLink: {
      color: '#d1d5db',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'color 0.3s'
    },
    socialLinks: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px'
    },
    socialLink: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      transition: 'opacity 0.3s',
      fontSize: '16px'
    },
    footerBottom: {
      borderTop: '1px solid #374151',
      paddingTop: '30px',
      textAlign: 'center',
      color: '#d1d5db',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <Nav/>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              backgroundImage: `url(${slide.image})`,
              ...(index === currentSlide ? styles.slideActive :
                  index < currentSlide ? styles.slidePrev : styles.slideNext)
            }}
          >
            <div style={styles.slideOverlay}></div>
            <div style={styles.containerDiv}>
              <div style={styles.slideContent}>
                <h2 style={styles.slideTitle}>{slide.titleSinhala}</h2>
                <h3 style={styles.slideSubtitle}>{slide.title}</h3>
                <p style={styles.slideText}>{slide.subtitle}</p>
                <button 
                  style={styles.btnPrimary}
                  onMouseEnter={(e) => e.target.style.background = '#c2410c'}
                  onMouseLeave={(e) => e.target.style.background = '#ea580c'}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div style={styles.slideIndicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                ...styles.indicator,
                ...(index === currentSlide ? styles.indicatorActive : {})
              }}
            />
          ))}
        </div>
      </section>

      {/* Quick Services */}
      <section style={styles.services}>
        <div style={styles.containerDiv}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Services</h2>
            <h3 style={styles.sectionSubtitle}>අපගේ සේවාවන්</h3>
            <p style={styles.sectionText}>Access government services quickly and efficiently</p>
          </div>

          <div style={styles.servicesGrid}>
            {services.map((service, index) => (
              <div 
                key={index} 
                style={styles.serviceCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  const icon = e.currentTarget.querySelector('.service-icon');
                  icon.style.background = '#3b82f6';
                  icon.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  const icon = e.currentTarget.querySelector('.service-icon');
                  icon.style.background = '#dbeafe';
                  icon.style.color = 'inherit';
                }}
              >
                <div style={styles.serviceCardContent}>
                  <div className="service-icon" style={styles.serviceIcon}>
                    <service.icon />
                  </div>
                  <div style={styles.serviceText}>
                    <h4 style={styles.serviceTitle}>{service.titleSinhala}</h4>
                    <h5 style={styles.serviceSubtitle}>{service.title}</h5>
                    <p style={styles.serviceDesc}>{service.description}</p>
                    <a 
                      href="#" 
                      style={styles.serviceLink}
                      onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                      onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                    >
                      Apply Now <ChevronRight />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section style={styles.newsSection}>
        <div style={styles.containerDiv}>
          <div style={styles.newsGrid}>
            {/* News */}
            <div>
              <div style={styles.newsHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Latest News</h2>
                  <h3 style={{...styles.sectionSubtitle, fontSize: '1.25rem'}}>නවතම ප්‍රවෘත්ති</h3>
                </div>
                <a 
                  href="#" 
                  style={styles.serviceLink}
                  onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                >
                  View All <ChevronRight />
                </a>
              </div>

              <div style={styles.newsList}>
                {news.map((item, index) => (
                  <div 
                    key={index} 
                    style={styles.newsItem}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
                  >
                    <div style={styles.newsContent}>
                      <div style={styles.newsText}>
                        <div style={styles.newsDate}>
                          <Calendar /> <span style={{marginLeft: '8px'}}>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <h4 style={styles.newsTitle}>{item.titleSinhala}</h4>
                        <h5 style={styles.newsSubtitle}>{item.title}</h5>
                        <p style={styles.newsDesc}>{item.description}</p>
                      </div>
                      <button 
                        style={{...styles.serviceLink, marginLeft: '20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px'}}
                        onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                        onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div style={styles.sidebar}>
              {/* Contact Info */}
              <div style={styles.sidebarCard}>
                <h3 style={styles.sidebarTitle}>Contact Information</h3>
                <div style={styles.contactInfo}>
                  <div style={styles.contactItem}>
                    <div style={styles.contactIcon}><MapPin /></div>
                    <div>
                      <p style={{fontWeight: '500', margin: '0 0 5px 0'}}>Main Office</p>
                      <p style={{color: '#6b7280', fontSize: '0.9rem', margin: 0}}>123 Main Street, Horana</p>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <div style={styles.contactIcon}><Phone /></div>
                    <div>
                      <p style={{fontWeight: '500', margin: 0}}>034-2266789</p>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <div style={styles.contactIcon}><Mail /></div>
                    <div>
                      <p style={{fontWeight: '500', margin: 0}}>info@horana.gov.lk</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div style={styles.sidebarCard}>
                <h3 style={styles.sidebarTitle}>Office Hours</h3>
                <div style={styles.officeHours}>
                  <div style={styles.hourItem}>
                    <span>Monday - Friday</span>
                    <span style={{fontWeight: '500'}}>8:30 AM - 4:15 PM</span>
                  </div>
                  <div style={styles.hourItem}>
                    <span>Saturday</span>
                    <span style={{fontWeight: '500'}}>8:30 AM - 12:30 PM</span>
                  </div>
                  <div style={styles.hourItem}>
                    <span>Sunday</span>
                    <span style={{fontWeight: '500', color: '#dc2626'}}>Closed</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div style={styles.sidebarCard}>
                <h3 style={styles.sidebarTitle}>Quick Links</h3>
                <div style={styles.quickLinks}>
                  <a 
                    href="#" 
                    style={styles.quickLink}
                    onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                  >
                    <ChevronRight style={{marginRight: '8px'}} />
                    Mayor's Office
                  </a>
                  <a 
                    href="#" 
                    style={styles.quickLink}
                    onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                  >
                    <ChevronRight style={{marginRight: '8px'}} />
                    Council Meetings
                  </a>
                  <a 
                    href="#" 
                    style={styles.quickLink}
                    onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                  >
                    <ChevronRight style={{marginRight: '8px'}} />
                    Budget Reports
                  </a>
                  <a 
                    href="#" 
                    style={styles.quickLink}
                    onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
                  >
                    <ChevronRight style={{marginRight: '8px'}} />
                    Public Documents
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.containerDiv}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerBrand}>
                <div style={styles.footerLogo}>HC</div>
                <div>
                  <h4 style={{fontWeight: 'bold', margin: 0}}>Horana Urban Council</h4>
                  <p style={{color: '#d1d5db', fontSize: '0.9rem', margin: 0}}>හොරණ නගර සභාව</p>
                </div>
              </div>
              <p style={styles.footerDesc}>
                Committed to serving our community with excellence, transparency, and dedication.
              </p>
            </div>

            <div>
              <h4 style={{fontWeight: 'bold', marginBottom: '20px'}}>Services</h4>
              <ul style={styles.footerLinks}>
                <li><a href="#" style={styles.footerLink}>Building Permits</a></li>
                <li><a href="#" style={styles.footerLink}>Business Licenses</a></li>
                <li><a href="#" style={styles.footerLink}>Property Tax</a></li>
                <li><a href="#" style={styles.footerLink}>Waste Management</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{fontWeight: 'bold', marginBottom: '20px'}}>Information</h4>
              <ul style={styles.footerLinks}>
                <li><a href="#" style={styles.footerLink}>About Council</a></li>
                <li><a href="#" style={styles.footerLink}>Council Members</a></li>
                <li><a href="#" style={styles.footerLink}>Public Meetings</a></li>
                <li><a href="#" style={styles.footerLink}>Annual Reports</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{fontWeight: 'bold', marginBottom: '20px'}}>Connect With Us</h4>
              <div style={styles.socialLinks}>
                <a href="#" style={{...styles.socialLink, background: '#3b82f6'}}>
                  <Facebook />
                </a>
                <a href="#" style={{...styles.socialLink, background: '#60a5fa'}}>
                  <Twitter />
                </a>
                <a href="#" style={{...styles.socialLink, background: '#dc2626'}}>
                  <Youtube />
                </a>
              </div>
              <div style={{color: '#d1d5db', fontSize: '0.9rem'}}>
                <p style={{margin: '0 0 5px 0'}}>Emergency: 119</p>
                <p style={{margin: 0}}>Office: 034-2266789</p>
              </div>
            </div>
          </div>

          <div style={styles.footerBottom}>
            <p>&copy; 2025 Horana Urban Council. All rights reserved. | Powered by Gov.lk</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;