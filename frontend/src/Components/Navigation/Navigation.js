import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  Building,
  Menu,
  Search,
  Bell
} from 'lucide-react';

const Navigation = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route

  const navItems = [
    { name: "Home", icon: TrendingUp, link: "/mainhome" },
    { name: "Dashboard", icon: TrendingUp, active: true, link: "/adminHome" },
    
    { name: "Citizens", icon: Users, link: "/users" },
    { name: "Finance", icon: DollarSign, link: "/financial" },
    { name: "Services", icon: FileText, link: "/admincheck" },
    { name: "Reports", icon: BarChart3, link: "/reports" },
    { name: "Inventory", icon: BarChart3, active: false, link: "/inventory" },


    { name: "Settings", icon: Settings, link: "/settings" }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl 
        border-r border-gray-200/50 transition-all duration-300 z-50 
        ${sidebarCollapsed ? 'w-20' : 'w-72'} shadow-xl`}
      >
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Urban Council
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.link; // ✅ auto check active

            return (
              <a
                key={index}
                href={item.link}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.link);
                }}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-semibold text-sm">{item.name}</span>
                )}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Top Header */}
      <header
        className={`bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 transition-all duration-300 
        ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}
      >
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Horana Urban Council
              </h1>
              <p className="text-gray-600 font-medium">
                නගර සභා කළමනාකරණ පද්ධතිය
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search across all modules..."
                  className="pl-10 pr-4 py-3 w-80 border border-gray-200 rounded-xl bg-gray-50/50 
                  focus:bg-white focus:border-blue-500 focus:outline-none 
                  focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  5
                </span>
              </button>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AD</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;
