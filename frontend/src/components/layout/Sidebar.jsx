import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Sparkles, Zap, X, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-400 to-blue-500'
    },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: Package,
      gradient: 'from-indigo-500 to-indigo-600',
      hoverGradient: 'from-indigo-400 to-indigo-500'
    },
    { 
      path: '/campaigns', 
      label: 'AI Campaigns', 
      icon: Sparkles,
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-400 to-purple-500'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen fixed left-0 top-0 shadow-2xl border-r border-gray-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2.5 shadow-lg">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SmartRetail 360
            </h1>
            <p className="text-xs text-gray-400 font-medium">Retail Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 pt-6">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
            Navigation
          </p>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/50`
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`relative z-10 ${
                    isActive 
                      ? 'bg-white/20 p-2 rounded-lg' 
                      : 'group-hover:bg-gray-700/50 p-2 rounded-lg transition-colors'
                  }`}>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                  </div>
                  
                  {/* Label */}
                  <span className={`font-semibold relative z-10 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>

                  {/* Hover gradient effect */}
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.hoverGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-xl`}></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/50">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Powered by AI</p>
          <div className="flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-xs text-gray-400">SmartRetail 360</span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
