import React, { useState } from 'react';
import API from '../api/axiosConfig';
import HoloCard from '../components/HoloCard';
import { Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [debugError, setDebugError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setDebugError('');
    try {
      await API.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Message Failed:", error);
      setStatus('error');
      if (error.response) {
         setDebugError(`Server Error (${error.response.status}): ${error.response.data.message || error.response.statusText}`);
      } else {
         setDebugError('Network Error: Check backend connection.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-2xl">
        <HoloCard title="ENCRYPTED_CHANNEL">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-mono text-white uppercase">Establish Uplink</h2>
          </div>
          {status === 'success' ? (
            <div className="bg-green-900/20 border border-green-500/50 p-6 rounded text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-400 font-mono font-bold">TRANSMISSION COMPLETE</p>
              <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-green-500 underline">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Agent Name" className="bg-black/80 border border-red-900/50 text-white p-3 rounded focus:border-red-500 outline-none text-sm" />
                 <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Secure Email" className="bg-black/80 border border-red-900/50 text-white p-3 rounded focus:border-red-500 outline-none text-sm" />
              </div>
              <textarea name="message" required rows="5" value={formData.message} onChange={handleChange} placeholder="Enter Payload..." className="w-full bg-black/80 border border-red-900/50 text-white p-3 rounded focus:border-red-500 outline-none text-sm resize-none"></textarea>
              
              {status === 'error' && (
                <div className="bg-red-900/20 border-l-2 border-red-500 p-2 text-xs text-red-300 font-mono">
                  ERROR: {debugError}
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="w-full bg-red-600 hover:bg-white hover:text-red-900 text-black font-bold py-3 uppercase transition-all flex items-center justify-center gap-2">
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} TRANSMIT
              </button>
            </form>
          )}
        </HoloCard>
      </div>
    </div>
  );
};
export default Contact;