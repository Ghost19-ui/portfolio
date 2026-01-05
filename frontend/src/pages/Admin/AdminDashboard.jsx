import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import { 
  LogOut, Plus, Trash2, Terminal, Cpu, FileText, X, 
  Loader2, RefreshCw, MessageSquare, Shield, Upload, CheckCircle, AlertTriangle 
} from 'lucide-react';
import CyberGlobe from '../../components/CyberGlobe';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // State for Resume Upload

  // Data States
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [logs, setLogs] = useState([]); 

  // Form States
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', githubLink: '', technologies: '' });
  const [newSkill, setNewSkill] = useState({ category: 'Cybersecurity', name: '', level: 50 });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', summary: '', tags: '' });

  // Helper: Get Auth Headers
  const getAuthConfig = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch Logic
  const fetchData = async () => {
    setLoading(true);
    const config = getAuthConfig();

    try {
      if (activeTab === 'projects') {
        const { data } = await API.get('/projects', config);
        setProjects(Array.isArray(data) ? data : []);
      } else if (activeTab === 'skills') {
        const { data } = await API.get('/content/skills', config);
        setSkills(Array.isArray(data) ? data : []);
      } else if (activeTab === 'blogs') {
        const { data } = await API.get('/content/blogs', config);
        setBlogs(Array.isArray(data) ? data : []);
      } else if (activeTab === 'messages') {
        const { data } = await API.get('/admin/messages', config);
        setMessages(Array.isArray(data) ? data : []);
      } else if (activeTab === 'logs') {
        const { data } = await API.get('/admin/logs', config);
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (e) { 
        console.error("Fetch Error:", e); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { 
    if (activeTab !== 'resume') {
        fetchData(); 
    }
  }, [activeTab]);

  // Create Handler
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
    } catch (error) { 
        console.error("Create Error:", error);
        alert("Operation failed.");
    }
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('resume', file); 

    setUploadStatus('uploading');
    
    // Custom config for file upload (multipart/form-data)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const uploadConfig = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    try {
      await API.post('/upload/resume', formData, uploadConfig);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 5000);
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus('error');
    }
  };

  // Delete Handler
  const handleDelete = async (id, type, subId = null) => {
    if (!window.confirm("Confirm deletion?")) return;
    const config = getAuthConfig();
    try {
      let endpoint = '';
      if (type === 'project') endpoint = `/projects/${id}`;
      if (type === 'skillGroup') endpoint = `/content/skills/${id}`;
      if (type === 'skillItem') endpoint = `/content/skills/${id}/${subId}`;
      if (type === 'blog') endpoint = `/content/blogs/${id}`;
      if (type === 'message') endpoint = `/admin/messages/${id}`; 
      
      await API.delete(endpoint, config);
      fetchData();
    } catch (e) { console.error("Delete Error:", e); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      <CyberGlobe />
      
      <div className="relative z-50 max-w-7xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-black/90 border border-red-900 p-6 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.2)]">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
             <div className="p-3 bg-red-900/20 rounded-full border border-red-500/50">
               <Terminal className="text-red-500 w-8 h-8" />
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-widest text-white uppercase">Command Center</h1>
               <p className="text-xs text-red-500 uppercase tracking-widest mt-1">:: Authenticated Operator ::</p>
             </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded text-gray-300 hover:text-white transition-all text-xs font-bold">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH
            </button>
            <button onClick={() => { logout(); navigate('/admin/login'); }} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-black px-6 py-2 rounded font-bold text-xs uppercase transition-all">
              <LogOut size={14} /> Terminate Session
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-6">
          {[
            { id: 'projects', label: 'PROJECTS', icon: <Terminal size={14} /> },
            { id: 'skills', label: 'SKILLS', icon: <Cpu size={14} /> },
            { id: 'blogs', label: 'BLOGS', icon: <FileText size={14} /> },
            { id: 'messages', label: 'MESSAGES', icon: <MessageSquare size={14} /> },
            { id: 'resume', label: 'RESUME', icon: <Upload size={14} /> },
            { id: 'logs', label: 'LOGS', icon: <Shield size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded text-sm font-bold tracking-wider transition-all ${
                activeTab === tab.id 
                  ? 'bg-red-900/20 border border-red-500 text-red-400 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
                  : 'bg-gray-900/50 border border-gray-800 text-gray-500 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Conditional Add Button */}
        {!['logs', 'messages', 'resume'].includes(activeTab) && (
          <button onClick={() => setShowModal(true)} className="w-full mb-10 py-5 border border-dashed border-red-900/50 hover:border-red-500 text-red-700 hover:text-red-400 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all">
            <Plus size={20} /> Initialize New {activeTab.slice(0, -1)} Entry
          </button>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 animate-pulse">
            <Loader2 className="animate-spin mb-4" size={48}/>
            <span className="text-xs uppercase tracking-widest">Establishing Uplink...</span>
          </div>
        ) : (
          <>
            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p._id} className="bg-black/90 border border-gray-800 p-6 rounded-xl hover:border-red-600 transition-all group">
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-red-500">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{p.description}</p>
                    <button onClick={() => handleDelete(p._id, 'project')} className="text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 ? <p className="text-gray-500 text-center">No messages intercepted.</p> : messages.map(m => (
                  <div key={m._id} className="bg-black/90 border border-zinc-800 p-6 rounded-xl border-l-4 border-l-red-600 relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-red-500 font-bold text-sm">{m.name}</h4>
                        <p className="text-[10px] text-zinc-500">{m.email}</p>
                      </div>
                      <span className="text-[10px] text-zinc-600 uppercase">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm italic">"{m.content}"</p>
                    <button onClick={() => handleDelete(m._id, 'message')} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* RESUME UPLOAD */}
            {activeTab === 'resume' && (
                <div className="bg-black/90 border border-gray-800 p-8 rounded-xl">
                    <h3 className="text-white font-bold mb-4 uppercase flex items-center gap-2">
                        <Upload size={18} className="text-red-500" /> Update Intel File (PDF)
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 border-l-2 border-red-500 pl-3">
                        Uploading a new file will overwrite the existing 'resume.pdf' on the server.
                    </p>

                    <div className="border-2 border-dashed border-gray-700 hover:border-red-500 rounded-lg p-10 text-center transition-all bg-black/20 group">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleResumeUpload}
                            className="hidden" 
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="p-4 bg-red-900/20 rounded-full text-red-500 group-hover:bg-red-600 group-hover:text-black transition-colors">
                                <Upload size={32} />
                            </div>
                            <span className="text-slate-300 text-sm font-bold uppercase tracking-widest group-hover:text-white">Click to Select New Resume PDF</span>
                        </label>
                    </div>

                    {uploadStatus === 'uploading' && (
                        <div className="mt-6 flex items-center justify-center gap-3 text-yellow-500 animate-pulse text-xs font-bold uppercase">
                            <Loader2 size={16} className="animate-spin" /> UPLOADING DATA PACKET...
                        </div>
                    )}
                    
                    {uploadStatus === 'success' && (
                        <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded flex items-center gap-3 text-green-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">
                            <CheckCircle size={16} /> UPLOAD COMPLETE. INTEL FILE UPDATED.
                        </div>
                    )}
                    
                    {uploadStatus === 'error' && (
                        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2">
                            <AlertTriangle size={16} /> UPLOAD FAILED. CHECK SERVER CONNECTION.
                        </div>
                    )}
                </div>
            )}

            {/* LOGS */}
            {activeTab === 'logs' && (
              <div className="bg-black/80 border border-red-900/30 p-4 rounded-lg font-mono text-xs h-[500px] overflow-y-auto">
                <div className="text-red-500 mb-2 font-bold uppercase tracking-widest border-b border-red-900/50 pb-2 flex justify-between">
                  <span>&gt; System_Log_Stream</span>
                  <span className="animate-pulse">Live</span>
                </div>
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 py-1 border-b border-zinc-900 hover:bg-red-950/10 transition-colors">
                    <span className="text-zinc-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={log.level === 'ERROR' ? 'text-red-600' : 'text-green-600'}>{log.level}</span>
                    <span className="text-red-400 font-bold">{log.event}:</span>
                    <span className="text-zinc-400">{log.details}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* SKILLS VIEW */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map(group => (
                  <div key={group._id} className="bg-black/90 border border-gray-800 p-5 rounded-xl hover:border-red-600 transition-all">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-900">
                      <h3 className="font-bold text-red-500 uppercase tracking-wider text-sm">{group.category}</h3>
                      <button onClick={() => handleDelete(group._id, 'skillGroup')} className="text-gray-700 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                    <div className="space-y-2">
                      {group.skills.map(skill => (
                        <div key={skill._id} className="flex justify-between items-center text-sm bg-gray-900/40 p-2 rounded hover:bg-red-900/10 transition-colors">
                          <span className="text-gray-300">{skill.name}</span>
                          <button onClick={() => handleDelete(group._id, 'skillItem', skill._id)} className="text-gray-600 hover:text-red-400"><X size={12}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BLOGS VIEW */}
            {activeTab === 'blogs' && (
              <div className="space-y-4">
                {blogs.map(b => (
                  <div key={b._id} className="bg-black/90 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-red-600 transition-all group">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-bold text-xl text-white mb-2 group-hover:text-red-500 transition-colors">{b.title}</h3>
                    </div>
                    <button onClick={() => handleDelete(b._id, 'blog')} className="text-gray-600 hover:text-red-500 p-3 hover:bg-red-950/30 rounded-lg transition-all"><Trash2 size={20}/></button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal - Projects */}
      {showModal && activeTab === 'projects' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-950 border border-red-600 w-full max-w-lg p-8 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.3)]">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">New Project</h2>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-white"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <input placeholder="Title" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
              <input placeholder="GitHub URL" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} required />
              <input placeholder="Image URL" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} required />
              <input placeholder="Tech Stack" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} required />
              <textarea placeholder="Description" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
              <button type="submit" className="w-full bg-red-600 p-4 font-bold text-black rounded hover:bg-red-700">DEPLOY</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal - Skills */}
      {showModal && activeTab === 'skills' && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-gray-950 border border-red-600 w-full max-w-lg p-8 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">New Skill</h2>
                  <button onClick={() => setShowModal(false)}><X size={24} className="text-white"/></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-5">
                  <select className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}>
                    <option>Cybersecurity</option>
                    <option>Programming Languages</option>
                    <option>Web Development</option>
                    <option>Tools</option>
                    <option>Other</option>
                  </select>
                  <input placeholder="Skill Name" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} required />
                  <input type="range" className="w-full accent-red-600" min="0" max="100" value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: parseInt(e.target.value)})} />
                  <button type="submit" className="w-full bg-red-600 p-4 font-bold text-black rounded hover:bg-red-700">DEPLOY</button>
                </form>
            </div>
         </div>
      )}

      {/* Modal - Blogs */}
      {showModal && activeTab === 'blogs' && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-gray-950 border border-red-600 w-full max-w-lg p-8 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">New Intel Report</h2>
                  <button onClick={() => setShowModal(false)}><X size={24} className="text-white"/></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-5">
                  <input placeholder="Title" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} required />
                  <input placeholder="Summary" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newBlog.summary} onChange={e => setNewBlog({...newBlog, summary: e.target.value})} required />
                  <input placeholder="Tags (comma separated)" className="w-full bg-black border border-gray-800 text-white p-3 rounded" value={newBlog.tags} onChange={e => setNewBlog({...newBlog, tags: e.target.value})} required />
                  <textarea placeholder="Content" className="w-full bg-black border border-gray-800 text-white p-3 rounded" rows="5" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} required />
                  <button type="submit" className="w-full bg-red-600 p-4 font-bold text-black rounded hover:bg-red-700">DEPLOY</button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
}