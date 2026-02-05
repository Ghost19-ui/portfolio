import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios"; 
import { Github, Linkedin, Instagram, Mail, X, FileText } from "lucide-react";
import NeuralBackground from "../components/NeuralBackground";
import Projects from "./Projects";         
import Certifications from "./Certifications"; 
import Contact from "./Contact";           

const Home = () => {
  const [data, setData] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/data/all-public-data');
        setData(res.data);
      } catch (err) {
        console.error("Failed to load public data", err);
      }
    };
    fetchData();
  }, []);

  const profile = data?.profile || {};

  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-900 selection:text-white">
      <NeuralBackground />
      
      {/* --- SECTION 1: HERO (ID="home") --- */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center items-center p-6 pt-20">
        <div className="z-10 text-center space-y-6 max-w-4xl">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block border border-red-600/30 bg-red-900/10 px-4 py-1 rounded-full">
              <span className="text-red-500 font-mono text-sm tracking-[0.2em]">SYSTEM_ONLINE :: V.4.0.1</span>
           </motion.div>
           
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
              {profile.name || "TUSHAR SAINI"}
           </h1>
           
           {/* 👇 FIXED: Using profile.title instead of profile.role */}
           <p className="text-red-500 font-mono text-lg tracking-widest uppercase">
              {profile.title || "RED TEAM OPERATOR"}
           </p>
           
           <p className="max-w-2xl mx-auto text-gray-400 font-mono leading-relaxed border-l-2 border-red-900 pl-4 text-left">
              {profile.bio || "/// INITIALIZING... Connecting to secure database."}
           </p>

           {/* Social Links */}
           <div className="flex justify-center gap-6 pt-8">
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><Github /></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><Linkedin /></a>}
              {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><Instagram /></a>}
              {profile.email && <a href={`mailto:${profile.email}`} className="hover:text-red-500 transition-colors"><Mail /></a>}
           </div>

           {/* Resume Button */}
           {profile.resumeUrl && (
             <div className="pt-4">
               <button onClick={() => setShowResumeModal(true)} className="px-6 py-2 border border-red-600 text-red-500 hover:bg-red-600 hover:text-black transition-all font-mono text-xs tracking-widest uppercase">
                 VIEW_CLASSIFIED_RESUME
               </button>
             </div>
           )}
        </div>
      </section>

      {/* --- SECTION 2: PROJECTS (ID="projects") --- */}
      <section id="projects" className="relative z-10">
        <Projects /> 
      </section>

      {/* --- SECTION 3: CERTIFICATES (ID="certs") --- */}
      <section id="certs" className="relative z-10">
        <Certifications />
      </section>

      {/* --- SECTION 4: CONTACT (ID="contact") --- */}
      <section id="contact" className="relative z-10">
        <Contact />
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
                  <iframe src={profile.resumeUrl} className="w-full h-full" title="Resume"></iframe>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;