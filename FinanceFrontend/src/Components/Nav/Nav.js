import React, { useState, useEffect } from 'react';
import { Search, Phone, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Nav.css'; // Import the CSS file

function Nav() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="nav-header">
      <div className="nav-container">
        
        {/* Top Bar */}
        <div className="nav-top-bar">
          <div className="nav-top-left">
            <div className="nav-top-item">
              <Clock />
              <span>
                {currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' })} LKT
              </span>
            </div>
            <div className="nav-top-item">
              <Phone />
              <span>034-2266789</span>
            </div>
          </div>
          <div className="nav-top-right">
            <button className="nav-lang-btn">
              <Globe />
              <span>English</span>
            </button>
            <button className="nav-gov-btn">
              Gov.lk
            </button>
          </div>
        </div>

        {/* Main Header */}
        <div className="nav-main-header">
          <div className="nav-logo-section">
            <div className="nav-emblem">
              <img
                src="/emblem.svg"
                alt="Sri Lanka Emblem"
              />
            </div>
            <div className="nav-title">
              <h1>හොරණ නගර සභාව</h1>
              <p>HORANA URBAN COUNCIL</p>
            </div>
          </div>

          <div className="nav-search-section">
            <div className="nav-search-container">
              {/* <Search className="nav-search-icon" /> */}
              <input
                type="text"
                placeholder="Search services..."
                className="nav-search-input"
              />
            </div>
            <button className="nav-lang-switch">
              සිංහල
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-navigation">
          <div className="nav-menu">
            {/* Home */}
            <Link
              to="/mainhome"
              className="nav-menu-item active"
            >
              <span>🏠</span>
              <span>HOME</span>
            </Link>

            {/* Services Dropdown */}
            <div className="nav-dropdown">
              <button className="nav-dropdown-btn">
                <span>⚙️</span>
                <span>SERVICES</span>
              </button>
              <div className="nav-dropdown-menu">
                <Link
                  to="/adduser?type=playground"
                  className="nav-dropdown-item"
                >
                  🏟 Playground Booking
                </Link>
                <Link
                  to="/adduser?type=swimming"
                  className="nav-dropdown-item"
                >
                  🏊 Swimming Pool Booking
                </Link>
                <Link
                  to="/crematorium?type=crematorium"
                  className="nav-dropdown-item"
                >
                  ⚰ Crematorium Booking
                </Link>
              </div>
            </div>

            {/* Bookings */}
            <Link
              to="/userdetails"
              className="nav-menu-item"
            >
              <span>📅</span>
              <span>BOOKINGS</span>
            </Link>

            {/* Admin */}
            <Link
              to="/adminhome"
              className="nav-menu-item"
            >
              <span>👨‍💼</span>
              <span>ADMIN</span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="nav-menu-item"
            >
              <span>📞</span>
              <span>CONTACT US</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Nav;