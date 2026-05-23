import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Properties from './pages/Properties';
import AdminDashboard from './pages/AdminDashboard';
import PostProperty from './pages/PostProperty';

function App() {
  return (
    <Router>
      <Routes>
        {/* If the URL is just '/', show the Auth page */}
        <Route path="/" element={<Auth />} />
        
        {/* If the URL is '/home', show the Home page */}
        <Route path="/home" element={<Home />} />

        {/* If the URL is '/properties', show all properties */}
        <Route path="/properties" element={<Properties />} />
        
        {/* If the URL is '/post-property', show the Post Property form */}
        <Route path="/post-property" element={<PostProperty />} />
        
        {/* If the URL is '/admin-dash', show the Admin Dashboard */}
        <Route path="/admin-dash" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;