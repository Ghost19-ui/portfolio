import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import { 
  LogOut, Plus, Trash2, Terminal, Cpu, FileText, X, 
  Loader2, RefreshCw, MessageSquare, Shield, Upload, CheckCircle, AlertTriangle, Bug 
} from 'lucide-react';
import HoloCard from '../../components/HoloCard';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('messages'); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  
  // Debug state to see what the server returns
  const [debugLog, setDebugLog] = useState(null);

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [logs, setLogs] = useState([]); 

  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', githubLink: '', technologies: '' });
  const [newSkill, setNewSkill] = useState({ category: 'Cybersecurity', name: '', level: 50 });
  const [newBlog, setNewBlog] = useState({ title: '', content: '', summary: '', tags: '' });

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchData = async () => {
    setLoading(true);
    setDebugLog(null);
    const config = getAuthConfig();
    
    try {
      if (activeTab === 'projects') {
        const { data } = await API.get('/projects', config);
        setProjects(Array.isArray(data) ? data : (data.projects || []));
      } else if (activeTab === 'skills') {
        const { data } = await API.get('/content/skills', config);
        setSkills(Array.isArray(data) ? data : (data.skills || []));
      } else if (activeTab === 'blogs') {
        const { data } = await API.get('/content/blogs', config);
        setBlogs(Array.isArray(data) ? data : (data.blogs || []));
      } else if (activeTab === 'messages') {
        // --- FIX: UPDATED ENDPOINT TO MATCH YOUR BACKEND CODE ---
        const response = await API.get('/contact/messages', config);
        
        console.log("FULL API RESPONSE:", response);
        setDebugLog(response.data); 

        const data = response.data;
        // Aggressive check for message data in any format
        const msgs = Array.isArray(data) ? data 
          : (data.messages || data.data || data.result || []);
        
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
        setDebugLog({ error: e.message, status: e.response?.status, detail: "Failed to fetch data." });
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { if (activeTab !== 'resume') fetchData(); }, [activeTab]);

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
    
    const token = localStorage.getItem("token");
    try {
      await API.post('/upload/resume', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 5000);
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus('error');
    }
  };

  const handleDelete = async (id, type, subId = null) => {
    if (!window.confirm("Confirm deletion?")) return;
    const config = getAuthConfig();
    try {
      let endpoint = '';
      if (type === 'project') endpoint = `/projects/${id}`;
      if (type === 'skillGroup') endpoint = `/content/skills/${id}`;
      if (type === 'skillItem') endpoint = `/content/skills/${id}/${subId}`;
      if (type === 'blog') endpoint = `/content/blogs/${id}`;
      if (type === 'message') endpoint = `/contact/${id}`; // Correct endpoint based on router.delete('/:id')
      
      await API.delete(endpoint, config);
      fetchData();
    } catch (e) { console.error(e); }
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
        
        {!['logs', 'messages', 'resume'].includes(activeTab) && (
          <button onClick={() => setShowModal(true)} className="w-full mb-6 py-4 border border-dashed border-red-900/50 hover:border-red-500 text-red-700 hover:text-red-400 rounded flex items-center justify-center gap-2 font-bold uppercase text-xs">
            <Plus size={16} /> New Entry
          </button>
        )}

        {loading ? (
          <div className="flex justify-center py-10 text-red-500 animate-pulse"><Loader2 className="animate-spin" /></div>
        ) : (
          <>
            {/* MESSAGES - WITH DEBUG MODE */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {/* --- DEBUG WINDOW --- */}
                <div className="bg-zinc-900 border border-yellow-500/50 p-4 rounded text-[10px] font-mono mb-6">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold mb-2">
                        <Bug size={14} /> RAW SERVER RESPONSE
                    </div>
                    <pre className="text-green-400 whitespace-pre-wrap overflow-x-auto max-h-40">
                        {debugLog ? JSON.stringify(debugLog, null, 2) : "Fetching data..."}
                    </pre>
                </div>
                {/* --------------------- */}

                {messages.length === 0 ? <p className="text-gray-500 text-center text-sm">No new intel.</p> : messages.map((m, idx) => (
                  <div key={m._id || idx} className="bg-black/40 border border-red-900/30 p-4 rounded relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-red-400 font-bold text-sm">{m.name || m.sender || 'Unknown Agent'}</span> 
                        <span className="text-xs text-gray-500 ml-2">{m.email}</span>
                      </div>
                      <span className="text-[10px] text-gray-600">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Unknown Date'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 italic">
                        "{m.content || m.message || 'No Content Decrypted'}"
                    </p>
                    <button onClick={() => handleDelete(m._id, 'message')} className="absolute bottom-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p._id} className="bg-black/40 border border-gray-800 p-4 rounded hover:border-red-600 group relative">
                    <h3 className="font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                    <button onClick={() => handleDelete(p._id, 'project')} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* RESUME UPLOAD */}
            {activeTab === 'resume' && (
                <div className="p-4 border-2 border-dashed border-gray-800 hover:border-red-600 rounded-lg text-center transition-all">
                    <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" id="resume-upload"/>
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-3 py-10">
                        <Upload size={40} className="text-red-500" />
                        <span className="text-gray-400 text-sm font-bold">CLICK TO UPLOAD NEW PDF</span>
                    </label>
                    {uploadStatus === 'uploading' && <p className="text-yellow-500 text-xs animate-pulse">UPLOADING...</p>}
                    {uploadStatus === 'success' && <p className="text-green-500 text-xs">UPLOAD SUCCESSFUL</p>}
                    {uploadStatus === 'error' && <p className="text-red-500 text-xs">UPLOAD FAILED</p>}
                </div>
            )}
            
            {/* LOGS */}
            {activeTab === 'logs' && logs.map((log, i) => (
                <div key={i} className="text-xs font-mono border-b border-gray-800 py-1 flex gap-2">
                    <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={log.level === 'ERROR' ? 'text-red-500' : 'text-green-500'}>{log.level}</span>
                    <span className="text-gray-300">{log.event}: {log.details}</span>
                </div>
            ))}
          </>
        )}
      </HoloCard>

      {/* Modal Logic */}
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
    </div>
  );
}