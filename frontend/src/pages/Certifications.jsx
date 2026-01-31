import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import GlareCard from '../components/GlareCard';
import { 
  Search, Filter, X, ExternalLink, Shield, FileText, 
  Calendar, Lock, Terminal, CheckCircle, Database 
} from 'lucide-react';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);

  // Fetch Data
  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await API.get('/certificates');
        const dataArray = Array.isArray(data) ? data : [];
        setCerts(dataArray);
        setFilteredCerts(dataArray);
      } catch (error) {
        console.error("Failed to load certs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  // Filter Logic (Search by Title or Issuer)
  useEffect(() => {
    const results = certs.filter(cert => 
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCerts(results);
  }, [searchTerm, certs]);

  return (
    <div className="min-h-screen pt-24 p-4 max-w-7xl mx-auto font-mono bg-cyber-black text-cyber-text">
      
      {/* HEADER SECTION: "DATABASE" THEME — Neural Breach palette */}
      <div className="mb-10 border-b border-cyber-red/30 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-cyber-text mb-2 tracking-tighter flex items-center gap-3">
          <Database className="text-cyber-red" size={32} />
          CREDENTIAL_DB
        </h1>
        <p className="text-cyber-text/70 max-w-2xl flex items-center gap-2 text-xs md:text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          VERIFIED OPERATOR CERTIFICATIONS // ACCESS LEVEL: GRANTED
        </p>
      </div>

      {/* SEARCH HUD */}
      <div className="bg-cyber-dark/80 border border-white/10 p-4 rounded-lg mb-8 flex flex-col md:flex-row gap-4 items-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-cyber-red" size={18} />
          <input 
            type="text" 
            placeholder="QUERY DATABASE (NAME, ISSUER)..." 
            className="w-full bg-cyber-black border border-white/10 text-cyber-text pl-10 pr-4 py-2 rounded focus:border-cyber-red focus:outline-none uppercase placeholder-cyber-text/40 text-sm font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <div className="px-3 py-2 bg-cyber-red/20 border border-cyber-red/40 text-cyber-red text-xs font-bold rounded flex items-center gap-2 whitespace-nowrap">
            <Shield size={14} /> SECURITY CLEARANCE: L5
          </div>
          <div className="px-3 py-2 bg-cyber-dark border border-white/10 text-cyber-text/70 text-xs font-bold rounded flex items-center gap-2 whitespace-nowrap">
            <Filter size={14} /> RECORDS FOUND: {filteredCerts.length}
          </div>
        </div>
      </div>

      {/* GRID LAYOUT — 3D Glare cards */}
      {loading ? (
        <div className="text-center py-20">
          <Terminal size={48} className="text-cyber-red animate-pulse mx-auto mb-4" />
          <p className="text-cyber-red tracking-widest text-sm font-mono">DECRYPTING ARCHIVES...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <GlareCard
              key={cert._id}
              onClick={() => setSelectedCert(cert)}
              className="cursor-pointer h-full"
            >
              <div className="bg-cyber-dark border border-white/10 hover:border-cyber-red/50 transition-all duration-300 rounded-xl overflow-hidden shadow-lg group-hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] h-full flex flex-col">
                <div className="h-1 bg-gradient-to-r from-cyber-red to-transparent" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-cyber-red border border-cyber-red/30 px-2 py-1 rounded bg-cyber-red/10 uppercase tracking-widest truncate max-w-[70%]">
                      {cert.issuer}
                    </span>
                    <Shield className="text-cyber-text/40 group-hover:text-cyber-red transition-colors" size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-cyber-text mb-2 leading-tight group-hover:text-cyber-red/90 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <div className="w-full h-32 bg-cyber-black rounded border border-white/10 mb-4 overflow-hidden relative group-hover:border-cyber-red/30 transition-colors">
                    {cert.type === 'pdf' ? (
                      <div className="w-full h-full flex items-center justify-center bg-cyber-black">
                        <FileText size={40} className="text-cyber-text/50 group-hover:text-cyber-text transition-colors" />
                      </div>
                    ) : (
                      <img src={cert.image} alt="preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-cyber-black/80 text-cyber-text text-[10px] px-2 py-1 rounded border border-white/20 uppercase">
                        View File
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center text-xs text-cyber-text/60 pt-3 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {cert.date || 'ARCHIVED'}
                    </span>
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle size={10} /> VALID
                    </span>
                  </div>
                </div>
              </div>
            </GlareCard>
          ))}
        </div>
      )}

      {/* DETAIL MODAL (The "File Viewer") — Neural Breach palette */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cyber-black/90 backdrop-blur-sm" onClick={() => setSelectedCert(null)}>
          <div 
            className="bg-cyber-dark border border-cyber-red w-full max-w-4xl max-h-[90vh] rounded-lg relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(220,38,38,0.3)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-cyber-black">
              <div>
                <h2 className="text-sm md:text-xl text-cyber-text font-bold uppercase tracking-wider flex items-center gap-2">
                  <Lock size={16} className="text-cyber-red" /> 
                  CLASSIFIED DOC: <span className="text-cyber-red truncate max-w-[200px] md:max-w-md">{selectedCert.title}</span>
                </h2>
                <p className="text-[10px] text-cyber-text/60 font-mono mt-1">ISSUED BY: {selectedCert.issuer} // ID: {selectedCert._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedCert(null)} className="text-cyber-text/70 hover:text-cyber-text transition-colors bg-cyber-dark p-2 rounded hover:bg-cyber-red hover:text-cyber-black">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-6 bg-cyber-black/50 flex items-center justify-center">
              {selectedCert.type === 'pdf' || selectedCert.image?.endsWith?.('.pdf') ? (
                <iframe 
                  src={selectedCert.image} 
                  className="w-full h-[60vh] border border-white/10 rounded bg-white"
                  title="Certificate PDF"
                />
              ) : (
                <img 
                  src={selectedCert.image} 
                  alt="Full Certificate" 
                  className="max-w-full max-h-[65vh] object-contain border border-white/10 rounded shadow-2xl" 
                />
              )}
            </div>
            <div className="p-4 border-t border-white/10 bg-cyber-black flex justify-end gap-3 flex-wrap">
              <button onClick={() => setSelectedCert(null)} className="px-4 py-2 text-xs font-bold text-cyber-text/70 hover:text-cyber-text border border-white/20 rounded hover:border-cyber-red/50 transition-all uppercase font-mono">
                Close Viewer
              </button>
              <a 
                href={selectedCert.image} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2 text-xs font-bold bg-cyber-dark text-cyber-text rounded hover:bg-white/10 transition-all flex items-center gap-2 uppercase font-mono"
              >
                <ExternalLink size={14} /> Open Original
              </a>
              {selectedCert.link && (
                <a 
                  href={selectedCert.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-2 text-xs font-bold bg-cyber-red text-cyber-black rounded hover:bg-cyber-red/90 transition-all flex items-center gap-2 uppercase font-mono"
                >
                  <ExternalLink size={14} /> Verify Source
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;