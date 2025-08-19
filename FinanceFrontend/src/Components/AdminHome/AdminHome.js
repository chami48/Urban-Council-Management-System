import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../AdminNav/AdminNav.js';
import './AdminHome.css';  // Import the external CSS file

// Officer Profile Card Component
const OfficerCard = ({ name, title, profileLink, navigate }) => (
  <div className="officerCard" onClick={() => navigate(profileLink)}>
    <div className="officerCardContent">
      <h4 className="officerCardTitle">{name}</h4>
      <h5 className="officerCardSubtitle">{title}</h5>
    </div>
  </div>
);

function AdminHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();  // Define navigate here

  // Hero slides data
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      title: "Welcome to the Admin Dashboard",
      subtitle: "Manage and oversee all operations",
      titleSinhala: "Welcome to the Admin Dashboard"
    },
    // Add more slides as needed
  ];

  // Officer data (adjust titles as per real designations)
  const officers = [
    { name: 'Rebeka De Silva', title: 'Financial Manager', profileLink: '/profile/financial-manager' },
    { name: 'Heshan Gunawardhena', title: 'Assessment Officer', profileLink: '/profile/assessment-officer' },
    { name: 'Bhathiya Jayakodi', title: 'Permit Approve Officer', profileLink: '/profile/permit-approve-officer' },
    { name: 'Prasanna Nirmal', title: 'Service Officer', profileLink: '/profile/service-officer' },
    { name: 'Sankalpa Basnayaka', title: 'Inventory Officer', profileLink: '/profile/inventory-officer' },
    { name: 'Prasantha Desy', title: 'HR Manager', profileLink: '/profile/hr-manager' },
    { name: 'Gihan Amarajeewa', title: 'Administrator', profileLink: '/profile/administrator' }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="container">
      <Nav />

      {/* Hero Section */}
      <section className="hero">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'slideActive' : index < currentSlide ? 'slidePrev' : 'slideNext'}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slideOverlay"></div>
            <div className="containerDiv">
              <div className="slideContent">
                <h2 className="slideTitle">{slide.titleSinhala}</h2>
                <h3 className="slideSubtitle">{slide.title}</h3>
                <p className="slideText">{slide.subtitle}</p>
                <button 
                  className="btnPrimary"
                  onMouseEnter={(e) => e.target.style.background = '#c2410c'}
                  onMouseLeave={(e) => e.target.style.background = '#ea580c'}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Officer Profiles Section */}
      <section>
        <div className="containerDiv">
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>Meet Our Officers</h2>
          <div className="officerGrid">
            {officers.map((officer, index) => (
              <OfficerCard 
                key={index} 
                name={officer.name} 
                title={officer.title} 
                profileLink={officer.profileLink} 
                navigate={navigate}  // Pass navigate here
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminHome;
