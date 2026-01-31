import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
         <Navbar /> {/* Ensure Navbar handles conditionally showing Login/Admin link if you want */}
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} /> 
            {/* Note: You should wrap AdminDashboard in a PrivateRoute component normally */}
         </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;