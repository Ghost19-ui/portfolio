import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import API from '../../api/axios'; 
import { Upload, Loader, LogOut, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 

// --- HELPER COMPONENTS ---
const InputField = ({ label, value, onChange, placeholder, type="text" }) => (
    <div className="mb-4">
        <label className="block text-xs font-mono text-red-500 uppercase tracking-widest mb-1">{label}</label>
        <input 
            type={type} 
            value={value || ''} 
            onChange={onChange} 
            placeholder={placeholder}
            className="w-full bg-black border border-white/10 p-3 text-sm font-mono text-white focus:border-red-500 outline-none transition-all rounded"
        />
    </div>
);

const UploadBox = ({ dropzoneHook, label, currentUrl, isPdf }) => {
    const { getRootProps, getInputProps, isDragActive } = dropzoneHook;
    return (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-red-500 bg-red-900/10' : 'border-white/10 hover:border-red-500/50'}`}>
            <input {...getInputProps()} />
            {currentUrl ? (
                <div className="flex flex-col items-center">
                    <CheckCircle className="text-green-500 mb-2" size={24}/>
                    <p className="text-xs text-green-400 font-mono">FILE UPLOADED</p>
                    {isPdf ? <p className="text-[10px] text-gray-500 mt-1">PDF DOCUMENT</p> 
                           : <img src={currentUrl} alt="Preview" className="h-20 mt-2 object-cover rounded border border-white/10"/>}
                </div>
            ) : (
                <div className="flex flex-col items-center text-gray-500">
                    <Upload className="mb-2" size={24}/>
                    <p className="text-xs font-mono uppercase">{isDragActive ? 'DROP FILE NOW' : label}</p>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [isSaving, setIsSaving] = useState(false);

  // --- FORM STATES ---
  const [profileData, setProfileData] = useState({ 
    name: '', 
    title: '', // 👈 FIXED: Changed 'role' to 'title'
    bio: '', 
    email: '', 
    phone: '',
    github: '', 
    linkedin: '', 
    instagram: '',
    resumeUrl: '' 
  });

  const [projectData, setProjectData] = useState({ 
    title: '', 
    description: '', 
    techStack: '', 
    liveLink: '',
    repoLink: '',
    imageUrl: '' 
  });

  const [certData, setCertData] = useState({ title: '', issuer: '', issueDate: '', certUrl: '' });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/data/all-public-data');
        if(res.data.profile) {
            // Merge existing profile data
            setProfileData(prev => ({ ...prev, ...res.data.profile }));
        }
      } catch(err) {
        toast.error("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  // --- FILE UPLOAD HANDLER ---
  const handleUpload = async (file, fieldSetter, currentData, fieldName) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const loadingToast = toast.loading("Uploading encrypted file...");
    
    try {
        const res = await API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        fieldSetter({ ...currentData, [fieldName]: res.data.url });
        toast.success("Upload Successful", { id: loadingToast });
    } catch (err) {
        console.error(err);
        toast.error("Upload Failed", { id: loadingToast });
    }
  };

  const resumeDrop = useDropzone({ onDrop: files => handleUpload(files[0], setProfileData, profileData, 'resumeUrl'), accept: {'application/pdf': ['.pdf']}, maxFiles: 1 });
  const projectDrop = useDropzone({ onDrop: files => handleUpload(files[0], setProjectData, projectData, 'imageUrl'), accept: {'image/*': []}, maxFiles: 1 });
  const certDrop = useDropzone({ onDrop: files => handleUpload(files[0], setCertData, certData, 'certUrl'), accept: {'image/*': [], 'application/pdf': []}, maxFiles: 1 });

  // --- SAVE HANDLERS ---
  const saveProfile = async () => {
    setIsSaving(true);
    try {
        await API.put('/admin/profile', profileData);
        toast.success("Profile Updated Successfully!");
    } catch(err) {
        toast.error("Save Failed. Check console.");
    } finally {
        setIsSaving(false);
    }
  };

  const saveProject = async () => {
    setIsSaving(true);
    try {
        const payload = { ...projectData, techStack: projectData.techStack.split(',').map(s => s.trim()) };
        await API.post('/admin/project', payload);
        toast.success("Project Deployed!");
        setProjectData({ title: '', description: '', techStack: '', liveLink: '', repoLink: '', imageUrl: '' }); 
    } catch(err) {
        toast.error("Deployment Failed.");
    } finally {
        setIsSaving(false);
    }
  };

  const saveCert = async () => {
    setIsSaving(true);
    try {
        await API.post('/admin/certificate', certData);
        toast.success("Certificate Archived!");
        setCertData({ title: '', issuer: '', issueDate: '', certUrl: '' });
    } catch(err) {
        toast.error("Archive Failed.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col md:flex-row">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff', border: '1px solid #DC2626' } }} />

      <aside className="w-full md:w-64 bg-black border-b md:border-r border-white/5 p-6 flex flex-col shrink-0">
        <div className="text-red-600 font-bold tracking-widest text-xl mb-6 md:mb-12 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"/> ADMIN_PANEL
        </div>
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {['profile', 'project', 'certificate'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap w-full text-left p-3 rounded text-xs font-mono uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-red-600 text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    &gt; {tab}
                </button>
            ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-mono uppercase mt-4 md:mt-auto">
            <LogOut size={14}/> TERMINATE_SESSION
        </button>
      </aside>

      <main className="flex-grow p-6 md:p-12 overflow-y-auto h-[calc(100vh-80px)] md:h-screen">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-500">
                <div>
                    <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">OPERATOR PROFILE</h3>
                    <InputField label="Name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                    
                    {/* 👇 FIXED: Input binds to 'title', NOT 'role' */}
                    <InputField label="Role Title" value={profileData.title} onChange={e => setProfileData({...profileData, title: e.target.value})} />
                    
                    <div className="mb-4">
                        <label className="block text-xs font-mono text-red-500 uppercase tracking-widest mb-1">Bio</label>
                        <textarea 
                            value={profileData.bio} 
                            onChange={e => setProfileData({...profileData, bio: e.target.value})}
                            className="w-full bg-black border border-white/10 p-3 text-sm font-mono text-white focus:border-red-500 outline-none transition-all rounded h-32"
                        />
                    </div>
                    <button onClick={saveProfile} disabled={isSaving} className="mt-4 w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-red-500 transition-all uppercase tracking-widest font-mono flex justify-center">
                        {isSaving ? <Loader className="animate-spin"/> : "UPDATE PROFILE"}
                    </button>
                </div>
                <div>
                    <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">SOCIAL & RESUME</h3>
                    <InputField label="Email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                    <InputField label="Phone Number" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="+91 98765 43210"/>
                    <InputField label="GitHub URL" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} placeholder="https://github.com/yourusername"/>
                    <InputField label="LinkedIn URL" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} placeholder="https://linkedin.com/in/yourprofile"/>
                    <InputField label="Instagram URL" value={profileData.instagram} onChange={e => setProfileData({...profileData, instagram: e.target.value})} placeholder="https://instagram.com/yourhandle"/>
                    
                    <div className="mt-6">
                        <UploadBox dropzoneHook={resumeDrop} label="UPLOAD RESUME PDF" currentUrl={profileData.resumeUrl} isPdf={true} />
                    </div>
                </div>
            </div>
        )}

        {/* PROJECT TAB */}
        {activeTab === 'project' && (
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-500">
                <div>
                    <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">DEPLOY NEW PROJECT</h3>
                    <InputField label="Project Title" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} />
                    <div className="mb-4">
                        <label className="block text-xs font-mono text-red-500 uppercase tracking-widest mb-1">Description</label>
                        <textarea value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm font-mono text-white h-32"/>
                    </div>
                    <InputField label="Tech Stack (Comma Separated)" value={projectData.techStack} onChange={e => setProjectData({...projectData, techStack: e.target.value})} placeholder="e.g. Python, React, Kali Linux" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Live Demo URL" value={projectData.liveLink} onChange={e => setProjectData({...projectData, liveLink: e.target.value})} placeholder="https://your-demo-site.com" />
                        <InputField label="Repository URL (GitHub)" value={projectData.repoLink} onChange={e => setProjectData({...projectData, repoLink: e.target.value})} placeholder="https://github.com/yourusername/repo" />
                    </div>
                    <button onClick={saveProject} disabled={isSaving} className="mt-4 w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-red-500 transition-all uppercase tracking-widest font-mono flex justify-center">
                        {isSaving ? <Loader className="animate-spin"/> : "SAVE PROJECT"}
                    </button>
                </div>
                <div>
                    <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">PROJECT ASSETS</h3>
                    <UploadBox dropzoneHook={projectDrop} label="PROJECT THUMBNAIL" currentUrl={projectData.imageUrl} isPdf={false} />
                </div>
            </div>
        )}

        {/* CERTIFICATE TAB */}
        {activeTab === 'certificate' && (
            <div className="max-w-2xl animate-in fade-in duration-500">
                <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">ARCHIVE CERTIFICATION</h3>
                <InputField label="Certificate Title" value={certData.title} onChange={e => setCertData({...certData, title: e.target.value})} />
                <InputField label="Issuer" value={certData.issuer} onChange={e => setCertData({...certData, issuer: e.target.value})} />
                <InputField label="Issue Date" value={certData.issueDate} onChange={e => setCertData({...certData, issueDate: e.target.value})} placeholder="e.g. Jan 2024" />
                <div className="my-6">
                    <UploadBox dropzoneHook={certDrop} label="CERTIFICATE FILE" currentUrl={certData.certUrl} isPdf={certData.certUrl?.endsWith('.pdf')} />
                </div>
                <button onClick={saveCert} disabled={isSaving} className="w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-red-500 transition-all uppercase tracking-widest font-mono flex justify-center">
                    {isSaving ? <Loader className="animate-spin"/> : "ARCHIVE CERTIFICATE"}
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;