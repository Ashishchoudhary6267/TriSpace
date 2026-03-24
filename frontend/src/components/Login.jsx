import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this line!

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();


      if (response.ok) {
        setMessage("✅ " + data.message);
        setTimeout(() => {
         navigate('/home'); 
       }, 1500);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Connection error. Is the backend running?");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-8 font-medium">Log in to manage your TriSpace listings</p>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="ashish@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition transform active:scale-95"
        >
          Sign In
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-bold ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;