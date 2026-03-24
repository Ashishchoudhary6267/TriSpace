import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* If the URL is just '/', show the Auth page */}
        <Route path="/" element={<Auth />} />
        
        {/* If the URL is '/home', show the Home page */}
        <Route path="/home" element={<Home />} />
        {/* If the URL is '/admin', show the Admin Dashboard */}
        <Route path="/admin-dash" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;