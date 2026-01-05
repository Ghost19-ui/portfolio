import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Shield } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col font-sans text-slate-100 selection:bg-red-500/30">
      
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'h-20 bg-black/90 backdrop-blur-md border-red-900/30 shadow-[0_4px_20px_-10px_rgba(220,38,38,0.5)]' 
            : 'h-24 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo Section - INCLUDES SUBTITLE */}
            <Link to="/" className="flex items-center gap-3 group">
              <Shield className={`text-red-600 transition-all duration-300 ${scrolled ? 'w-6 h-6' : 'w-8 h-8'}`} />
              <div className="flex flex-col">
                <span className={`font-bold text-white tracking-tight transition-all duration-300 font-mono ${
                  scrolled ? 'text-lg' : 'text-xl'
                }`}>
                  Tushar Kumar Saini
                </span>
                {/* THIS IS THE SUBTITLE YOU WANTED BACK */}
                <span className={`text-[10px] text-red-500 font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
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
                  className={`relative text-sm font-bold font-mono uppercase tracking-wider transition-colors py-2 group ${
                    location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) 
                    ? 'text-red-500' 
                    : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </Link>
              ))}
              
              {user ? (
                <Link to="/admin/dashboard" className="px-5 py-2 rounded border border-red-900/50 bg-red-950/20 text-xs font-bold text-red-500 hover:bg-red-600 hover:text-black transition-all font-mono uppercase tracking-widest">
                  Dashboard
                </Link>
              ) : (
                <Link to="/admin" className="px-5 py-2 rounded border border-gray-800 text-xs font-bold text-gray-500 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all font-mono uppercase tracking-widest">
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden pt-24 animate-in fade-in slide-in-from-top-10">
           <div className="px-6 py-8 space-y-6 font-mono border-t border-red-900/30">
              {['HOME', 'PROJECTS', 'BLOG', 'CONTACT'].map((item) => (
                <Link 
                  key={item}
                  to={item === 'HOME' ? '/' : `/${item.toLowerCase()}`} 
                  className="block text-xl font-bold text-slate-300 hover:text-red-500 hover:pl-2 transition-all border-b border-gray-900 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link 
                to="/admin" 
                className="block text-xl font-bold text-red-600 mt-8" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                [ ADMIN ACCESS ]
              </Link>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;