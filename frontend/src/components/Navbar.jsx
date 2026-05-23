import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/home')}>
            <div className="text-3xl font-bold">
              <span className="text-blue-600">Tri</span>
              <span className="text-gray-900">Space</span>
            </div>
            <span className="ml-2 text-2xl">🏠</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/home')} className="text-gray-700 hover:text-blue-600 font-medium transition">Home</button>
            <button onClick={() => navigate('/properties')} className="text-gray-700 hover:text-blue-600 font-medium transition">Properties</button>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Rooms</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">About Us</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Contact</a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-2xl text-gray-600 hover:text-red-500 transition">❤️</button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/post-property')}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Post Property
                </button>
                <div className="relative group">
                  <button className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600">
                    {user.name || 'Account'} ▼
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </button>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => navigate('/admin-dash')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 p-4 space-y-4">
          <button onClick={() => navigate('/home')} className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium">Home</button>
          <button onClick={() => navigate('/properties')} className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium">Properties</button>
          <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">Rooms</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">About Us</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">Contact</a>
          <hr className="my-4" />
          {user ? (
            <div className="space-y-2">
              <button className="block w-full text-left text-gray-700 font-medium">Profile</button>
              {user.role === 'admin' && (
                <button 
                  onClick={() => {
                    navigate('/admin-dash');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 font-medium"
                >
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
