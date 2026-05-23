import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/all`);
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user favorites
  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUserFavorites(data.map(fav => fav._id));
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (propertyId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to manage your favorites!");
      navigate('/');
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/properties/favorite/${propertyId}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserFavorites(data.favorites || []);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Popular Listings Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Popular Listings</h2>
              <p className="text-gray-600">Check out our most viewed properties</p>
            </div>
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 text-lg">
              View All →
            </a>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="animate-spin">🔄</div>
              </div>
              <p className="text-gray-600 mt-4">Loading properties...</p>
            </div>
          )}

          {/* No Properties */}
          {!loading && properties.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-2xl mb-2">🏚️</p>
              <p className="text-gray-600 text-lg">No properties available yet</p>
            </div>
          )}

          {/* Properties Grid */}
          {!loading && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {properties.slice(0, 8).map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={userFavorites.includes(property._id)}
                  onFavoriteClick={handleToggleFavorite}
                  onDetailsClick={setSelectedProperty}
                />
              ))}
            </div>
          )}

          {/* View All Button */}
          {properties.length > 8 && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg">
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Have a property to list?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of property owners who trust TriSpace to find perfect tenants
          </p>
          <button
            onClick={() => user ? navigate('/post-property') : navigate('/')}
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg text-lg"
          >
            Post Your Property
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                <span className="text-blue-500">Tri</span>Space
              </div>
              <p>Find your perfect space in Tricity</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Follow Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2026 TriSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isFavorite={userFavorites.includes(selectedProperty._id)}
          onFavoriteClick={() => handleToggleFavorite(selectedProperty._id)}
        />
      )}
    </div>
  );
}

export default Home;