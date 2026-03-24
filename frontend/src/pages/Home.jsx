import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this!
import AddProperty from '../components/AddProperty';

function Home() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  const fetchProperties = () => {
  fetch('http://localhost:5000/api/properties/all')
    .then(res => res.json())
    .then(data => setProperties(data));
};

const handleLogout = () => {
  // In a real app, we would clear tokens here. 
  // For now, we just whisk the user back to the entry door.
  navigate('/');
};

  useEffect(() => {
    fetch('http://localhost:5000/api/properties/all')
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error("Error loading properties:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
                <h1 className="text-3xl font-extrabold text-blue-800">TriSpace 🏠</h1>
                <p className="text-gray-500 text-sm">Explore Tricity Properties</p>
            </div>
            
            <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition active:scale-95"
            >
                Logout
            </button>
            </header>
          <AddProperty onPropertyAdded={fetchProperties} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:scale-105 transition-transform">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {property.type}
                    </span>
                    <span className="text-2xl font-bold text-green-600">₹{property.monthlyRent}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4 font-medium italic">📍 {property.address.sectorOrPhase}, {property.address.city}</p>
                  
                  <div className="border-t pt-4 flex gap-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                      View Details
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400">Searching for properties in the Tricity area...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;