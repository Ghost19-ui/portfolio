import React from 'react';
import HoloCard from '../components/HoloCard';
import { Shield, Terminal, Download, Github, Linkedin, Instagram, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-start md:items-center justify-center p-4 pt-36 md:pt-20 relative z-10">
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* --- LEFT COLUMN (Desktop) / SECOND ITEM (Mobile) --- */}
        {/* On Mobile: order-2 (Comes after bio) */}
        {/* On Desktop: lg:order-1 (Comes first, on the left) */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
           
           {/* Profile Photo */}
           <div className="relative group w-full">
              <div className="absolute -inset-1 bg-gradient-to-b from-red-600 to-transparent opacity-30 blur-sm rounded-lg"></div>
              
              <div className="relative bg-black/80 backdrop-blur-md border border-red-900/50 p-2 rounded-lg clip-path-polygon-corner">
                 <img 
                    src="/profile.jpeg" 
                    alt="Tushar Saini" 
                    className="w-full h-auto object-cover rounded border border-white/10 transition-all duration-500"
                 />
              </div>
           </div>

           {/* Social Links */}
           <HoloCard title="CONNECT_UPLINK">
              <div className="space-y-3">
                 <a href="https://www.linkedin.com/in/tushar-kumar-saini-4138a72b2/" target="_blank" rel="noreferrer" 
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 transition-all group rounded cursor-pointer">
                    <div className="flex items-center gap-3">
                       <Linkedin size={18} className="text-slate-400 group-hover:text-blue-400" />
                       <span className="text-xs md:text-sm font-mono text-slate-300 group-hover:text-white">LinkedIn</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                 </a>

                 <a href="https://www.instagram.com/tushar_saini___19/" target="_blank" rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:border-pink-500 hover:bg-pink-500/10 transition-all group rounded cursor-pointer">
                    <div className="flex items-center gap-3">
                       <Instagram size={18} className="text-slate-400 group-hover:text-pink-400" />
                       <span className="text-xs md:text-sm font-mono text-slate-300 group-hover:text-white">Instagram</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-600 group-hover:text-pink-400 opacity-0 group-hover:opacity-100 transition-all" />
                 </a>

                 <a href="https://github.com/Ghost19-ui" target="_blank" rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 hover:border-white hover:bg-white/10 transition-all group rounded cursor-pointer">
                    <div className="flex items-center gap-3">
                       <Github size={18} className="text-slate-400 group-hover:text-white" />
                       <span className="text-sm font-mono text-slate-300 group-hover:text-white">GitHub</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                 </a>
              </div>
           </HoloCard>
        </div>

        {/* --- RIGHT COLUMN (Desktop) / FIRST ITEM (Mobile) --- */}
        {/* On Mobile: order-1 (Comes first, Top) */}
        {/* On Desktop: lg:order-2 (Comes second, on the right) */}
        <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
          <HoloCard title="OPERATOR_PROFILE">
             
             <div className="font-mono text-[10px] md:text-xs text-red-500 mb-4 opacity-80 border-l-2 border-red-600 pl-3">
                <p>&gt; ID: <span className="text-white">GHOST19-UI</span></p>
                <p>&gt; LEVEL: <span className="text-white">TOP SECRET</span></p>
                <p>&gt; STATUS: <span className="text-green-500 animate-pulse">ONLINE</span></p>
             </div>
             
             <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-mono text-white mb-3 md:mb-4 tracking-tighter leading-none">
                TUSHAR <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
                  SAINI
                </span>
             </h1>

             <h2 className="text-xs sm:text-sm md:text-xl text-slate-300 font-mono mb-6 md:mb-8 tracking-[0.1em] md:tracking-[0.2em] uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                Offensive Security Engineer
             </h2>

             <p className="text-slate-400 mb-6 font-mono text-[11px] sm:text-xs md:text-sm leading-5 md:leading-7 max-w-xl border-l-2 border-red-500/30 pl-4">
                Specializing in <span className="text-white font-bold">Network Intrusion</span>, 
                <span className="text-white font-bold"> Web App Security</span>, and 
                <span className="text-white font-bold"> Exploit Development</span>. 
                I don't just find bugs; I demonstrate the risk.
             </p>

             <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/projects" className="w-full sm:w-auto bg-red-600 text-black font-bold py-3 px-6 text-sm uppercase tracking-widest hover:bg-white transition-all clip-path-polygon flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer">
                    <Terminal size={16} /> View Operations
                </Link>
                
                <a 
                  href="/resume.pdf" 
                  download="Tushar_Saini_Resume.pdf"
                  className="w-full sm:w-auto border border-red-500 text-red-500 font-bold py-3 px-6 text-sm uppercase tracking-widest hover:bg-red-950/30 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] cursor-pointer text-center"
                >
                    <Download size={16} /> Download Intel
                </a>
             </div>
          </HoloCard>
        </div>

      </div>
    </div>
  );
};

export default Home;