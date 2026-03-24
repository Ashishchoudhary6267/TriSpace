import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [pendingList, setPendingList] = useState([]);

  // Load the "Pending" properties when the page opens
  const fetchPending = () => {
    fetch('http://localhost:5000/api/properties/admin/pending')
      .then(res => res.json())
      .then(data => setPendingList(data));
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id) => {
    const response = await fetch(`http://localhost:5000/api/properties/approve/${id}`, {
      method: 'PATCH'
    });
    if (response.ok) {
      alert("Property Approved and Live! ✅");
      fetchPending(); // Refresh the list
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Admin Control Center 🔐</h1>
      
      <div className="grid gap-6">
        {pendingList.length === 0 ? (
          <p className="text-gray-400 italic">No pending requests. Great job, Ashish!</p>
        ) : (
          pendingList.map(prop => (
            <div key={prop._id} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{prop.title}</h3>
                <p className="text-slate-400">📍 {prop.address.sectorOrPhase}, {prop.address.city}</p>
                <p className="text-blue-400 font-bold mt-2">Rent: ₹{prop.monthlyRent}</p>
              </div>
              
              <button 
                onClick={() => handleApprove(prop._id)}
                className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold transition transform active:scale-95"
              >
                Approve & Go Live
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;