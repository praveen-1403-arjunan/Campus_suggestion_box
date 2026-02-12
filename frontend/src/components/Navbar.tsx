
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-indigo-700 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            CampusSuggestionBox
          </span>
        </Link>
        <div className="flex space-x-2">
          <Link
            to="/home"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${location.pathname === '/home'
              ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
              : 'text-gray-600 border-transparent hover:text-indigo-700 hover:bg-gray-50'
              }`}
          >
            Submit Suggestion
          </Link>
          {/* Only show Admin Portal to admins (naive check for now, backend protects actual data) */}
          {localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'admin' && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${location.pathname === '/admin'
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                : 'text-gray-600 border-transparent hover:text-indigo-700 hover:bg-gray-50'
                }`}
            >
              Admin Portal
            </Link>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('userInfo');
              window.location.href = '/welcome';
            }}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors border text-red-600 border-transparent hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
