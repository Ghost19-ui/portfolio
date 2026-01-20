import React, { useEffect, useState } from 'react';
import HoloCard from '../components/HoloCard';
import { Shield, Terminal, Download, Github, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axiosConfig';

const Home = () => {
  // Default State (Fallback Data) to prevent blank screen
  const [profile, setProfile] = useState({
    name: "TUSHAR SAINI",
    role: "Red Team Operator",
    bio: "Specializing in Network Intrusion, Web App Security, and Exploit Development.",
    skills: ["Python", "Kali Linux", "Burp Suite"],
    socials: {
        github: "https://github.com/Ghost19-ui",
        linkedin: "https://www.linkedin.com/in/tushar-kumar-saini-4138a72b2/",
        instagram: "https://www.instagram.com/tushar_saini___19/"
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const { data } = await API.get('/profile');
            // Only update if data exists, otherwise keep fallback
            if(data) setProfile(data); 
        } catch (error) {
            console.log("Using default profile (API not connected)");
        }
    };
    fetchProfile();
  }, []);

  // SAFE GUARD: If profile somehow becomes null, show loading or fallback
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-red-500">Loading Interface...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-12 relative z-10">
      <div className="w-full max-w-xl">
        
        <HoloCard title="OPERATOR_IDENTITY // GHOST19-UI">
          <div className="flex flex-col items-center text-center space-y-6 pt-4 pb-2">
            
            {/* PHOTO */}
            <div className="relative group">
               <div className="absolute -inset-0.5 rounded-full bg-red-600 opacity-50 blur-md group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
               <div className="relative w-40 h-40 rounded-full p-1 bg-black border-2 border-red-500/80 shadow-[0_0_20px_rgba(220,38,38,0.5)] overflow-hidden">
                  <img src="/profile.jpeg" alt={profile?.name || "Operator"} className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" title="Status: Online"></div>
            </div>

            {/* NAME & ROLE (Safe Access) */}
            <div className="space-y-2">
               <h1 className="text-4xl md:text-5xl font-bold font-mono text-white tracking-tighter uppercase">
                  {profile?.name || "TUSHAR SAINI"}
               </h1>
               <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-sm tracking-[0.2em] uppercase bg-red-950/30 py-1 px-3 rounded border border-red-900/50 inline-block">
                  <Shield size={14} className="inline" /> {profile?.role || "Red Team Operator"}
               </div>
            </div>

            {/* BIO & SKILLS (Safe Access) */}
            <div className="w-full border-t border-b border-red-900/30 py-6 my-2 bg-white/5">
               <p className="text-slate-200 font-mono text-base md:text-lg leading-relaxed max-w-md mx-auto px-4 mb-4 whitespace-pre-line">
                  {profile?.bio || "System Online."}
               </p>
               <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto px-2">
                  {profile?.skills?.map((skill, index) => (
                     <span key={index} className="text-[10px] uppercase font-bold font-mono text-red-300 bg-red-950/40 border border-red-900/60 px-2 py-1 rounded hover:border-red-500 hover:text-white transition-colors cursor-default">
                        {skill}
                     </span>
                  ))}
               </div>
            </div>

            {/* SOCIALS (Safe Access with ?.) */}
            <div className="flex gap-6 text-slate-400">
               {profile?.socials?.github && (
                   <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-white hover:scale-110 transition-all flex flex-col items-center gap-1 group">
                      <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 border border-white/10 group-hover:border-white/50 transition-all"><Github size={24} /></div>
                   </a>
               )}
               {profile?.socials?.linkedin && (
                   <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-400 hover:scale-110 transition-all flex flex-col items-center gap-1 group">
                      <div className="p-3 bg-white/5 rounded-full group-hover:bg-blue-500/10 border border-white/10 group-hover:border-blue-500/50 transition-all"><Linkedin size={24} /></div>
                   </a>
               )}
               {profile?.socials?.instagram && (
                   <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-500 hover:scale-110 transition-all flex flex-col items-center gap-1 group">
                      <div className="p-3 bg-white/5 rounded-full group-hover:bg-pink-500/10 border border-white/10 group-hover:border-pink-500/50 transition-all"><Instagram size={24} /></div>
                   </a>
               )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-4 pt-4 border-t border-gray-800">
                <Link to="/projects" className="flex-1 bg-red-600 text-black font-bold py-3 rounded hover:bg-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    <Terminal size={18} /> Operations
                </Link>
                <a href="/resume.pdf" download className="flex-1 border border-red-600 text-red-500 font-bold py-3 rounded hover:bg-red-900/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                    <Download size={18} /> Intel (PDF)
                </a>
            </div>

          </div>
        </HoloCard>
      </div>
    </div>
  );
};

export default Home;