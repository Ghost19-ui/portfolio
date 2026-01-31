import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, Terminal } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin'); // Redirect to Dashboard
    } catch (err) {
      setError('ACCESS_DENIED: Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black text-cyber-text relative overflow-hidden">
      <NeuralBackground />
      
      <div className="z-10 w-full max-w-md p-8 bg-cyber-dark/90 border border-cyber-red/30 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="flex justify-center mb-6">
           <div className="p-4 rounded-full bg-cyber-red/10 border border-cyber-red text-cyber-red animate-pulse">
             <Lock size={32} />
           </div>
        </div>
        
        <h2 className="text-2xl font-black font-mono text-center text-white mb-2">SECURITY CHECKPOINT</h2>
        <p className="text-center text-cyber-muted font-mono text-xs mb-8 tracking-widest">RESTRICTED AREA // AUTHORIZED PERSONNEL ONLY</p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-600/50 text-red-500 font-mono text-xs flex items-center gap-2">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2">Operator ID (Email)</label>
            <div className="relative">
              <Terminal className="absolute left-3 top-3 text-gray-500" size={16} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-cyber-red focus:ring-1 focus:ring-cyber-red transition-all font-mono"
                placeholder="operator@ghost19.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-cyber-red focus:ring-1 focus:ring-cyber-red transition-all font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyber-red text-black font-bold py-3 rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;