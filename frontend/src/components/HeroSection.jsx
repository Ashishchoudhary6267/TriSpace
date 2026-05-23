import { useState } from 'react';

function HeroSection() {
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log({ searchType, searchLocation, searchPrice });
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center mb-4 px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-2xl mr-2">✨</span>
              <span className="text-blue-600 font-semibold text-sm">Find Your Perfect Space</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Discover Comfortable <br />
              <span className="text-blue-600">Stays in Mohali</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find the best flats, rooms and accommodations that fit your lifestyle and budget.
            </p>

            <div className="flex gap-4 mb-12">
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
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl h-96 flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-8xl mb-4">🏠</div>
                <p className="text-gray-600 font-semibold">Beautiful Modern Apartment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-16 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What are you looking for?</label>
              <input
                type="text"
                placeholder="Flat, Room, PG, House..."
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
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
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option>All Types</option>
                <option>Flat</option>
                <option>Room</option>
                <option>PG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Max Rent</label>
              <select
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Any Budget</option>
                <option>₹5,000 - ₹10,000</option>
                <option>₹10,000 - ₹20,000</option>
                <option>₹20,000+</option>
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
