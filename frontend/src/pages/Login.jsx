import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react'; // Added Eye & EyeOff
import { motion } from 'framer-motion'; 
import NeuralBackground from '../components/NeuralBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New State for visibility
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
              className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-white focus:border-red-600 outline-none font-mono transition-colors"
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Passcode</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // Dynamic Type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg py-3 pl-4 pr-12 text-white focus:border-red-600 outline-none font-mono transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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