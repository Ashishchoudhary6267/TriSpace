import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PostProperty() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    return null;
  }

  const [formData, setFormData] = useState({
    title: '',
    type: 'Flat',
    sectorOrPhase: '',
    city: 'Mohali',
    monthlyRent: '',
    bhk: '1',
    size: '',
    description: '',
    amenities: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert("Please login again to post a property.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          monthlyRent: parseInt(formData.monthlyRent),
          owner: user.id,
          address: {
            sectorOrPhase: formData.sectorOrPhase,
            city: formData.city
          },
          bhk: formData.bhk,
          size: formData.size ? parseInt(formData.size) : null,
          description: formData.description,
          amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : []
        })
      });

      if (response.ok) {
        alert("✅ Property posted successfully! It's now pending admin review.");
        setFormData({
          title: '',
          type: 'Flat',
          sectorOrPhase: '',
          city: 'Mohali',
          monthlyRent: '',
          bhk: '1',
          size: '',
          description: '',
          amenities: ''
        });
        // Redirect back to home after 2 seconds
        setTimeout(() => navigate('/home'), 2000);
      } else {
        const data = await response.json();
        alert("❌ Error: " + (data.message || "Failed to post property"));
      }
    } catch (err) {
      console.error("Error posting property:", err);
      alert("❌ Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post Your Property</h1>
          <p className="text-gray-600">List your property on TriSpace and reach thousands of tenants</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          
          {/* Title Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title *</label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="e.g. Luxury 2BHK Flat near IT Park"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
                <select 
                  name="type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Flat">Flat</option>
                  <option value="PG">PG</option>
                  <option value="Room">Room</option>
                  <option value="House">House</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">BHK *</label>
                <select 
                  name="bhk"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.bhk}
                  onChange={handleChange}
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sq ft)</label>
                <input 
                  type="number" 
                  name="size"
                  placeholder="e.g. 800"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (₹) *</label>
                <input 
                  type="number" 
                  name="monthlyRent"
                  placeholder="e.g. 15000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sector / Phase / Area *</label>
                <input 
                  type="text" 
                  name="sectorOrPhase"
                  placeholder="e.g. Sector 62"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.sectorOrPhase}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <select 
                  name="city"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value="Mohali">Mohali</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Panchkula">Panchkula</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                name="description"
                placeholder="Describe your property, amenities, rules, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities (comma-separated)</label>
              <input 
                type="text" 
                name="amenities"
                placeholder="e.g. WiFi, AC, Parking, Gym, Security"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Note:</strong> Your property will be listed as "Pending" and will go live after admin approval.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
          >
            {loading ? "Posting..." : "Post Property 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostProperty;
