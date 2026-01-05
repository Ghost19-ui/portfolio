import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100">
      
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'h-16 bg-black/80 backdrop-blur-md border-red-900/30 shadow-red-900/10 shadow-lg' 
            : 'h-24 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className={`text-2xl transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}>
                🛡️
              </span>
              <div className="flex flex-col">
                <span className={`font-bold text-white tracking-tight transition-all duration-300 font-mono ${
                  scrolled ? 'text-lg' : 'text-xl'
                }`}>
                  Tushar Kumar Saini
                </span>
                <span className={`text-[10px] text-red-500 font-mono uppercase tracking-widest transition-all duration-300 ${
                   scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                }`}>
                  Red Team Operator
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 items-center">
              {['Home', 'Projects', 'Blog', 'Contact'].map((item) => (
                <Link 
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className="relative text-sm font-medium text-slate-300 hover:text-red-500 transition-colors group py-2 font-mono uppercase tracking-wide"
                >
                  {item}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </Link>
              ))}
              
              {user ? (
                <Link to="/admin/dashboard" className="px-4 py-1.5 rounded border border-red-900 bg-red-900/10 text-xs font-bold text-red-500 hover:bg-red-600 hover:text-black transition-all font-mono uppercase">
                  Dashboard
                </Link>
              ) : (
                <Link to="/admin" className="px-4 py-1.5 rounded border border-gray-800 text-xs font-bold text-gray-500 hover:text-white hover:border-gray-500 transition-all font-mono uppercase">
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-red-900/30 md:hidden animate-slide-up">
           <div className="px-4 py-6 space-y-4 font-mono">
              <Link to="/" className="block text-lg font-medium text-slate-300 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
              <Link to="/projects" className="block text-lg font-medium text-slate-300 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>PROJECTS</Link>
              <Link to="/blog" className="block text-lg font-medium text-slate-300 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>INTEL REPORTS</Link>
              <Link to="/contact" className="block text-lg font-medium text-slate-300 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>UPLINK (CONTACT)</Link>
              <Link to="/admin" className="block text-lg font-medium text-red-600" onClick={() => setIsMobileMenuOpen(false)}>ADMIN ACCESS</Link>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-24 w-full relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;