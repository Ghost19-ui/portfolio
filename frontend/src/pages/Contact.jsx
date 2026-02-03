import React, { useState } from 'react';
import API from '../api/axios';
import HoloCard from '../components/HoloCard';
import { Send, Loader2, AlertTriangle } from 'lucide-react'; // REMOVED CheckCircle

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: 'Portfolio Inquiry', 
    message: '' 
  });
  const [status, setStatus] = useState('idle');
  const [debugError, setDebugError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setDebugError('');

    try {
      await API.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Portfolio Inquiry', message: '' });
    } catch (error) {
      console.error("Transmission Failed:", error);
      setStatus('error');
      if (error.response) {
        setDebugError(JSON.stringify(error.response.data));
      } else {
        setDebugError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#330000_0%,_#000000_70%)] opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-2xl">
        <HoloCard title="ENCRYPTED_CHANNEL">
          {status === 'success' ? (
            <div className="text-center py-12">
               <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                 <Send className="text-green-500" size={32} />
               </div>
               <h3 className="text-xl font-bold text-green-500 mb-2">TRANSMISSION SUCCESSFUL</h3>
               <p className="text-gray-400 text-sm">Target has received your payload.</p>
               <button onClick={() => setStatus('idle')} className="mt-6 text-xs text-red-500 hover:text-white underline">SEND ANOTHER</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs text-red-500 font-bold uppercase tracking-widest mb-2">Identify</label>
                   <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-red-600 outline-none" placeholder="Your Name" />
                </div>
                <div>
                   <label className="block text-xs text-red-500 font-bold uppercase tracking-widest mb-2">Return Address</label>
                   <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-red-600 outline-none" placeholder="email@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-red-500 font-bold uppercase tracking-widest mb-2">Payload Data</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-red-600 outline-none resize-none" placeholder="Enter message..."></textarea>
              </div>

              {status === 'error' && (
                <div className="bg-red-900/20 border-l-2 border-red-600 p-3 flex items-center gap-3">
                   <AlertTriangle className="text-red-500" size={16} />
                   <p className="text-xs text-red-400 font-mono">TRANSMISSION ERROR: {debugError || "Server Unreachable"}</p>
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="w-full bg-red-600 hover:bg-white hover:text-black text-black font-bold py-4 uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                 {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> TRANSMIT</>}
              </button>
            </form>
          )}
        </HoloCard>
      </div>
    </div>
  );
};

export default Contact;