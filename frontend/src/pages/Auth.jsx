import Login from '../components/Login';
import Register from '../components/Register';
import { useState } from 'react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {isLogin ? <Login /> : <Register />}
        
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-blue-600 font-semibold hover:underline"
        >
          {isLogin ? "New to TriSpace? Create an account" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}

export default Auth;