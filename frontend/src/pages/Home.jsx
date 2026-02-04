import React, { useState, useEffect } from "react";
import API from "../api/axios"; 
import NeuralBackground from "../components/NeuralBackground";
import Projects from "./Projects";         // 👈 IMPORT THIS
import Certifications from "./Certifications"; // 👈 IMPORT THIS
import Contact from "./Contact";           // 👈 IMPORT THIS
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/data/all-public-data');
        if (res.data && res.data.profile) setProfile(res.data.profile);
      } catch (err) { console.error("Failed to load profile", err); }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <NeuralBackground />
      
      {/* 1. HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center items-center p-6 pt-20">
        <div className="z-10 text-center space-y-6 max-w-4xl">
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
              {profile?.name || "TUSHAR SAINI"}
           </h1>
           <p className="text-red-500 font-mono text-lg tracking-widest uppercase">
              {profile?.role || "RED TEAM OPERATOR"}
           </p>
           <p className="max-w-2xl mx-auto text-gray-400 font-mono leading-relaxed">
              {profile?.bio || "Connecting to secure database..."}
           </p>
           <div className="flex justify-center gap-6 pt-8">
              {profile?.github && <a href={profile.github} target="_blank" className="hover:text-red-500"><Github /></a>}
              {profile?.linkedin && <a href={profile.linkedin} target="_blank" className="hover:text-red-500"><Linkedin /></a>}
              {profile?.email && <a href={`mailto:${profile.email}`} className="hover:text-red-500"><Mail /></a>}
           </div>
        </div>
      </section>

      {/* 2. STACKED SECTIONS FOR SCROLLING */}
      <section id="projects"><Projects /></section>
      <section id="certs"><Certifications /></section>
      <section id="contact"><Contact /></section>
    </div>
  );
};
export default Home;