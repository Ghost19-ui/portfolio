import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import { 
  LogOut, Plus, Trash2, Terminal, Cpu, FileText, MessageSquare, Shield, Upload, Save, User, Globe 
} from 'lucide-react';
import HoloCard from '../../components/HoloCard';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [logs, setLogs] = useState([]); 
  
  // FIXED: Initial state has safe defaults to prevent crashes
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    bio: '',
    skills: '', 
    socials: { github: '', linkedin: '', instagram: '', other: '' } // Added 'other'
  });

  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', githubLink: '', technologies: '' });
  const [newSkill, setNewSkill] = useState({ category: 'Cybersecurity', name: '', level: 50 });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', summary: '', tags: '' });

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchData = async () => {
    setLoading(true);
    const config = getAuthConfig();
    try {
      if (activeTab === 'profile') {
        const { data } = await API.get('/profile'); 
        // SAFETY CHECK: Ensure socials object exists even if DB returns null
        const safeSocials = data.socials || { github: '', linkedin: '', instagram: '', other: '' };
        setProfile({
            name: data.name || '',
            role: data.role || '',
            bio: data.bio || '',
            skills: data.skills ? data.skills.join(', ') : '',
            socials: safeSocials
        });
      } else if (activeTab === 'projects') {
        const { data } = await API.get('/projects', config);
        setProjects(Array.isArray(data) ? data : []);
      } else if (activeTab === 'skills') {
        const { data } = await API.get('/content/skills', config);
        setSkills(Array.isArray(data) ? data : []);
      } else if (activeTab === 'blogs') {
        const { data } = await API.get('/content/blogs', config);
        setBlogs(Array.isArray(data) ? data : []);
      } else if (activeTab === 'messages') {
        const response = await API.get('/contact/messages', config);
        const data = response.data;
        const msgs = Array.isArray(data) ? data : (data.messages || data.data || []);
        setMessages(msgs);
      } else if (activeTab === 'logs') {
        try {
            const { data } = await API.get('/admin/logs', config);
            setLogs(Array.isArray(data) ? data : []);
        } catch (logError) {
            setLogs([
                { timestamp: new Date(), level: 'INFO', event: 'SYSTEM', details: 'Admin Dashboard Initialized' },
                { timestamp: new Date(Date.now() - 10000), level: 'SUCCESS', event: 'AUTH', details: `Operator ${user?.name || 'Admin'} logged in` },
            ]);
        }
      }
    } catch (e) { 
        console.error("Fetch Error:", e);
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { if (activeTab !== 'resume') fetchData(); }, [activeTab]);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    const config = getAuthConfig();
    try {
      if (activeTab === 'projects') {
        const tech = newProject.technologies.split(',').map(t => t.trim());
        await API.post('/projects', { ...newProject, technologies: tech }, config);
      } else if (activeTab === 'skills') {
        await API.post('/content/skills', newSkill, config);
      } else if (activeTab === 'blogs') {
        const tags = newBlog.tags.split(',').map(t => t.trim());
        await API.post('/content/blogs', { ...newBlog, tags }, config);
      }
      setShowModal(false);
      fetchData();
      alert("Deployed successfully!");
    } catch (error) { alert("Operation failed."); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file); 
    setUploadStatus('uploading');
    try {
      await API.post('/upload/resume', formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('success');
    } catch (error) { setUploadStatus('error'); }
  };

  const handleDelete = async (id, endpoint) => {
      if(!window.confirm("Delete?")) return;
      try { await API.delete(endpoint, getAuthConfig()); fetchData(); } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen p-4 pt-24 max-w-7xl mx-auto">
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

      <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-6">
        {[
          { id: 'profile', label: 'PROFILE', icon: <User size={14} /> },
          { id: 'projects', label: 'PROJECTS', icon: <Terminal size={14} /> },
          { id: 'skills', label: 'SKILLS', icon: <Cpu size={14} /> },
          { id: 'blogs', label: 'BLOGS', icon: <FileText size={14} /> },
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

      <HoloCard title={`PANEL: ${activeTab.toUpperCase()}`}>
        
        {/* --- PROFILE EDITOR TAB --- */}
        {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Full Name</label>
                        <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Role / Title</label>
                        <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.role || ''} onChange={e => setProfile({...profile, role: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Bio / Description</label>
                    <textarea rows="4" className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>

                <div>
                    <label className="text-xs text-red-500 font-bold mb-2 block uppercase">Skill Chips (Comma Separated)</label>
                    <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" value={profile.skills || ''} onChange={e => setProfile({...profile, skills: e.target.value})} placeholder="Python, Kali Linux, React..." />
                </div>

                <div className="p-4 border border-gray-800 rounded bg-gray-900/30">
                    <h3 className="text-sm font-bold text-white mb-4">SOCIAL LINKS</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-xs text-gray-400">GitHub</span>
                            <input className="flex-1 bg-black border border-gray-700 p-2 rounded text-white text-sm" value={profile.socials?.github || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, github: e.target.value}})} />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-xs text-gray-400">LinkedIn</span>
                            <input className="flex-1 bg-black border border-gray-700 p-2 rounded text-white text-sm" value={profile.socials?.linkedin || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-xs text-gray-400">Instagram</span>
                            <input className="flex-1 bg-black border border-gray-700 p-2 rounded text-white text-sm" value={profile.socials?.instagram || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, instagram: e.target.value}})} />
                        </div>
                        {/* NEW FIELD FOR TRYHACKME OR OTHER */}
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-xs text-red-400">Extra Link</span>
                            <input className="flex-1 bg-black border border-red-900/50 p-2 rounded text-white text-sm placeholder-gray-600" placeholder="TryHackMe / Twitter URL" value={profile.socials?.other || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, other: e.target.value}})} />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-red-600 text-black font-bold py-4 rounded hover:bg-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Save size={18} /> Save Profile Changes
                </button>
            </form>
        )}

        {/* --- MESSAGES --- */}
        {activeTab === 'messages' && (
             <div className="space-y-3">
                {messages.length === 0 ? <p className="text-gray-500 text-center">No messages.</p> : messages.map(m => (
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

        {/* --- RESUME UPLOAD --- */}
        {activeTab === 'resume' && (
            <div className="p-10 border-2 border-dashed border-gray-800 hover:border-red-600 rounded-lg text-center">
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" id="resume-upload"/>
                <label htmlFor="resume-upload" className="cursor-pointer text-red-500 font-bold uppercase hover:text-white">Click to Upload Resume PDF</label>
                {uploadStatus === 'success' && <p className="text-green-500 mt-2">Success</p>}
            </div>
        )}

        {/* --- MODAL FOR PROJECTS/SKILLS --- */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              <div className="relative bg-gray-950 border border-red-600 w-full max-w-lg p-6 rounded-lg">
                 <div className="flex justify-between mb-6">
                    <h2 className="text-white font-bold uppercase">New Entry</h2>
                    <button onClick={() => setShowModal(false)}><X className="text-white" /></button>
                 </div>
                 <form onSubmit={handleCreate} className="space-y-4">
                    {activeTab === 'projects' && (
                      <>
                        <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                        <textarea className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Github URL" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} required />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Image URL" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} />
                        <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Tech Stack (comma separated)" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} />
                      </>
                    )}
                    <button className="w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-white transition-colors">SUBMIT</button>
                 </form>
              </div>
            </div>
        )}
      </HoloCard>
    </div>
  );
}