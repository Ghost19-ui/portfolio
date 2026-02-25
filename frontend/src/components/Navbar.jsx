import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { id: "home", label: "BASE" },
  { id: "projects", label: "OPS" },
  { id: "certs", label: "INTEL" },
  { id: "contact", label: "COMMS" },
];

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Simple scroll spy (only active on homepage)
  useEffect(() => {
    if (isAdminPage) return;
    const handleScroll = () => {
        const scrollPos = window.scrollY + 200;
        navItems.forEach((item) => {
          const section = document.getElementById(item.id);
          if (section && section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
            setActiveTab(item.id);
          }
        });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdminPage]);

  const scrollTo = (id) => {
    if (isAdminPage) {
        window.location.href = `/#${id}`; // Force redirect to home anchor
    } else {
        const element = document.getElementById(id);
        if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      {/* Main Nav pills */}
      {!isAdminPage && (
      <div className="bg-cyber-dark/90 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 flex gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => scrollTo(item.id)} className="relative px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest transition-colors duration-300">
            {activeTab === item.id && (
              <motion.div layoutId="active-pill" className="absolute inset-0 bg-cyber-red rounded-full mix-blend-difference" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            {/* INJECTED CYBER-LINK HERE */}
            <span className={`cyber-link relative z-10 ${activeTab === item.id ? "text-cyber-red" : "text-gray-400"}`}>
                {item.label}
            </span>
          </button>
        ))}
      </div>
      )}

      {/* Admin Button */}
      <div className="bg-cyber-dark/90 backdrop-blur-md border border-white/10 rounded-full p-2 flex gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {user ? (
            // INJECTED CYBER-LINK HERE
            <button onClick={logout} className="cyber-link p-2 text-cyber-red rounded-full" title="Logout">
                <LogOut size={18} />
            </button>
          ) : (
            // INJECTED CYBER-LINK HERE
            <Link to="/login" className="cyber-link p-2 text-gray-400 rounded-full" title="Admin Login">
                <Lock size={18} />
            </Link>
          )}
      </div>
    </div>
  );
};

export default Navbar;