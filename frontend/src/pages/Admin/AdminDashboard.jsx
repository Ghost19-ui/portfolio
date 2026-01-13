import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import { 
  LogOut, Plus, Trash2, Terminal, Cpu, FileText, MessageSquare, Shield, Upload, Save, User, Award, ExternalLink, RefreshCw, X, Calendar, CheckCircle
} from 'lucide-react';
import HoloCard from '../../components/HoloCard';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // TABS: 'profile', 'certificates', 'projects', 'messages', 'resume', 'logs'
  const [activeTab, setActiveTab] = useState('profile'); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');

  // --- DATA STATES ---
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [logs, setLogs] = useState([]); 
  
  // --- FORM STATES ---
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    bio: '',
    skills: '', 
    socials: { github: '', linkedin: '', instagram: '' }
  });

  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', link: '', image: '', type: 'image' });
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', githubLink: '', technologies: '' });

  // --- AUTH HEADER ---
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    const config = getAuthConfig();
    try {
      if (activeTab === 'profile') {
        const { data } = await API.get('/profile');
        if (data) {
            setProfile({
                name: data.name || '',
                role: data.role || '',
                bio: data.bio || '',
                skills: data.skills ? data.skills.join(', ') : '',
                socials: {
                    github: data.socials?.github || '',
                    linkedin: data.socials?.linkedin || '',
                    instagram: data.socials?.instagram || ''
                }
            });
        }
      } else if (activeTab === 'certificates') {
        const { data } = await API.get('/certificates');
        setCertificates(Array.isArray(data) ? data : []);
      } else if (activeTab === 'projects') {
        const { data } = await API.get('/projects');
        setProjects(Array.isArray(data) ? data : []);
      } else if (activeTab === 'messages') {
        const { data } = await API.get('/contact/messages', config);
        // Handle various response structures for stability
        setMessages(Array.isArray(data) ? data : (data.messages || data.data || []));
      } else if (activeTab === 'logs') {
        // Simulated Logs for Portfolio Visuals
        setLogs([
            { timestamp: new Date(), level: 'INFO', event: 'SYSTEM', details: 'Admin Dashboard Initialized' },
            { timestamp: new Date(Date.now() - 10000), level: 'SUCCESS', event: 'AUTH', details: `Operator ${user?.name || 'Admin'} logged in` },
            { timestamp: new Date(Date.now() - 50000), level: 'WARNING', event: 'NETWORK', details: 'Monitoring active connections...' },
        ]);
      }
    } catch (e) { 
        console.error("Fetch Error:", e);
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { if (activeTab !== 'resume') fetchData(); }, [activeTab]);

  // --- HANDLERS ---

  // 1. Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const config = getAuthConfig();
    try {
        const skillsArray = profile.skills.split(',').map(s => s.trim());
        await API.put('/profile', { ...profile, skills: skillsArray }, config);
        alert("Profile Updated Successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to update profile.");
    }
  };

  // 2. Generic File Upload (Certificates & Resume)
  // Note: Backend must have a generic /upload route or similar logic
  const handleFileUpload = async (e, context) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    if (context === 'resume') {
        formData.append('resume', file);
    } else {
        formData.append('file', file);
    }
    
    setUploadStatus('uploading');

    try {
      const endpoint = context === 'resume' ? '/upload/resume' : '/upload'; // Ensure these routes exist
      const { data } = await API.post(endpoint, formData, {
         headers: { ...getAuthConfig().headers, 'Content-Type': 'multipart/form-data' }
      });
      
      if (context === 'cert') {
          const isPdf = file.name.toLowerCase().endsWith('.pdf');
          setNewCert({ ...newCert, image: data.url, type: isPdf ? 'pdf' : 'image' });
      }
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) { 
        console.error("Upload failed", error);
        setUploadStatus('error'); 
    }
  };

  // 3. Create Certificate
  const handleCreateCert = async (e) => {
      e.preventDefault();
      try {
          await API.post('/certificates', newCert, getAuthConfig());
          setShowModal(false);
          fetchData();
          setNewCert({ title: '', issuer: '', date: '', link: '', image: '', type: 'image' });
      } catch (error) { alert("Failed to add certificate"); }
  };

  // 4. Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const tech = newProject.technologies.split(',').map(t => t.trim());
      await API.post('/projects', { ...newProject, technologies: tech }, getAuthConfig());
      setShowModal(false);
      fetchData();
      setNewProject({ title: '', description: '', image: '', githubLink: '', technologies: '' });
    } catch (error) { alert("Failed to add project"); }
  };

  // 5. Generic Delete
  const handleDelete = async (id, endpoint) => {
      if(!window.confirm("Delete this item?")) return;
      try { await API.delete(endpoint, getAuthConfig()); fetchData(); } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen p-4 pt-24 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-white tracking-widest">COMMAND CENTER</h1>
          <p className="text-xs text-red-500 font-mono mt-1">OPERATOR: {user?.name || 'GHOST'}</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button onClick={fetchData} className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded text-gray-300 text-xs font-bold hover:text-white transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH
          </button>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="flex items-center gap-2 bg-red-600 text-black px-4 py-2 rounded font-bold text-xs uppercase hover:bg-white transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-6">
        {[
          { id: 'profile', label: 'PROFILE', icon: <User size={14} /> },
          { id: 'certificates', label: 'CERTIFICATIONS', icon: <Award size={14} /> },
          { id: 'projects', label: 'PROJECTS', icon: <Terminal size={14} /> },
          { id: 'messages', label: 'MESSAGES', icon: <MessageSquare size={14} /> },
          { id: 'resume', label: 'RESUME', icon: <Upload size={14} /> },
          { id: 'logs', label: 'LOGS', icon: <Shield size={14} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold tracking-wider transition-all ${
              activeTab === tab.id ? 'bg-red-900/20 border border-red-500 text-red-400' : 'bg-gray-900/50 border border-gray-800 text-gray-500 hover:text-white'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT CARD */}
      <HoloCard title={`PANEL: ${activeTab.toUpperCase()}`}>
        
        {/* --- 1. PROFILE TAB --- */}
        {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Full Name</label>
                        <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Role / Title</label>
                        <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Bio / Description</label>
                    <textarea rows="4" className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>

                <div>
                    <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Skill Chips (Comma Separated)</label>
                    <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="Python, Kali Linux, React..." />
                </div>

                <div className="p-4 border border-gray-800 rounded bg-gray-900/30">
                    <h3 className="text-sm font-bold text-white mb-4">SOCIAL LINKS</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="w-20 text-xs text-gray-400">GitHub</span>
                            <input className="flex-1 bg-black border border-gray-700 p-2 rounded text-white text-sm" value={profile.socials?.github || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, github: e.target.value}})} />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-20 text-xs text-gray-400">LinkedIn</span>
                            <input className="flex-1 bg-black border border-gray-700 p-2 rounded text-white text-sm" value={profile.socials?.linkedin || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-20 text-xs text-gray-400">Instagram</span>
                            <input className="flex-1 bg-black border border-gray-700 p-2 rounded text-white text-sm" value={profile.socials?.instagram || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, instagram: e.target.value}})} />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-red-600 text-black font-bold py-4 rounded hover:bg-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Save size={18} /> Save Profile Changes
                </button>
            </form>
        )}

        {/* --- 2. CERTIFICATES TAB --- */}
        {activeTab === 'certificates' && (
            <>
                <button onClick={() => setShowModal(true)} className="w-full mb-6 py-4 border border-dashed border-red-900/50 hover:border-red-500 text-red-700 hover:text-red-400 rounded flex items-center justify-center gap-2 font-bold uppercase text-xs">
                    <Plus size={16} /> Add New Certificate
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map(cert => (
                        <div key={cert._id} className="bg-black/40 border border-gray-800 p-4 rounded hover:border-red-600 relative group">
                            <div className="h-40 w-full bg-gray-900 mb-3 rounded overflow-hidden flex items-center justify-center">
                                {cert.type === 'pdf' ? (
                                    <FileText size={40} className="text-red-500" />
                                ) : (
                                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <h3 className="font-bold text-white text-sm truncate">{cert.title}</h3>
                            <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                            <button onClick={() => handleDelete(cert._id, `/certificates/${cert._id}`)} className="absolute top-2 right-2 bg-black/80 p-1 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* --- 3. PROJECTS TAB --- */}
        {activeTab === 'projects' && (
             <>
                <button onClick={() => setShowModal(true)} className="w-full mb-6 py-4 border border-dashed border-red-900/50 hover:border-red-500 text-red-700 hover:text-red-400 rounded flex items-center justify-center gap-2 font-bold uppercase text-xs">
                    <Plus size={16} /> New Project
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => (
                    <div key={p._id} className="bg-black/40 border border-gray-800 p-4 rounded hover:border-red-600 group relative">
                        <h3 className="font-bold text-white">{p.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                        <button onClick={() => handleDelete(p._id, `/projects/${p._id}`)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                    ))}
                </div>
             </>
        )}

        {/* --- 4. MESSAGES TAB --- */}
        {activeTab === 'messages' && (
             <div className="space-y-3">
                {messages.length === 0 ? <p className="text-gray-500 text-center text-sm">No new intel.</p> : messages.map(m => (
                  <div key={m._id} className="bg-black/40 border border-red-900/30 p-4 rounded relative">
                    <div className="flex justify-between items-start">
                      <div><span className="text-red-400 font-bold text-sm">{m.name || m.sender}</span> <span className="text-xs text-gray-500 ml-2">{m.email}</span></div>
                      <span className="text-[10px] text-gray-600">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 italic">"{m.content || m.message}"</p>
                    <button onClick={() => handleDelete(m._id, `/contact/${m._id}`)} className="absolute bottom-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                ))}
             </div>
        )}

        {/* --- 5. RESUME TAB --- */}
        {activeTab === 'resume' && (
            <div className="p-10 border-2 border-dashed border-gray-800 hover:border-red-600 rounded-lg text-center transition-all">
                <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'resume')} className="hidden" id="resume-upload"/>
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3 py-10">
                    <Upload size={40} className="text-red-500" />
                    <span className="text-gray-400 text-sm font-bold uppercase">CLICK TO UPLOAD NEW RESUME (PDF)</span>
                </label>
                {uploadStatus === 'uploading' && <p className="text-yellow-500 text-xs animate-pulse">UPLOADING...</p>}
                {uploadStatus === 'success' && <p className="text-green-500 text-xs">UPLOAD SUCCESSFUL</p>}
                {uploadStatus === 'error' && <p className="text-red-500 text-xs">UPLOAD FAILED</p>}
            </div>
        )}

        {/* --- 6. LOGS TAB --- */}
        {activeTab === 'logs' && logs.map((log, i) => (
            <div key={i} className="text-xs font-mono border-b border-gray-800 py-1 flex gap-2">
                <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={log.level === 'ERROR' ? 'text-red-500' : 'text-green-500'}>{log.level}</span>
                <span className="text-gray-300">{log.event}: {log.details}</span>
            </div>
        ))}
      </HoloCard>

      {/* --- SHARED MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-950 border border-red-600 w-full max-w-lg p-6 rounded-lg relative">
             <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white"><X size={20} /></button>
             
             {/* Dynamic Title */}
             <h2 className="text-white font-bold uppercase mb-4">
                 {activeTab === 'certificates' ? 'New Certification' : 'New Project'}
             </h2>
             
             <form onSubmit={activeTab === 'certificates' ? handleCreateCert : handleCreateProject} className="space-y-4">
                
                {activeTab === 'certificates' ? (
                    <>
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Title" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} required />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Issuer" value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} required />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Date (e.g. 2024)" value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Credential URL (Optional)" value={newCert.link} onChange={e => setNewCert({...newCert, link: e.target.value})} />
                        <div className="border border-dashed border-gray-700 p-4 text-center rounded">
                            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'cert')} className="hidden" id="cert-upload" />
                            <label htmlFor="cert-upload" className="cursor-pointer text-red-500 font-bold text-xs uppercase block">
                                {uploadStatus === 'uploading' ? 'Uploading...' : 'Choose File (Img/PDF)'}
                            </label>
                            {newCert.image && <p className="text-green-500 text-xs mt-2 truncate">Attached</p>}
                        </div>
                    </>
                ) : (
                    <>
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                        <textarea className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Github Link" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} required />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Image URL" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 rounded" placeholder="Technologies (Comma separated)" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} />
                    </>
                )}

                <button className="w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-white transition-colors">SAVE ENTRY</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}