import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import CyberGlobe from '../components/CyberGlobe'; 
import HoloCard from '../components/HoloCard'; 
import FadeUpSection from '../components/FadeUpSection'; // 👈 INJECTED COMPONENT
import { Loader2, Github, ExternalLink, Terminal, AlertTriangle } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get('/projects');
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      <CyberGlobe />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header Section Wrapped */}
        <FadeUpSection delay={0.1}>
          <div className="mb-12 border-b border-red-900/30 pb-4 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                  <Terminal className="text-red-600" size={32} />
                  <h1 className="text-4xl font-bold tracking-tighter">OPERATIONS_LOG</h1>
              </div>
              <p className="text-red-500 text-sm tracking-widest ml-11">:: DEPLOYED TOOLS & ARSENAL ::</p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500">TOTAL_ASSETS: {projects.length}</p>
              <p className="text-xs text-gray-500">STATUS: ACTIVE</p>
            </div>
          </div>
        </FadeUpSection>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Added 'index' to map to create the staggered cascading effect.
                  Moved the 'key' to the outermost FadeUpSection wrapper.
                */}
                {projects.map((project, index) => (
                  <FadeUpSection key={project._id} delay={0.2 + (index * 0.1)}>
                    <HoloCard title={project.title}>
                      <div className="flex flex-col h-full">
                          {/* Image/Thumbnail */}
                          {project.imageUrl && (
                              <div className="h-40 mb-4 rounded overflow-hidden border border-white/10 relative group">
                                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                  <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay"></div>
                              </div>
                          )}

                          <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
                              {project.description}
                          </p>

                          {/* Tech Stack Badges */}
                          <div className="flex flex-wrap gap-2 mb-6">
                              {project.techStack && project.techStack.map((tech, i) => (
                                  <span key={i} className="text-[10px] uppercase font-bold bg-white/5 border border-white/10 px-2 py-1 rounded text-red-400">
                                      {tech}
                                  </span>
                              ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-auto">
                              <a href="#" className="flex-1 text-center py-2 border border-gray-700 rounded text-xs hover:bg-white hover:text-black transition-all flex justify-center gap-2 items-center">
                                  <Github size={14}/> SOURCE
                              </a>
                              {project.liveLink && (
                                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-red-900/20 border border-red-900/50 rounded text-xs text-red-500 hover:bg-red-600 hover:text-white transition-all flex justify-center gap-2 items-center">
                                      <ExternalLink size={14}/> DEPLOY
                                  </a>
                              )}
                          </div>
                      </div>
                    </HoloCard>
                  </FadeUpSection>
                ))}
              </div>
            ) : (
              // Empty State Wrapped
              <FadeUpSection delay={0.2}>
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-red-900/30 rounded-xl bg-red-950/5">
                  <AlertTriangle size={48} className="text-red-900 mb-4" />
                  <p className="text-red-500 text-lg font-mono tracking-widest">NO ASSETS DEPLOYED</p>
                  <p className="text-gray-600 text-sm mt-2">Database awaiting injection via Admin Console.</p>
                </div>
              </FadeUpSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;