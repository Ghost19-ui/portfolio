import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import GlareCard from '../components/GlareCard';
import { Search, X, ExternalLink, Loader2 } from 'lucide-react'; // CLEANED IMPORTS

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

  // Filter Logic
  useEffect(() => {
    const results = certs.filter(cert => 
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCerts(results);
  }, [searchTerm, certs]);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 relative">
       {/* SEARCH BAR */}
       <div className="max-w-6xl mx-auto mb-12 flex justify-end relative z-10">
          <div className="relative group w-full md:w-64">
             <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="SEARCH_DB..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-black border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none transition-all"
             />
          </div>
       </div>

       {loading ? (
         <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-red-600" size={40}/></div>
       ) : (
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCerts.map(cert => (
               <div key={cert._id} onClick={() => setSelectedCert(cert)} className="cursor-pointer">
                  <GlareCard className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
                     <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                     <p className="text-red-400 text-sm tracking-widest uppercase mb-4">{cert.issuer}</p>
                     <p className="text-gray-500 text-xs">{cert.issueDate}</p>
                  </GlareCard>
               </div>
            ))}
         </div>
       )}

       {/* MODAL */}
       {selectedCert && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
               <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black">
                  <h3 className="font-bold text-red-500 uppercase tracking-widest">{selectedCert.title}</h3>
                  <button onClick={() => setSelectedCert(null)} className="text-gray-500 hover:text-white"><X size={24}/></button>
               </div>
               <div className="flex-grow p-4 bg-neutral-800 flex items-center justify-center overflow-auto">
                  {selectedCert.certUrl?.endsWith('.pdf') ? (
                     <iframe src={selectedCert.certUrl} className="w-full h-[60vh]" title="Cert PDF"></iframe>
                  ) : (
                     <img src={selectedCert.certUrl} alt="Certificate" className="max-w-full max-h-[60vh] object-contain" />
                  )}
               </div>
               <div className="p-4 border-t border-white/10 bg-black flex justify-end gap-3">
                  <a href={selectedCert.certUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2 bg-red-600 text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                     <ExternalLink size={16}/> OPEN ORIGINAL
                  </a>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default Certifications;