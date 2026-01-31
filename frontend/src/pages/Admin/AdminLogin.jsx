import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import { Shield, Lock, ChevronRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import HoloCard from '../../components/HoloCard';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user state is already valid
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', formData);
      
      // 1. Save Token
      login(data.token);
      
      // 2. Navigate smoothly (AuthContext now handles the state instantly)
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error("Login Failed:", err);
      setError('ACCESS DENIED: Invalid Security Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-lg">
        <HoloCard title="IDENTITY_VERIFICATION_V2">
          
          <div className="text-center mb-8 border-b border-red-900/30 pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-950/20 rounded-full border border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Shield className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-widest uppercase mb-1">
              Restricted <span className="text-red-600">Access</span>
            </h1>
            <p className="text-xs text-red-400 font-mono tracking-[0.2em] opacity-80">
              // AUTHORIZED PERSONNEL ONLY //
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-950/40 border-l-4 border-red-600 text-red-200 p-3 font-mono text-xs flex items-center gap-3 animate-pulse">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-red-500 uppercase tracking-widest font-bold font-mono">Operator ID</label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/80 border border-red-900/50 text-white p-3 pl-10 rounded outline-none focus:border-red-500 transition-all font-mono text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                  placeholder="admin@system.io"
                />
                <Shield className="absolute left-3 top-3 text-red-700 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-red-500 uppercase tracking-widest font-bold font-mono">Security Token</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/80 border border-red-900/50 text-white p-3 pl-10 pr-10 rounded outline-none focus:border-red-500 transition-all font-mono text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3 text-red-700 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-3 text-red-700 hover:text-red-400 transition-colors z-10 cursor-pointer"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-white hover:text-red-900 text-black font-bold py-4 uppercase tracking-[0.2em] transition-all clip-path-polygon flex items-center justify-center gap-2 mt-4 group"
            >
              {loading ? <span className="animate-pulse">Handshaking...</span> : 
              <>Establish Uplink <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </HoloCard>
      </div>
    </div>
  );
}