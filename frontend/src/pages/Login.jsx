import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react'; // REMOVED Unused Icons
import { motion } from 'framer-motion'; 
import NeuralBackground from '../components/NeuralBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin'); 
    } catch (err) {
      setError('ACCESS_DENIED: Invalid Credentials');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <NeuralBackground />
      
      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-md p-8 bg-black/80 border border-red-900/50 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.1)]"
      >
        <div className="flex justify-center mb-6">
           <div className="p-4 rounded-full bg-red-900/20 border border-red-600/50 text-red-500">
             <Lock size={32} />
           </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 tracking-widest font-mono text-red-500">SECURITY CHECKPOINT</h2>
        <p className="text-center text-gray-500 text-xs mb-8 uppercase tracking-widest">Authorized Personnel Only</p>

        {error && (
          <div className="bg-red-950/50 border-l-4 border-red-600 p-3 mb-6">
             <span className="text-xs font-mono text-red-400">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Operator ID</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-red-600 outline-none font-mono"
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-red-600 outline-none font-mono"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 text-black font-bold py-3 rounded-lg hover:bg-white transition-all uppercase tracking-widest"
          >
            AUTHENTICATE
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;