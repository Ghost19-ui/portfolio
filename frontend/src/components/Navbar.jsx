import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Terminal, FileText, User, Mail, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/', icon: <User size={14} /> },
    { name: 'PROJECTS', path: '/projects', icon: <Terminal size={14} /> },
    { name: 'CERTIFICATIONS', path: '/certifications', icon: <Award size={14} /> }, // NEW LINK
    { name: 'BLOG', path: '/blog', icon: <FileText size={14} /> },
    { name: 'CONTACT', path: '/contact', icon: <Mail size={14} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="text-red-600 group-hover:rotate-12 transition-transform" size={24} />
            <span className="font-bold font-mono text-white tracking-wider group-hover:text-red-500 transition-colors">
              GHOST19-UI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold font-mono tracking-widest transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-red-500 bg-red-900/10 border border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              {/* Dashboard Button (Only if logged in) */}
              {user && (
                <Link 
                  to="/admin/dashboard" 
                  className="ml-4 px-4 py-1.5 border border-red-600 text-red-500 text-xs font-bold rounded hover:bg-red-600 hover:text-black transition-all uppercase"
                >
                  DASHBOARD
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-red-900/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-bold font-mono border-l-2 transition-all ${
                  isActive(link.path)
                    ? 'border-red-500 bg-red-900/10 text-white'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {user && (
                 <Link 
                  to="/admin/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-red-500 font-bold font-mono border-t border-white/10 mt-2"
                >
                  <Terminal size={14} /> ACCESS DASHBOARD
                </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;