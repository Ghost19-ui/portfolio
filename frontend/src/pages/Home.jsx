import React from 'react';
import HoloCard from '../components/HoloCard';
import { Shield, Terminal, Download, Github, Linkedin, Instagram, ExternalLink, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-12 relative z-10">
      
      {/* Main Container - Centered Single Column like the reference */}
      <div className="w-full max-w-lg flex flex-col items-center gap-8">
        
        {/* --- 1. CIRCULAR PROFILE PHOTO WITH GLOWING RING --- */}
        <div className="relative group">
           {/* The Outer Glowing Ring (Red) */}
           <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-red-600 to-red-900 opacity-70 blur-md group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
           
           {/* The Inner Border/Container */}
           <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-2 bg-black border-4 border-red-600/50 shadow-[0_0_40px_rgba(220,38,38,0.4)] flex items-center justify-center overflow-hidden">
              <img 
                 src="/profile.jpeg" 
                 alt="Tushar Saini" 
                 className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-500"
              />
           </div>
        </div>

        {/* --- 2. CENTERED NAME & ROLE --- */}
        <div className="text-center space-y-3">
           <h1 className="text-4xl md:text-5xl font-bold font-mono text-white tracking-tighter">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Tushar</span>
           </h1>
           
           <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-sm md:text-base tracking-widest uppercase">
              <Shield size={16} />
              <span>Red Team Operator</span>
           </div>
        </div>

        {/* --- 3. BIO CARD (Keeping your Cyberpunk Style) --- */}
        <div className="w-full">
          <HoloCard title="MISSION_BRIEF">
             <p className="text-slate-300 font-mono text-sm leading-relaxed text-center">
                <span className="text-red-500 font-bold">B.Tech CSE Student</span> specializing in 
                <span className="text-white"> Offensive Security</span> and <span className="text-white">Red Teaming</span>. 
                Currently focused on Network Intrusion, Web App Security, and developing advanced exploitation tools.
                <br/><br/>
                Ready to deploy and demonstrate risk.
             </p>
          </HoloCard>
        </div>

        {/* --- 4. ACTION BUTTONS --- */}
        <div className="flex w-full gap-4 justify-center">
            <a 
              href="/resume.pdf" 
              download="Tushar_Saini_Resume.pdf"
              className="flex-1 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold py-3 rounded-lg text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
                <Download size={18} /> Resume
            </a>
            
            <Link 
              to="/contact" 
              className="flex-1 bg-red-600/10 border border-red-600 text-red-500 hover:bg-red-600 hover:text-black font-bold py-3 rounded-lg text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            >
                <Mail size={18} /> Contact
            </Link>
        </div>

        {/* --- 5. SOCIAL ICONS ROW --- */}
        <div className="flex gap-6 mt-2 p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm">
           <a href="https://github.com/Ghost19-ui" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-125 transition-all">
              <Github size={28} />
           </a>
           <a href="https://www.linkedin.com/in/tushar-kumar-saini-4138a72b2/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 hover:scale-125 transition-all">
              <Linkedin size={28} />
           </a>
           <a href="https://www.instagram.com/tushar_saini___19/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 hover:scale-125 transition-all">
              <Instagram size={28} />
           </a>
           <Link to="/projects" className="text-slate-400 hover:text-red-500 hover:scale-125 transition-all" title="View Projects">
              <Terminal size={28} />
           </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;