import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🚀 Tushar Saini
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-300 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-300 transition">About</Link>
          <Link to="/projects" className="hover:text-blue-300 transition">Projects</Link>
          <Link to="/contact" className="hover:text-blue-300 transition">Contact</Link>
          
          {user && user.role === 'admin' ? (
            <>
              <Link to="/admin" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
