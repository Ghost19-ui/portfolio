import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Ensure this filename matches what you created (axios.js or axiosConfig.js)
import API from "../api/axios"; 
import { Terminal, Github, Linkedin, Instagram, ExternalLink, Shield, Cpu, Lock, Mail, Phone, X, FileText, ArrowRightCircle } from "lucide-react";
import NeuralBackground from "../components/NeuralBackground";

const Home = () => {
  // Initialize with null to distinguish between "loading" and "empty"
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This connects to https://your-site.vercel.app/api/data/all-public-data
        const res = await API.get('/data/all-public-data');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
        // Do NOT set fake data here. Let the UI show an error or empty state
        // so you know the connection failed.
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Loading State
  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono">
        <div className="animate-pulse">&gt; INITIALIZING_UPLINK...</div>
    </div>
  );

  // 2. Empty Database State (Prevents Crash)
  if (!data || !data.profile) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-gray-400 font-mono p-4 text-center">
        <NeuralBackground />
        <h1 className="text-3xl text-red-500 mb-4">SYSTEM ONLINE</h1>
        <p className="mb-6">Database connection established, but no portfolio data found.</p>
        <a href="/admin" className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all rounded">
          LOGIN TO ADMIN PANEL
        </a>
      </div>
    );
  }

  const { profile, projects, certificates } = data;

  return (
    <div className="bg-black min-h-screen text-gray-200 selection:bg-red-900 selection:text-white pb-32 font-sans overflow-x-hidden">
      <NeuralBackground />

      {/* --- HERO --- */}
      <section id="home" className="min-h-screen flex flex-col justify-center items-center relative z-10 px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-500/30 text-red-500 text-xs tracking-[0.2em] mb-8 font-mono">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>SYSTEM_ONLINE
           </div>
           <h1 className="text-5xl md:text-8xl font-black font-mono tracking-tighter text-white mb-6 relative">
              <span className="relative z-10">{profile.name ? profile.name.split(" ")[0] : "USER"}<span className="text-red-600">{profile.name ? profile.name.split(" ")[1] : "NAME"}</span></span>
           </h1>
           <p className="text-gray-400 font-mono max-w-xl mx-auto text-lg">
             <span className="text-red-500">&gt;</span> {profile.bio || "System Ready. Waiting for input."}
           </p>
        </motion.div>

        {/* BENTO GRID */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl w-full auto-rows-[minmax(160px,auto)]"
        >
          {/* 1. PROFILE & CONTACT CARD */}
          <div className="md:col-span-2 md:row-span-2 bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"/>
            
            {/* Photo */}
            <div className="w-24 h-24 rounded-full border-2 border-red-600 p-1 mb-4 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              <img src={profile.about?.avatar?.url || "/profile.jpeg"} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold font-mono text-white">{profile.name}</h2>
            <p className="text-red-500 tracking-widest text-xs mt-1 mb-6 font-mono">{profile.role || "OPERATOR"}</p>

            {/* Contact & Socials */}
            <div className="w-full border-t border-white/10 pt-4 flex flex-col gap-3 text-sm font-mono text-gray-400">
                {profile.email && <div className="flex items-center justify-center gap-2"><Mail size={14} className="text-red-500"/> {profile.email}</div>}
                {profile.phone && <div className="flex items-center justify-center gap-2"><Phone size={14} className="text-red-500"/> {profile.phone}</div>}
                
                <div className="flex justify-center gap-4 mt-2">
                    {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><Github size={20}/></a>}
                    {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><Linkedin size={20}/></a>}
                    {profile.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><Instagram size={20}/></a>}
                </div>
            </div>
          </div>

          {/* 2. LIVE RESUME TERMINAL */}
          <div className="md:col-span-2 md:row-span-1 bg-black border border-white/10 rounded-2xl p-4 font-mono text-xs relative overflow-hidden group cursor-pointer" onClick={() => setShowResumeModal(true)}>
             <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center justify-between text-gray-500 mb-2 pb-2 border-b border-white/5">
                <div className="flex gap-2 items-center"><Terminal size={14} className="text-red-500" /> <span>LIVE_INTEL_FEED</span></div>
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
             </div>
             <div className="space-y-1 text-gray-500">
                <p>&gt; Establishing secure connection...</p>
                <p>&gt; Fetching latest dossier (PDF)...</p>
                <p className="text-red-500 animate-pulse">&gt; CLICK TO ACCESS CLASSIFIED DOCUMENT</p>
             </div>
             <FileText size={60} className="absolute bottom-4 right-4 text-red-500 opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-300"/>
          </div>

          {/* 3. SKILLS LIST */}
          <div className="md:col-span-2 md:row-span-1 bg-neutral-900/50 border border-white/10 rounded-2xl p-6 font-mono text-xs overflow-hidden">
             <div className="flex items-center gap-2 text-gray-500 mb-4 pb-2 border-b border-white/5">
                <Cpu size={14} /> <span>SKILL_MATRIX</span>
             </div>
             <div className="grid grid-cols-2 gap-2">
               {profile.skills && profile.skills.length > 0 ? profile.skills.map((s,i) => (
                 <div key={i} className="bg-white/5 px-3 py-2 rounded border border-white/5 flex justify-between items-center">
                   <span className="text-gray-400">{s}</span>
                   <span className="text-red-500 text-[10px]">[OK]</span>
                 </div>
               )) : (
                 <div className="text-gray-500">No skills listed.</div>
               )}
             </div>
          </div>
        </motion.div>
      </section>

      {/* --- RESUME MODAL --- */}
      <AnimatePresence>
        {showResumeModal && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
                <div className="bg-neutral-900 border border-white/10 w-full max-w-4xl h-[80vh] rounded-xl relative flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/50 font-mono">
                        <h3 className="text-white flex items-center gap-2"><FileText size={16} className="text-red-500"/> CLASSIFIED_RESUME.pdf</h3>
                        <button onClick={() => setShowResumeModal(false)} className="text-gray-400 hover:text-white"><X size={24}/></button>
                    </div>
                    <div className="flex-1 bg-white/5 relative">
                        {profile.resumeUrl ? (
                            <iframe src={profile.resumeUrl} className="w-full h-full" title="Resume"></iframe>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-red-500">&gt; ERROR: NO INTEL UPLOADED.</div>
                        )}
                    </div>
                    {profile.resumeUrl && (
                        <a href={profile.resumeUrl} download className="p-4 bg-red-600 text-black text-center font-bold font-mono hover:bg-red-500 transition-colors">DOWNLOAD PDF</a>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>


      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-20 px-4 max-w-6xl mx-auto">
         <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-black font-mono text-white">OPERATIONS</h2>
            <div className="h-px bg-red-600 flex-1 opacity-50"/>
         </div>
         {projects.length === 0 ? <div className="text-center text-gray-500 font-mono">&gt; No operations declassified yet.</div> : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, i) => (
               <motion.div key={proj._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                 className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden group hover:border-red-500/50 transition-all"
               >
                  <div className="h-48 bg-black/50 relative">
                    {proj.imageUrl ? <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"/> : <div className="w-full h-full flex items-center justify-center text-gray-600"><Cpu size={40}/></div>}
                    <div className="absolute top-4 right-4 p-2 bg-black/80 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {proj.liveLink && <a href={proj.liveLink} target="_blank"><ExternalLink size={16} className="text-red-500"/></a>}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 font-mono">{proj.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 font-sans">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {proj.techStack && proj.techStack.map((t, idx) => <span key={idx} className="px-2 py-1 bg-white/5 text-[10px] font-mono text-gray-300 rounded border border-white/5">{t}</span>)}
                    </div>
                  </div>
               </motion.div>
            ))}
         </div>
         )}
      </section>

      {/* --- CERTIFICATIONS SECTION --- */}
      <section id="certs" className="py-20 px-4 max-w-6xl mx-auto">
         <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-red-600 flex-1 opacity-50"/>
            <h2 className="text-3xl md:text-5xl font-black font-mono text-white text-right">INTELLIGENCE</h2>
         </div>
         {certificates.length === 0 ? <div className="text-center text-gray-500 font-mono">&gt; No certifications uploaded.</div> : (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certificates.map((cert) => (
               <motion.div key={cert._id} whileHover={{ y: -5 }} className="relative h-64 bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-xl p-6 flex flex-col justify-between overflow-hidden group cursor-pointer">
                 
                 <div className="absolute inset-0 bg-gradient-to-tr from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>
                 
                 <div className="flex justify-between relative z-10">
                    <Shield className="text-red-500"/>
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest">{cert.issueDate}</span>
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-1 font-mono">{cert.title}</h3>
                    <p className="text-gray-500 text-sm uppercase tracking-widest font-mono">{cert.issuer}</p>
                 </div>
                 <div className="flex justify-between items-center relative z-10">
                    <div className="flex gap-1"><div className="w-1 h-1 bg-red-500 rounded-full"></div><div className="w-1 h-1 bg-red-500 rounded-full"></div><div className="w-1 h-1 bg-red-500 rounded-full"></div></div>
                    {cert.certUrl && <a href={cert.certUrl} target="_blank" className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRightCircle size={20}/></a>}
                 </div>
               </motion.div>
            ))}
         </div>
         )}
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 px-4 border-t border-white/5 bg-black/50 text-center">
          <Lock className="mx-auto text-red-500 mb-6" size={48} />
          <h2 className="text-3xl font-bold font-mono text-white mb-6">ESTABLISH UPLINK</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto font-sans">
            Secure channel open. Available for VAPT, Red Team engagements, or secure development projects.
          </p>
          {profile.email && <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-black font-bold font-mono rounded-lg hover:bg-red-500 transition-all"><Mail size={18}/> INITIATE EMAIL</a>}
      </section>

    </div>
  );
};

export default Home;