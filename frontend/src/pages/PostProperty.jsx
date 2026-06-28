import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PostProperty() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

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
      
      if (imageFiles.length === 0) {
        alert("Please select at least 1 image (up to 5).");
        setLoading(false);
        return;
      }

      let imageUrls = [];

      // Upload images first
      const uploadFormData = new FormData();
      imageFiles.forEach(file => uploadFormData.append('images', file));

      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/properties/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imageUrls = uploadData.imageUrls;
      } else {
        const errorData = await uploadRes.json();
        alert("❌ Image upload failed: " + (errorData.error || "Unknown error"));
        setLoading(false);
        return;
      }

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
          amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
          images: imageUrls,
          image: imageUrls.length > 0 ? imageUrls[0] : null
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
        setImageFiles([]);
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

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Images (Max 5)</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setImageFiles(prev => {
                    const combined = [...prev, ...newFiles];
                    if (combined.length > 5) {
                      alert('You can only upload a maximum of 5 images. Extra images were ignored.');
                      return combined.slice(0, 5);
                    }
                    return combined;
                  });
                  e.target.value = ''; // Reset input to allow selecting the same file again if removed
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-500 font-medium">Selected {imageFiles.length} file(s) (Max 5):</p>
                  <div className="flex flex-col gap-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="text-sm text-gray-700 truncate mr-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-700 font-bold text-lg leading-none px-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
