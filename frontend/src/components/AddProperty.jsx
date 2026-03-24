import { useState } from 'react';

function AddProperty({ onPropertyAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Flat',
    sectorOrPhase: '',
    city: 'Mohali',
    monthlyRent: '',
    owner: '69bfc24393a00f873ac36fac' // Hardcoded your ID for now!
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/properties/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We structure the body to match your Mongoose Schema
        body: JSON.stringify({
          ...formData,
          address: {
            sectorOrPhase: formData.sectorOrPhase,
            city: formData.city
          }
        })
      });

      if (response.ok) {
        alert("Property listed successfully! 🚀");
        setFormData({ title: '', type: 'Flat', sectorOrPhase: '', city: 'Mohali', monthlyRent: '', owner: '69bfc24393a00f873ac36fac' });
        onPropertyAdded(); // This refreshes the list automatically
      }
    } catch (err) {
      console.error("Error adding property:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">List a New Property</h2>
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
}

export default AddProperty;