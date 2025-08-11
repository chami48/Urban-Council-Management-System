import React, { useState, useEffect } from "react";
import './Nav.css';
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <ul className="home-ul">
        <li className="home-li">
          <Link 
            to="/mainhome" 
            className={`home-a ${isActive('/mainhome') ? 'active-page' : ''}`}
          >
            <h1>Home</h1>
          </Link>
        </li>
        
        <li className="home-li">
          <Link 
            to="/addassessment" 
            className={`home-a ${isActive('/addassessment') ? 'active-page' : ''}`}
          >
            <h1>Add New Assessment</h1>
          </Link>
        </li>
        
        <li className="home-li">
          <Link 
            to="/assessmentdetails" 
            className={`home-a ${isActive('/assessmentdetails') ? 'active-page' : ''}`}
          >
            <h1>Assessment Details</h1>
          </Link>
        </li>
        
        <li className="home-li">
          <Link 
            to="/contactus" 
            className={`home-a ${isActive('/contactus') ? 'active-page' : ''}`}
          >
            <h1>Contact Us</h1>
          </Link>
        </li>
        
        <li className="home-li">
          <Link 
            to="/register" 
            className={`home-a ${isActive('/register') ? 'active-page' : ''}`}
          >
            <button className="btn-register">
              Register
            </button>
          </Link>
        </li>
        
        <li className="home-li">
          <Link 
            to="/log" 
            className={`home-a ${isActive('/log') ? 'active-page' : ''}`}
          >
            <button className="btn-login">
              Login
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
