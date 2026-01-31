import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import CyberGlobe from '../components/CyberGlobe'; // <--- UPDATED IMPORT
import { Loader2, Github, ExternalLink, Terminal } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get('/projects');
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        setError("Connection to database failed. Payload retrieval aborted.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* 1. REPLACED MISSING BACKGROUND WITH CYBERGLOBE */}
      <CyberGlobe />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="mb-12 border-b border-red-900/30 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="text-red-600" size={32} />
            <h1 className="text-4xl font-bold text-white tracking-tight">OPERATIONAL_TOOLS</h1>
          </div>
          <p className="text-red-500 text-sm tracking-[0.2em] uppercase">
            :: VAPT Arsenal & Offensive Security Projects ::
          </p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800 text-red-400 p-4 rounded-lg text-center mb-8 font-mono text-sm">
            [ERROR] {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <Loader2 className="animate-spin text-red-600" size={64} />
          </div>
        ) : (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project._id} className="group bg-black/80 backdrop-blur-sm border border-gray-800 hover:border-red-600 transition-all duration-300 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-[0_0_25px_rgba(220,38,38,0.15)]">
                    
                    {/* Image / Header Area */}
                    <div className="h-48 overflow-hidden relative border-b border-gray-900">
                      {/* Red Overlay that disappears on hover */}
                      <div className="absolute inset-0 bg-red-900/30 z-10 group-hover:bg-transparent transition-all duration-500"/>
                      {/* Scanline effect */}
                      <div className="absolute inset-0 z-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                      
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow relative">
                      {/* ID Badge */}
                      <div className="absolute top-4 right-4 text-[10px] text-gray-600 font-mono group-hover:text-red-500 transition-colors">
                        ID: {project._id.slice(-4)}
                      </div>

                      <h3 className="text-xl font-bold text-red-600 mb-3 group-hover:text-white transition-colors tracking-wide">
                        {project.title}
                      </h3>
                      
                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, i) => (
                          <span key={i} className="text-[10px] uppercase border border-gray-700 px-2 py-0.5 text-gray-400 rounded group-hover:border-red-900 group-hover:text-red-400 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow font-sans border-l-2 border-gray-800 pl-3 group-hover:border-red-900 transition-colors">
                        {project.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-4 mt-auto">
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-red-600 hover:text-black py-2 rounded text-xs font-bold transition-all border border-gray-800 tracking-wider uppercase"
                        >
                          <Github size={14} /> Source
                        </a>
                        
                        {project.liveLink && (
                           <a 
                            href={project.liveLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-white hover:text-black py-2 rounded text-xs font-bold transition-all border border-gray-800 tracking-wider uppercase"
                          >
                            <ExternalLink size={14} /> Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-red-900/50 rounded-xl bg-black/50 backdrop-blur-sm">
                <p className="text-red-500 text-lg font-mono">No operational tools deployed.</p>
                <p className="text-gray-600 text-sm mt-2">System awaiting payloads...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;