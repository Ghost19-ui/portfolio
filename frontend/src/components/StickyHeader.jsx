import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

const StickyHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'BLOG', path: '/blog' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO SECTION - NAME REPLACEMENT */}
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <div className="flex flex-col">
              {/* UPDATED FULL NAME */}
              <span className="text-white font-bold font-mono text-lg tracking-wider">
                Tushar Kumar Saini
              </span>
              <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] uppercase">
                Red Team Operator
              </span>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-mono font-bold transition-colors duration-300 ${
                    location.pathname === link.path 
                      ? 'text-red-500' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin"
                className="px-4 py-2 border border-red-900/50 rounded text-xs font-mono text-red-500 hover:bg-red-900/20 transition-all"
              >
                LOGIN
              </Link>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-red-900/20 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-red-900/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-mono font-medium text-slate-300 hover:text-white hover:bg-red-900/20"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-mono font-medium text-red-500 hover:bg-red-900/20"
            >
              LOGIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default StickyHeader;