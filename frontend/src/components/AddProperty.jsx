import { useState } from 'react';

function AddProperty({ onPropertyAdded }) {

  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    title: '',
    type: 'Flat',
    sectorOrPhase: '',
    city: 'Mohali',
    monthlyRent: '',
    image: null,
    owner: user?.id // Use the logged-in user's ID
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!formData.image) {
      alert('Please select an image first');
      return;
    }

    setUploading(true);
    const fileFormData = new FormData();
    fileFormData.append('image', formData.image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fileFormData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image: data.imageUrl });
        alert('Image uploaded successfully!');
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Safety Check: If no user is found, stop here! 
    if (!user || !user.id) {
      alert("Please login again to post a property.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image: typeof formData.image === 'string' ? formData.image : null,
          owner: user.id,
          address: {
            sectorOrPhase: formData.sectorOrPhase,
            city: formData.city
          }
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Property listed successfully! 🚀");
        setFormData({ title: '', type: 'Flat', sectorOrPhase: '', city: 'Mohali', monthlyRent: '', image: null, owner: user?.id });
        setImagePreview(null);
        onPropertyAdded();
      } else if (response.status === 403) {
        alert("Your session has expired. Please log out and log back in.");
        localStorage.clear();
        window.location.href = '/';
      } else {
        alert(`Error: ${responseData.message || 'Failed to add property'}`);
      }
    } catch (err) {
      console.error("Error adding property:", err);
      alert("Network error. Please try again.");
    }
  };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">List a New Property</h2>
      
      {/* Image Upload Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Property Image</label>
        <div className="flex gap-4">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="p-2 border rounded-lg flex-1"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading || !formData.image}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
          </div>
        )}
        {typeof formData.image === 'string' && formData.image && (
          <p className="mt-2 text-green-600 text-sm">✅ Image uploaded successfully!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          type="text" placeholder="Title (e.g. Luxury 1BHK)" 
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required 
        />
        <select 
          className="p-3 border rounded-xl bg-white"
          value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="Flat">Flat</option>
          <option value="PG">PG</option>
          <option value="Room">Room</option>
        </select>
        <input 
          type="number" placeholder="Rent (₹)" 
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.monthlyRent} onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})} required 
        />
        <input 
          type="text" placeholder="Sector / Phase" 
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.sectorOrPhase} onChange={(e) => setFormData({...formData, sectorOrPhase: e.target.value})} required 
        />
        <select 
          className="p-3 border rounded-xl bg-white"
          value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
        >
          <option value="Mohali">Mohali</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Panchkula">Panchkula</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
          Post Listing
        </button>
      </form>
    </div>
  );


export default AddProperty;