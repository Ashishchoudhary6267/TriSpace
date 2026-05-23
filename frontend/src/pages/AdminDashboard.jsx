import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Guard: Redirect non-admin users back to /home
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert("Access Denied! Admins only.");
      navigate('/home');
      return;
    }
    fetchPending();
  }, []);

  // Load the "Pending" properties when the page opens
  const fetchPending = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/properties/admin/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setPendingList(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error loading pending list:", err);
        setPendingList([]);
      })
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("✅ Property Approved and Live!");
        fetchPending();
      } else {
        alert("❌ Error approving property");
      }
    } catch (err) {
      console.error("Error approving:", err);
      alert("❌ Error approving property");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this property?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/reject/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("❌ Property Rejected and Removed!");
        fetchPending();
      } else {
        alert("❌ Error rejecting property");
      }
    } catch (err) {
      console.error("Error rejecting:", err);
      alert("❌ Error rejecting property");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Control Center 🔐</h1>
          <p className="text-gray-600">Review and approve pending property listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">{pendingList.length}</div>
            <p className="text-gray-600">Pending Approvals</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-2">--</div>
            <p className="text-gray-600">Approved Today</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">--</div>
            <p className="text-gray-600">Total Live Listings</p>
          </div>
        </div>

        {/* Pending Properties */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Pending Listings for Review</h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">Loading pending properties...</p>
            </div>
          )}

          {/* No Pending Properties */}
          {!loading && pendingList.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-gray-600 text-lg font-semibold">No pending requests!</p>
              <p className="text-gray-500">All properties have been reviewed.</p>
            </div>
          )}

          {/* Pending Properties List */}
          {!loading && pendingList.length > 0 && (
            <div className="divide-y divide-gray-200">
              {pendingList.map((prop) => (
                <div key={prop._id} className="p-6 hover:bg-gray-50 transition flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{prop.title || "Unnamed Property"}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">
                          📍 {prop.address?.sectorOrPhase || "Unknown"}, {prop.address?.city || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Rent</p>
                        <p className="font-semibold text-green-600 text-lg">
                          ₹{prop.monthlyRent?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900">{prop.type || "FLAT"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Posted by</p>
                        <p className="font-semibold text-gray-900">{prop.postedBy?.name || "Unknown"}</p>
                      </div>
                    </div>

                    {prop.description && (
                      <p className="text-gray-600 text-sm mb-4">{prop.description}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(prop._id)}
                      className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition transform active:scale-95"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(prop._id)}
                      className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition transform active:scale-95"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;