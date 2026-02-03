import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import API from '../../api/axios'; // Import the centralized API config
import { Upload, FileText, CheckCircle, Save, Loader, Layout, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  // --- FORM STATES ---
  const [profileData, setProfileData] = useState({
    role: '', email: '', phone: '', github: '', linkedin: '', instagram: '', resumeUrl: ''
  });
  const [projectData, setProjectData] = useState({ title: '', description: '', liveLink: '', imageUrl: '' });
  const [techStackInput, setTechStackInput] = useState('');
  const [certData, setCertData] = useState({ title: '', issuer: '', issueDate: '', certUrl: '' });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use API instance (handles base URL automatically)
        const res = await API.get('/data/all-public-data');
        if(res.data.profile) setProfileData(res.data.profile);
      } catch(err) {
        console.error("Error fetching initial data:", err);
        if(err.response?.status === 401) handleLogout();
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin');
  };

  // --- GENERIC FILE UPLOAD HANDLER ---
  const handleFileUpload = async (file) => {
    setUploadStatus('uploading');
    const formData = new FormData();
    // Standardize field name to 'file' (ensure backend multer expects 'file')
    formData.append('file', file); 

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
      return res.data.url; 
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus('error');
      alert("Upload Failed. Check console.");
      return null;
    }
  };

  // --- DROPZONE HANDLERS ---
  const onDropResume = useCallback(async (acceptedFiles) => {
     if(acceptedFiles?.length > 0) {
        const url = await handleFileUpload(acceptedFiles[0]);
        if(url) setProfileData(prev => ({ ...prev, resumeUrl: url }));
     }
  }, []); 

  const onDropProjectImg = useCallback(async (acceptedFiles) => {
     if(acceptedFiles?.length > 0) {
        const url = await handleFileUpload(acceptedFiles[0]);
        if(url) setProjectData(prev => ({ ...prev, imageUrl: url }));
     }
  }, []); 

  const onDropCertFile = useCallback(async (acceptedFiles) => {
    if(acceptedFiles?.length > 0) {
        const url = await handleFileUpload(acceptedFiles[0]);
        if(url) setCertData(prev => ({ ...prev, certUrl: url }));
    }
 }, []); 

  // --- SAVE HANDLERS ---
  const saveProfile = async () => {
      setIsSaving(true);
      try {
          // Ensure skills is formatted correctly if you have a skills field, otherwise send profileData
          await API.put('/admin/profile', profileData);
          setStatusMsg('Profile Updated Successfully');
      } catch(err) { 
          setStatusMsg('Error updating profile'); 
          console.error(err);
      }
      setIsSaving(false);
  };

  const saveProject = async () => {
      setIsSaving(true);
      try {
          const stackArray = techStackInput.split(',').map(s => s.trim()).filter(s => s);
          await API.post('/admin/project', { ...projectData, techStack: stackArray });
          setStatusMsg('Project Added Successfully');
          // Reset form
          setProjectData({ title: '', description: '', liveLink: '', imageUrl: '' });
          setTechStackInput('');
      } catch(err) { 
          setStatusMsg('Error adding project'); 
      }
      setIsSaving(false);
  };

  const saveCert = async () => {
    setIsSaving(true);
    try {
        await API.post('/admin/certificate', certData);
        setStatusMsg('Certificate Added Successfully');
        setCertData({ title: '', issuer: '', issueDate: '', certUrl: '' });
    } catch(err) { 
        setStatusMsg('Error adding certificate'); 
    }
    setIsSaving(false);
  };

  // Dropzone hooks
  const resumeDrop = useDropzone({ onDrop: onDropResume, accept: {'application/pdf': ['.pdf']}, maxFiles: 1 });
  const projectDrop = useDropzone({ onDrop: onDropProjectImg, accept: {'image/*': []}, maxFiles: 1 });
  const certDrop = useDropzone({ onDrop: onDropCertFile, accept: {'image/*': [], 'application/pdf': []}, maxFiles: 1 });

  // --- UI COMPONENTS ---
  const UploadBox = ({ dropzoneHook, label, currentUrl, isPdf=false }) => (
    <div {...dropzoneHook.getRootProps()} 
      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all h-64 bg-neutral-900/50
        ${dropzoneHook.isDragActive ? 'border-red-500 bg-red-900/10' : 'border-white/20 hover:border-red-500/50'}
      `}>
      <input {...dropzoneHook.getInputProps()} />
      {uploadStatus === 'uploading' ? (
         <div className="animate-pulse text-red-500 flex flex-col items-center"><Loader className="animate-spin mb-2"/><p>UPLOADING...</p></div>
      ) : currentUrl ? (
         <div className="text-green-500 flex flex-col items-center">
            <CheckCircle className="mb-2" size={32} />
            <p className="text-sm font-mono mb-2">FILE UPLOADED</p>
            {isPdf ? <FileText size={40} className="text-gray-400"/> : <img src={currentUrl} alt="Preview" className="h-24 w-24 object-cover rounded border border-green-500/50" />}
            <p className="text-xs text-gray-500 mt-2">Drag new file to replace</p>
         </div>
      ) : (
         <div className="text-center text-gray-500">
           <Upload className="mb-4 mx-auto text-red-500" size={32} />
           <p className="text-lg font-bold text-white mb-1">DROP {label}</p>
         </div>
      )}
    </div>
  );

  const InputField = ({ label, value, onChange, textarea=false, placeholder }) => (
      <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
          {textarea ? (
            <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white focus:border-red-500 focus:outline-none font-mono" />
          ) : (
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white focus:border-red-500 focus:outline-none font-mono" />
          )}
      </div>
  );

  if (loadingData) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">LOADING DATA...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans pb-20 selection:bg-red-900 selection:text-white">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-neutral-900/50 backdrop-blur sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-mono text-white font-bold">
            <Layout className="text-red-500" /> ADMIN_CONSOLE
          </div>
          <button onClick={handleLogout} className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1">
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4">
      
      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {['profile', 'project', 'certificate'].map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setStatusMsg(''); }}
            className={`px-4 py-2 uppercase tracking-widest text-sm transition-colors font-mono ${ activeTab === tab ? 'bg-red-600 text-black font-bold rounded' : 'text-gray-500 hover:text-white' }`}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* STATUS MESSAGE */}
      {statusMsg && <div className={`mb-6 p-3 rounded border font-mono ${statusMsg.includes('Error') ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-green-500 bg-green-500/10 text-green-500'}`}>{statusMsg}</div>}

      {/* === TAB CONTENT === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
            <>
            <div className="bg-neutral-900/30 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">EDIT DATA</h3>
                <InputField label="Role Title" value={profileData.role} onChange={e => setProfileData({...profileData, role: e.target.value})} />
                <InputField label="Email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                <InputField label="Phone" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                <InputField label="LinkedIn URL" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} />
                <InputField label="GitHub URL" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} />
                <InputField label="Instagram URL" value={profileData.instagram} onChange={e => setProfileData({...profileData, instagram: e.target.value})} />
                
                <button onClick={saveProfile} disabled={isSaving} className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-black font-bold py-3 rounded hover:bg-red-500 transition-all uppercase tracking-widest font-mono">
                    {isSaving ? <Loader className="animate-spin"/> : <Save size={18}/>} SAVE PROFILE DATA
                </button>
            </div>

            <div>
                <h3 className="text-xl text-white mb-6 font-mono">&gt; UPLOAD RESUME (PDF)</h3>
                <UploadBox dropzoneHook={resumeDrop} label="Resume PDF" currentUrl={profileData.resumeUrl} isPdf={true} />
                
                {profileData.resumeUrl && (
                    <div className="mt-8 bg-neutral-900/80 border border-white/10 rounded-xl overflow-hidden h-[500px]">
                        <div className="bg-black/50 p-2 border-b border-white/10 flex justify-between text-xs text-gray-500 font-mono"><span>LIVE PREVIEW</span></div>
                        <iframe src={profileData.resumeUrl} className="w-full h-full" title="Resume Preview"></iframe>
                    </div>
                )}
            </div>
            </>
        )}

        {/* --- PROJECT TAB --- */}
        {activeTab === 'project' && (
             <>
             <div className="bg-neutral-900/30 p-6 rounded-xl border border-white/10">
                 <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">ADD NEW PROJECT</h3>
                 <InputField label="Project Title" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} />
                 <InputField label="Description" textarea value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} />
                 <InputField label="Tech Stack (comma separated)" value={techStackInput} onChange={e => setTechStackInput(e.target.value)} placeholder="React, Node.js, MongoDB" />
                 <InputField label="Live Link URL" value={projectData.liveLink} onChange={e => setProjectData({...projectData, liveLink: e.target.value})} />
                 
                 <button onClick={saveProject} disabled={isSaving || !projectData.imageUrl} className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-black font-bold py-3 rounded hover:bg-red-500 transition-all uppercase tracking-widest font-mono disabled:opacity-50 disabled:cursor-not-allowed">
                     {isSaving ? <Loader className="animate-spin"/> : <Save size={18}/>} SAVE PROJECT
                 </button>
                 {!projectData.imageUrl && <p className="text-red-500 text-xs mt-2 font-mono">* Image upload required to save.</p>}
             </div>
 
             <div>
                 <h3 className="text-xl text-white mb-6 font-mono">&gt; PROJECT THUMBNAIL</h3>
                 <UploadBox dropzoneHook={projectDrop} label="Project Image" currentUrl={projectData.imageUrl} />
             </div>
             </>
        )}
         
        {/* --- CERTIFICATE TAB --- */}
        {activeTab === 'certificate' && (
             <>
             <div className="bg-neutral-900/30 p-6 rounded-xl border border-white/10">
                 <h3 className="text-xl text-white mb-6 font-mono border-b border-white/10 pb-2">ADD NEW CERTIFICATE</h3>
                 <InputField label="Certificate Title" value={certData.title} onChange={e => setCertData({...certData, title: e.target.value})} />
                 <InputField label="Issuer" value={certData.issuer} onChange={e => setCertData({...certData, issuer: e.target.value})} />
                 <InputField label="Issue Date (e.g., Jan 2024)" value={certData.issueDate} onChange={e => setCertData({...certData, issueDate: e.target.value})} />
                 
                 <button onClick={saveCert} disabled={isSaving || !certData.certUrl} className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-black font-bold py-3 rounded hover:bg-red-500 transition-all uppercase tracking-widest font-mono disabled:opacity-50 disabled:cursor-not-allowed">
                     {isSaving ? <Loader className="animate-spin"/> : <Save size={18}/>} SAVE CERTIFICATE
                 </button>
                 {!certData.certUrl && <p className="text-red-500 text-xs mt-2 font-mono">* File upload required to save.</p>}
             </div>
 
             <div>
                 <h3 className="text-xl text-white mb-6 font-mono">&gt; CERTIFICATE FILE</h3>
                 <UploadBox dropzoneHook={certDrop} label="Cert Image/PDF" currentUrl={certData.certUrl} isPdf={certData.certUrl?.endsWith('.pdf')} />
             </div>
             </>
        )}

      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;