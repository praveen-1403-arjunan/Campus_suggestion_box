import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Suggestion } from '../types';
import { getSuggestions, deleteSuggestion } from '../services/storage';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        if (user.role === 'admin') {
          setIsAuthenticated(true);
          fetchSuggestions();
        } else {
          // Redirect if not admin
          navigate('/home');
        }
      } else {
        // Redirect to login if not logged in
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await getSuggestions();
      setSuggestions(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this suggestion?')) {
      await deleteSuggestion(id);
      fetchSuggestions();
    }
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of student feedback and metrics</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 font-medium px-4 py-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-200 transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Suggestions</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{suggestions.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Academics</p>
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {suggestions.filter(s => s.category === 'Academics').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Facilities</p>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {suggestions.filter(s => s.category === 'Facilities').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-3 text-gray-500 text-sm">Loading data...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-gray-400 font-medium">No suggestions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {suggestions.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {s.name || <span className="text-gray-400 italic">Anonymous</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.category === 'Academics' ? 'bg-blue-100 text-blue-800' :
                        s.category === 'Facilities' ? 'bg-green-100 text-green-800' :
                          s.category === 'Events' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate" title={s.message}>
                      {s.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
