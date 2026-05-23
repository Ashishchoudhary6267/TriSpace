import Login from '../components/Login';
import Register from '../components/Register';
import { useState } from 'react';
import Navbar from '../components/Navbar';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {isLogin ? <Login /> : <Register />}
          
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-6 text-blue-600 font-semibold hover:underline text-center py-2"
          >
            {isLogin ? "New to TriSpace? Create an account" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;