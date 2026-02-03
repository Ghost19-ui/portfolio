import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios"; 
import { Terminal, Github, Linkedin, Instagram, Mail, X, FileText } from "lucide-react";
import NeuralBackground from "../components/NeuralBackground";

// --- FALLBACK DATA (SAFETY NET) ---
const DEMO_DATA = {
  profile: {
    name: "TUSHAR SAINI",
    role: "RED TEAM OPERATOR",
    bio: "/// SYSTEM NOTICE: Live database connection established but awaiting content ingestion. \\n\\nSpecializing in Offensive Security, VAPT, and Hardware Hacking. Currently engaged in Red Team operations and tool development.",
    skills: ["VAPT", "Network Defense", "Python Automation", "BadUSB", "Linux Admin"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "contact@example.com"
  },
  projects: [],
  certificates: []
};

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/data/all-public-data');
        if (!res.data || !res.data.profile || !res.data.profile.name) {
            console.warn("Database empty. Loading Safety Net Protocol.");
            setData(DEMO_DATA);
        } else {
            setData(res.data);
        }
      } catch (err) {
        console.error("Connection Failed. Activating Offline Mode.", err);
        setData(DEMO_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-600 font-mono">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="animate-pulse">INITIALIZING UPLINK...</p>
    </div>
  );

  const { profile } = data;

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-red-900 selection:text-white relative overflow-x-hidden">
      <NeuralBackground />
      
      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20">
        
        {/* Holographic Circle Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-900/50 rounded-full bg-red-950/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-red-400 tracking-[0.2em]">OPERATOR_ONLINE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
            {profile.name}
          </h1>
          <h2 className="text-xl md:text-2xl text-red-500 font-mono mb-8 tracking-widest uppercase">
            {profile.role}
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 text-sm md:text-base border-l-2 border-red-900/50 pl-6 text-left">
            {profile.bio}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {profile.resumeUrl && (
                <button 
                  onClick={() => setShowResumeModal(true)}
                  className="px-8 py-3 bg-red-600 text-black font-bold text-sm tracking-widest hover:bg-white transition-all clip-path-polygon flex items-center gap-2"
                >
                  <FileText size={16} /> ACCESS_RESUME
                </button>
            )}
            <a href="#contact" className="px-8 py-3 border border-red-600/50 text-red-500 font-bold text-sm tracking-widest hover:bg-red-600/10 transition-all flex items-center gap-2">
              <Terminal size={16} /> ESTABLISH_COMMS
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex justify-center gap-6 text-gray-500">
            {profile.github && <a href={profile.github} target="_blank" className="hover:text-red-500 transition-colors"><Github size={20} /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" className="hover:text-red-500 transition-colors"><Linkedin size={20} /></a>}
            {profile.instagram && <a href={profile.instagram} target="_blank" className="hover:text-red-500 transition-colors"><Instagram size={20} /></a>}
            {profile.email && <a href={`mailto:${profile.email}`} className="hover:text-red-500 transition-colors"><Mail size={20} /></a>}
          </div>
        </motion.div>
      </section>

      {/* --- RESUME MODAL --- */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-5xl h-[85vh] bg-neutral-900 border border-red-900/50 rounded flex flex-col">
               <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black">
                  <h3 className="text-red-500 font-mono flex items-center gap-2"><FileText size={16}/> CLASSIFIED_DOCUMENT_VIEWER</h3>
                  <button onClick={() => setShowResumeModal(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
               </div>
               <div className="flex-grow bg-neutral-800">
                  <iframe src={profile.resumeUrl} className="w-full h-full" title="Resume PDF"></iframe>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;