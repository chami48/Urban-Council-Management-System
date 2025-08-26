import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

// Icons (you can replace with your preferred icon library)
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
    finance: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.9 0 2.50-.87 2.50-2.05 0-2.34-4.68-2.49-4.68-5.87 0-2.13 1.33-3.47 3.25-3.81V5h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 2.22 4.68 2.13 4.68 5.87 0 2.08-1.08 3.41-2.85 3.91z"/>
      </svg>
    ),
    projects: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    reports: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    ),
    trendUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    )
  };
  
  return icons[name] || null;
};

// Stats Card Component
const StatsCard = ({ icon, title, value, change, trend, color }) => (
  <div className="stats-card">
    <div className="stats-card-content">
      <div className="stats-info">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        <div className="stats-change">
          <span className={`change-badge ${trend}`}>
            <Icon name="trendUp" size={12} />
            {change}
          </span>
        </div>
      </div>
      <div className={`stats-icon ${color}`}>
        <Icon name={icon} size={24} />
      </div>
    </div>
  </div>
);

// Officer Card Component
const OfficerCard = ({ name, title, department, profileLink, status, onClick }) => (
  <div className="officer-card" onClick={() => onClick(profileLink)}>
    <div className="officer-avatar">
      <div className="avatar-circle">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className={`status-indicator ${status}`}></div>
    </div>
    <div className="officer-info">
      <h4 className="officer-name">{name}</h4>
      <p className="officer-title">{title}</p>
      <p className="officer-department">{department}</p>
    </div>
    <div className="officer-arrow">
      <Icon name="chevronRight" size={20} />
    </div>
  </div>
);

// Quick Action Component
const QuickAction = ({ icon, title, description, color, onClick }) => (
  <div className={`quick-action ${color}`} onClick={onClick}>
    <div className="quick-action-icon">
      <Icon name={icon} size={24} />
    </div>
    <div className="quick-action-content">
      <h4 className="quick-action-title">{title}</h4>
      <p className="quick-action-description">{description}</p>
    </div>
  </div>
);

// Recent Activity Component
const ActivityItem = ({ user, action, time, type }) => (
  <div className="activity-item">
    <div className={`activity-icon ${type}`}>
      <Icon name={type === 'user' ? 'users' : type === 'finance' ? 'finance' : 'projects'} size={16} />
    </div>
    <div className="activity-content">
      <p className="activity-text">
        <strong>{user}</strong> {action}
      </p>
      <span className="activity-time">{time}</span>
    </div>
  </div>
);

function AdminHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Hero slides data
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
      title: "Advanced Analytics Dashboard",
      subtitle: "Real-time insights and comprehensive control",
      description: "Monitor, analyze, and optimize your operations with powerful tools."
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      title: "Team Management Suite", 
      subtitle: "Streamline your workforce operations",
      description: "Efficiently manage your team with advanced tools and insights."
    },
    {
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop",
      title: "Smart Automation Hub",
      subtitle: "Automate workflows and boost productivity", 
      description: "Leverage automation to reduce manual tasks and increase efficiency."
    }
  ];

  // Stats data
  const stats = [
    { icon: "users", title: "Total Users", value: "12,543", change: "+12.5%", trend: "up", color: "blue" },
    { icon: "finance", title: "Revenue", value: "$842.3K", change: "+8.2%", trend: "up", color: "green" },
    { icon: "projects", title: "Active Projects", value: "127", change: "+3.1%", trend: "up", color: "purple" },
    { icon: "reports", title: "Reports", value: "89", change: "+5.4%", trend: "up", color: "orange" }
  ];

  // Officer data
  const officers = [
    { 
      name: 'Rebeka De Silva', 
      title: 'Financial Manager', 
      department: 'Finance Department',
      profileLink: '/profile/financial-manager',
      status: 'online'
    },
    { 
      name: 'Heshan Gunawardhena', 
      title: 'Assessment Officer', 
      department: 'Operations',
      profileLink: '/profile/assessment-officer',
      status: 'online'
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

  // Quick actions
  const quickActions = [
    { 
      icon: "users", 
      title: "User Management", 
      description: "Add, edit, or manage user accounts",
      color: "blue"
    },
    { 
      icon: "finance", 
      title: "Financial Reports", 
      description: "Generate and view financial analytics",
      color: "green"
    },
    { 
      icon: "projects", 
      title: "Project Overview", 
      description: "Monitor project progress and status",
      color: "purple"
    },
    { 
      icon: "settings", 
      title: "System Settings", 
      description: "Configure system preferences",
      color: "gray"
    }
  ];

  // Recent activities
  const activities = [
    { user: "John Doe", action: "created a new project", time: "2 hours ago", type: "projects" },
    { user: "Jane Smith", action: "updated financial report", time: "4 hours ago", type: "finance" },
    { user: "Mike Johnson", action: "added new team member", time: "6 hours ago", type: "user" },
    { user: "Sarah Wilson", action: "completed assessment", time: "8 hours ago", type: "projects" }
  ];

  // Navigation items
  const navItems = [
    { name: "Dashboard", icon: "dashboard", active: true, link: "/" },
    { name: "Users", icon: "users", active: false, link: "/users" },
    { name: "Finance", icon: "finance", active: false, link: "/finance" },
    { name: "Projects", icon: "projects", active: false, link: "/projects" },
    { name: "Reports", icon: "reports", active: false, link: "/reports" },
    { name: "Settings", icon: "settings", active: false, link: "/settings" }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleOfficerClick = (profileLink) => {
    navigate(profileLink);
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action clicked: ${action.title}`);
    // Navigate to specific page based on action
  };

  const handleNavClick = (item) => {
    navigate(item.link);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">A</div>
            {!sidebarCollapsed && <span className="logo-text">Admin Pro</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item);
              }}
            >
              <Icon name={item.icon} size={20} />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="header-title">Welcome back, Admin</h1>
            <p className="header-subtitle">Here's what's happening with your business today</p>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Icon name="search" size={20} />
              <input 
                type="text" 
                placeholder="Search anything..."
                className="search-input"
              />
            </div>
            <button className="notification-btn">
              <Icon name="bell" size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-avatar">
              <div className="avatar-circle admin">AD</div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-slider">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h2 className="hero-title">{slide.title}</h2>
                  <h3 className="hero-subtitle">{slide.subtitle}</h3>
                  <p className="hero-description">{slide.description}</p>
                  <button className="hero-btn">Get Started</button>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </section>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <QuickAction 
                  key={index} 
                  {...action} 
                  onClick={() => handleQuickAction(action)}
                />
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </section>
        </div>

        {/* Officers Section */}
        <section className="officers-section">
          <h2 className="section-title">Team Members</h2>
          <div className="officers-grid">
            {officers.map((officer, index) => (
              <OfficerCard 
                key={index} 
                {...officer} 
                onClick={handleOfficerClick}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminHome;