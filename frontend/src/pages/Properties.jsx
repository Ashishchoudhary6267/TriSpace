import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: 'All',
    city: 'All',
    maxRent: 'All'
  });

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/all`);
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
      setFilteredProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading properties:", err);
      setProperties([]);
      setFilteredProperties([]);
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

  // Apply filters
  const applyFilters = () => {
    let result = properties;

    // Search by title or location
    if (filters.searchTerm) {
      result = result.filter(prop =>
        (prop.title?.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (prop.address?.sectorOrPhase?.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (prop.address?.city?.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (filters.type !== 'All') {
      result = result.filter(prop => prop.type === filters.type);
    }

    // Filter by city
    if (filters.city !== 'All') {
      result = result.filter(prop => prop.address?.city === filters.city);
    }

    // Filter by max rent
    if (filters.maxRent !== 'All') {
      const maxRentValue = parseInt(filters.maxRent);
      result = result.filter(prop => prop.monthlyRent <= maxRentValue);
    }

    setFilteredProperties(result);
  };

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      type: 'All',
      city: 'All',
      maxRent: 'All'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Property</h1>
          <p className="text-gray-600 text-lg">Browse through our collection of verified properties</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Filter Properties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="searchTerm"
                placeholder="Title, location..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="All">All Types</option>
                <option value="Flat">Flat</option>
                <option value="Room">Room</option>
                <option value="PG">PG</option>
                <option value="House">House</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="All">All Cities</option>
                <option value="Mohali">Mohali</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Panchkula">Panchkula</option>
              </select>
            </div>

            {/* Max Rent Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Rent</label>
              <select
                name="maxRent"
                value={filters.maxRent}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="All">Any Budget</option>
                <option value="10000">Up to ₹10,000</option>
                <option value="20000">Up to ₹20,000</option>
                <option value="30000">Up to ₹30,000</option>
                <option value="50000">Up to ₹50,000</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 font-semibold">
            Showing <span className="text-blue-600">{filteredProperties.length}</span> properties
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block text-4xl mb-4">🔄</div>
            <p className="text-gray-600 text-lg">Loading properties...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-600 text-lg font-semibold">No properties found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {filteredProperties.map((property) => (
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
      </div>

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

export default Properties;
