import React from 'react';
import HoloCard from '../components/HoloCard';
import { Shield, Terminal, Download, Github, Linkedin, Instagram, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    // Changed items-center to items-start for better vertical alignment in this layout
    <div className="min-h-screen flex items-start justify-center p-4 pt-36 md:pt-28 relative z-10">
      
      {/* Increased gap for the split layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* =========================================================
            LEFT COLUMN: BIO, NAME, & SOCIALS
            (Order-1 on mobile and desktop)
           ========================================================= */}
        <div className="w-full lg:col-span-7 flex flex-col gap-8 order-1">
          
          {/* --- BLOCK 1: THE OPERATOR PROFILE --- */}
          <HoloCard title="OPERATOR_PROFILE">
             <div className="font-mono text-[10px] md:text-xs text-red-500 mb-4 opacity-80 border-l-2 border-red-600 pl-3">
                <p>&gt; ID: <span className="text-white">GHOST19-UI</span></p>
                <p>&gt; STATUS: <span className="text-green-500 animate-pulse">ONLINE</span></p>
             </div>
             
             {/* Big Name */}
             <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-mono text-white mb-4 tracking-tighter leading-none">
                TUSHAR <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-900">
                  SAINI
                </span>
             </h1>

             {/* Role with static "typewriter" feel - keep it simple and robust */}
             <h2 className="text-xl sm:text-2xl md:text-3xl text-red-500 font-mono mb-6 tracking-wider uppercase flex items-center gap-3">
                <span className="inline-block w-3 h-3 bg-red-500 animate-pulse"></span>
                Offensive Security Engineer
             </h2>

             <p className="text-slate-400 mb-8 font-mono text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-red-500/30 pl-6 py-2 bg-black/40 rounded-r">
                I don't just find bugs; I demonstrate the risk. Specializing in <span className="text-red-400 font-bold">Network Intrusion</span>, 
                <span className="text-red-400 font-bold"> Web App Security</span>, and 
                <span className="text-red-400 font-bold"> Red Teaming Operations</span>. 
             </p>

             {/* CTAs */}
             <div className="flex flex-wrap gap-4">
                <Link to="/projects" className="bg-red-600 text-black font-bold py-3 px-8 text-sm uppercase tracking-widest hover:bg-white transition-all clip-path-polygon flex items-center justify-center gap-2 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                    <Terminal size={18} /> View Operations
                </Link>
                
                <a href="/resume.pdf" download className="border border-red-500 text-red-500 font-bold py-3 px-8 text-sm uppercase tracking-widest hover:bg-red-950/50 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                    <Download size={18} /> CV / Resume
                </a>
             </div>
          </HoloCard>

          {/* --- BLOCK 2: SOCIAL UPLINKS (Moved below bio) --- */}
          <HoloCard title="CONNECT_UPLINK">
              {/* Changed to flex row for a more horizontal look fitting under the bio */}
              <div className="flex flex-wrap gap-4">
                 <SocialLink href="https://www.linkedin.com/in/tushar-kumar-saini-4138a72b2/" icon={Linkedin} label="LinkedIn" color="blue" />
                 <SocialLink href="https://www.instagram.com/tushar_saini___19/" icon={Instagram} label="Instagram" color="pink" />
                 <SocialLink href="https://github.com/Ghost19-ui" icon={Github} label="GitHub" color="white" />
              </div>
          </HoloCard>
        </div>

        {/* =========================================================
            RIGHT COLUMN: LARGE PHOTO AREA
            (Order-2 on mobile and desktop)
           ========================================================= */}
        <div className="w-full lg:col-span-5 order-2 flex justify-center lg:justify-end">
           
           {/* The Photo Container - Made larger and "freer" */}
           <div className="relative group w-full max-w-md lg:max-w-full">
              {/* Stronger, larger red glow background effect */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-red-700/40 via-red-900/20 to-transparent blur-2xl rounded-[30px] group-hover:from-red-600/60 transition-all duration-1000"></div>
              
              {/* The main photo frame - slightly looser border than before */}
              <div className="relative z-10 bg-black/60 backdrop-blur-xl border-2 border-red-900/80 p-3 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all">
                 {/* Scanline overlay effect */}
                 <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 pointer-events-none z-20"></div>
                 
                 <img 
                    src="/profile.jpeg" 
                    alt="Tushar Saini Operator" 
                    className="w-full h-auto object-cover rounded-xl border border-white/5 contrast-110 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                 />
                 
                 {/* Corner accents */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// Helper component for cleaner social links (kept the original style)
const SocialLink = ({ href, icon: Icon, label, color }) => {
  const colorClasses = {
    blue: "hover:border-blue-500 hover:bg-blue-500/10 text-slate-400 group-hover:text-blue-400",
    pink: "hover:border-pink-500 hover:bg-pink-500/10 text-slate-400 group-hover:text-pink-400",
    white: "hover:border-white hover:bg-white/10 text-slate-400 group-hover:text-white"
  };

  return (
    <a href={href} target="_blank" rel="noreferrer" 
       className={`flex-1 min-w-[120px] flex items-center justify-between p-3 bg-white/5 border border-white/10 transition-all group rounded cursor-pointer ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
       <div className="flex items-center gap-3">
          <Icon size={18} className={colorClasses[color].split(' ').slice(2).join(' ')} />
          <span className="text-xs font-mono text-slate-300 group-hover:text-white">{label}</span>
       </div>
       <ExternalLink size={12} className={`${colorClasses[color].split(' ').slice(2).join(' ')} opacity-0 group-hover:opacity-100 transition-all`} />
    </a>
  );
}

export default Home;