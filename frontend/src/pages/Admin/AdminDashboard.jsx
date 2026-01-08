import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import { 
  LogOut, Terminal, Cpu, FileText, MessageSquare, Shield, Upload, Save, User, RefreshCw, Trash2, Plus, X 
} from 'lucide-react';
import HoloCard from '../../components/HoloCard';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');

  // Data States
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [logs, setLogs] = useState([]); 
  
  // FORM STATES
  const [profile, setProfile] = useState({
    name: '', role: '', bio: '', skills: '', socials: { github: '', linkedin: '', instagram: '' }
  });
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', githubLink: '', technologies: '' });
  const [newBlog, setNewBlog] = useState({ title: '', summary: '', content: '', tags: '' });

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
      } else if (activeTab === 'projects') {
        const { data } = await API.get('/projects', config);
        setProjects(Array.isArray(data) ? data : []);
      } else if (activeTab === 'blogs') {
        // Assuming your blog endpoint is /content/blogs based on typical structure
        const { data } = await API.get('/content/blogs', config);
        setBlogs(Array.isArray(data) ? data : []);
      } else if (activeTab === 'messages') {
        const response = await API.get('/contact/messages', config);
        const data = response.data;
        setMessages(Array.isArray(data) ? data : (data.messages || data.data || []));
      }
    } catch (e) { 
        console.error("Fetch Error:", e);
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { if (activeTab !== 'resume') fetchData(); }, [activeTab]);

  // --- HANDLERS ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
        const skillsArray = profile.skills.split(',').map(s => s.trim());
        await API.put('/profile', { ...profile, skills: skillsArray }, getAuthConfig());
        alert("Profile Updated!");
    } catch (error) { alert("Update failed."); }
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    const config = getAuthConfig();
    try {
      if (activeTab === 'projects') {
        const tech = newProject.technologies.split(',').map(t => t.trim());
        await API.post('/projects', { ...newProject, technologies: tech }, config);
      } else if (activeTab === 'blogs') {
        const tags = newBlog.tags.split(',').map(t => t.trim());
        await API.post('/content/blogs', { ...newBlog, tags }, config);
      }
      setShowModal(false);
      fetchData();
      alert("Created Successfully!");
    } catch (error) { alert("Creation failed."); }
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
      if(!window.confirm("Delete this item?")) return;
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
          { id: 'blogs', label: 'BLOGS', icon: <FileText size={14} /> },
          { id: 'messages', label: 'MESSAGES', icon: <MessageSquare size={14} /> },
          { id: 'resume', label: 'RESUME', icon: <Upload size={14} /> },
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
        
        {/* --- NEW ENTRY BUTTON (Only for Projects & Blogs) --- */}
        {['projects', 'blogs'].includes(activeTab) && (
          <button onClick={() => setShowModal(true)} className="w-full mb-6 py-4 border border-dashed border-red-900/50 hover:border-red-500 text-red-700 hover:text-red-400 rounded flex items-center justify-center gap-2 font-bold uppercase text-xs">
            <Plus size={16} /> ADD NEW {activeTab.slice(0, -1).toUpperCase()}
          </button>
        )}

        {/* --- PROFILE EDITOR --- */}
        {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className="bg-black border border-gray-700 p-3 rounded text-white" placeholder="Full Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                    <input className="bg-black border border-gray-700 p-3 rounded text-white" placeholder="Role" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} />
                </div>
                <textarea rows="3" className="w-full bg-black border border-gray-700 p-3 rounded text-white" placeholder="Bio" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                <input className="w-full bg-black border border-gray-700 p-3 rounded text-white" placeholder="Skills (comma separated)" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
                <div className="space-y-2 border-t border-gray-800 pt-4">
                    <input className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" placeholder="GitHub URL" value={profile.socials?.github || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, github: e.target.value}})} />
                    <input className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" placeholder="LinkedIn URL" value={profile.socials?.linkedin || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} />
                    <input className="w-full bg-black border border-gray-700 p-2 rounded text-white text-sm" placeholder="Instagram URL" value={profile.socials?.instagram || ''} onChange={e => setProfile({...profile, socials: {...profile.socials, instagram: e.target.value}})} />
                </div>
                <button className="w-full bg-red-600 text-black font-bold py-3 rounded">SAVE PROFILE</button>
            </form>
        )}

        {/* --- PROJECTS LIST --- */}
        {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
                <div key={p._id} className="bg-black/40 border border-gray-800 p-4 rounded relative group">
                <h3 className="font-bold text-white">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                <button onClick={() => handleDelete(p._id, `/projects/${p._id}`)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
            ))}
            </div>
        )}

        {/* --- BLOGS LIST --- */}
        {activeTab === 'blogs' && (
            <div className="space-y-3">
            {blogs.map(b => (
                <div key={b._id} className="bg-black/40 border border-gray-800 p-4 rounded relative">
                <h3 className="font-bold text-white">{b.title}</h3>
                <p className="text-xs text-gray-500">{b.summary}</p>
                <button onClick={() => handleDelete(b._id, `/content/blogs/${b._id}`)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
            ))}
            </div>
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
            <div className="p-10 border-2 border-dashed border-gray-800 hover:border-red-600 rounded-lg text-center transition-all">
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" id="resume-upload"/>
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload size={40} className="text-red-500" />
                    <span className="text-gray-400 text-sm font-bold uppercase hover:text-white">Click to Upload Resume PDF</span>
                </label>
                {uploadStatus === 'uploading' && <p className="text-yellow-500 text-xs mt-2">Uploading...</p>}
                {uploadStatus === 'success' && <p className="text-green-500 text-xs mt-2">Upload Successful!</p>}
                {uploadStatus === 'error' && <p className="text-red-500 text-xs mt-2">Upload Failed.</p>}
            </div>
        )}
      </HoloCard>

      {/* --- MODAL FOR NEW ENTRY --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-950 border border-red-600 w-full max-w-lg p-6 rounded-lg">
             <div className="flex justify-between mb-6">
                <h2 className="text-white font-bold uppercase">New {activeTab.slice(0, -1)}</h2>
                <button onClick={() => setShowModal(false)}><X className="text-white" /></button>
             </div>
             
             <form onSubmit={handleCreateEntry} className="space-y-4">
                {activeTab === 'projects' && (
                  <>
                    <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                    <textarea className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                    <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Github URL" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} />
                    <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Tech Stack (comma separated)" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} />
                  </>
                )}
                
                {activeTab === 'blogs' && (
                  <>
                    <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Blog Title" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} required />
                    <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Short Summary" value={newBlog.summary} onChange={e => setNewBlog({...newBlog, summary: e.target.value})} required />
                    <textarea className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded h-32" placeholder="Full Content (Markdown supported)" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} required />
                    <input className="w-full bg-black border border-gray-700 text-white p-2 text-sm rounded" placeholder="Tags (comma separated)" value={newBlog.tags} onChange={e => setNewBlog({...newBlog, tags: e.target.value})} />
                  </>
                )}

                <button className="w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-white transition-colors">SUBMIT</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}