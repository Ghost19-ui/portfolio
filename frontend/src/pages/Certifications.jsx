import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import HoloCard from '../components/HoloCard';
import { Award, ExternalLink, FileText, Calendar, CheckCircle } from 'lucide-react';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await API.get('/certificates');
        setCerts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <div className="min-h-screen pt-24 p-4 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-white mb-4">
          CREDENTIALS <span className="text-red-600">ACQUIRED</span>
        </h1>
        <p className="text-slate-400 font-mono max-w-2xl mx-auto">
          Verified certifications and authorizations validating operational capabilities.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-red-500 font-mono animate-pulse">Scanning Database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div key={cert._id} className="relative group">
              {/* Card Container */}
              <div className="h-full bg-black/40 border border-red-900/30 rounded-xl overflow-hidden hover:border-red-500 transition-all duration-300 flex flex-col">
                
                {/* Image/PDF Preview */}
                <div className="h-48 bg-gray-900/50 relative overflow-hidden group-hover:bg-gray-900/80 transition-all flex items-center justify-center p-4">
                  {cert.type === 'pdf' ? (
                     <FileText size={64} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                  ) : (
                     <img 
                        src={cert.image} 
                        alt={cert.title} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                     />
                  )}
                  
                  {/* Overlay Action Button */}
                  <a 
                    href={cert.image} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                  >
                    <span className="bg-red-600 text-black font-bold px-4 py-2 rounded text-xs uppercase flex items-center gap-2">
                        <ExternalLink size={14} /> View Document
                    </span>
                  </a>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-900/50 px-2 py-0.5 rounded bg-red-950/20">
                            {cert.issuer}
                        </span>
                        {cert.date && (
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                <Calendar size={12} /> {cert.date}
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-red-400 transition-colors">
                        {cert.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-green-500 text-xs font-mono">
                            <CheckCircle size={12} /> Verified
                        </div>
                        {cert.link && (
                            <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                                Credential Link <ExternalLink size={10} />
                            </a>
                        )}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;