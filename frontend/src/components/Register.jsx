import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Tenant' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await registerUser(formData);
      setMessage('✅ Registration successful! Now try logging in.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Join TriSpace</h2>
      <p className="text-gray-500 mb-8 font-medium">Create an account in Mohali, Chandigarh, or Panchkula</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" required disabled={loading} />
        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" required disabled={loading} />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" required disabled={loading} />
        <select value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 outline-none bg-white" disabled={loading}>
          <option value="Tenant">I'm a Tenant</option>
        </select>
        <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition transform active:scale-95">{loading ? 'Creating Account...' : 'Create Account'}</button>
      </form>
      {message && <p className={`mt-4 font-bold text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}

export default Register;