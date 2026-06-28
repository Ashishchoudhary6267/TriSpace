import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) {
      params.append('searchTerm', searchTerm.trim());
    }
    if (searchType) {
      params.append('type', searchType);
    }
    if (searchLocation.trim()) {
      params.append('city', searchLocation.trim());
    }
    if (searchPrice) {
      // Map price ranges to max values
      const priceMap = {
        '₹5,000 - ₹10,000': '10000',
        '₹10,000 - ₹20,000': '20000',
        '₹20,000+': '50000'
      };
      params.append('maxRent', priceMap[searchPrice] || searchPrice);
    }
    
    // Navigate to properties page with filters
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 pt-12 pb-20 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-2xl mr-2">✨</span>
              <span className="text-blue-600 font-semibold text-sm">Find Your Perfect Space</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Discover Comfortable <br />
              <span className="text-blue-600">Stays in Mohali</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Find the best flats, rooms and accommodations that fit your lifestyle and budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg">
                🔍 Explore Properties
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition">
                ❓ How it Works
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <p className="text-gray-600 font-medium">Happy Customers</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">300+</div>
                <p className="text-gray-600 font-medium">Verified Properties</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block relative">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl h-96 flex items-center justify-center shadow-2xl overflow-hidden">
              <img 
                src="/modern ap.png" 
                alt="Beautiful Modern Apartment" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-12 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What are you looking for?</label>
              <input
                type="text"
                placeholder="Flat, Room, PG, House..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Location</label>
              <input
                type="text"
                placeholder="Mohali, Punjab"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">All Types</option>
                <option value="Flat">Flat</option>
                <option value="Room">Room</option>
                <option value="PG">PG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Max Rent</label>
              <select
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Any Budget</option>
                <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                <option value="₹20,000+">₹20,000+</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
              >
                🔍 Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HeroSection;
