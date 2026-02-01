import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Upload, FileText, CheckCircle, AlertTriangle, Save, Loader } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile'); 
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // --- FORM STATES ---
  // Profile State
  const [profileData, setProfileData] = useState({
    role: '', email: '', phone: '', github: '', linkedin: '', instagram: '', resumeUrl: ''
  });
  // Project State
  const [projectData, setProjectData] = useState({ title: '', description: '', liveLink: '', imageUrl: '' });
  const [techStackInput, setTechStackInput] = useState('');
  // Cert State
  const [certData, setCertData] = useState({ title: '', issuer: '', issueDate: '', certUrl: '' });

  // Create Axios instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // Load existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
        try {
            // Note: This endpoint is public, so it doesn't strictly need the token, 
            // but using 'api' instance is fine.
            const res = await axios.get('http://localhost:5000/api/data/all-public-data');
            if(res.data.profile) setProfileData(res.data.profile);
        } catch(err) {
            console.error(err);
        }
    };
    if(activeTab === 'profile') fetchProfile();
  }, [activeTab]);


  // --- GENERIC FILE UPLOAD HANDLER (FIXED) ---
  const handleFileUpload = async (file, fieldName) => {
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append(fieldName, file); // e.g., 'resume', 'projectImage'

    try {
      // FIX: Removed manual 'Content-Type' header. 
      // Axios + Browser automatically set the correct boundary for FormData.
      const res = await api.post('/upload', formData);
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
      return res.data.url; // Return Cloudinary URL
    } catch (err) {
      console.error("Upload failed:", err.response?.data?.msg || err.message);
      setUploadStatus('error');
      alert("Upload Failed: " + (err.response?.data?.msg || "Server Error"));
      return null;
    }
  };

  // --- DROPZONE HANDLERS ---
  const onDropResume = useCallback(async (acceptedFiles) => {
     if(acceptedFiles?.length > 0) {
        const url = await handleFileUpload(acceptedFiles[0], 'resume');
        if(url) setProfileData(prev => ({ ...prev, resumeUrl: url }));
     }
  }, []); 

  const onDropProjectImg = useCallback(async (acceptedFiles) => {
     if(acceptedFiles?.length > 0) {
        const url = await handleFileUpload(acceptedFiles[0], 'projectImage');
        if(url) setProjectData(prev => ({ ...prev, imageUrl: url }));
     }
  }, []); 

  const onDropCertFile = useCallback(async (acceptedFiles) => {
    if(acceptedFiles?.length > 0) {
        const url = await handleFileUpload(acceptedFiles[0], 'certFile');
        if(url) setCertData(prev => ({ ...prev, certUrl: url }));
    }
 }, []); 


  // --- DATA SAVE HANDLERS ---
  const saveProfile = async () => {
      setIsSaving(true);
      try {
          await api.put('/data/profile', profileData);
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
          await api.post('/data/project', { ...projectData, techStack: stackArray });
          setStatusMsg('Project Added Successfully');
          // Reset form
          setProjectData({ title: '', description: '', liveLink: '', imageUrl: '' });
          setTechStackInput('');
      } catch(err) { 
          setStatusMsg('Error adding project'); 
          console.error(err);
      }
      setIsSaving(false);
  };

  const saveCert = async () => {
    setIsSaving(true);
    try {
        await api.post('/data/certificate', certData);
        setStatusMsg('Certificate Added Successfully');
        setCertData({ title: '', issuer: '', issueDate: '', certUrl: '' });
    } catch(err) { 
        setStatusMsg('Error adding certificate'); 
        console.error(err);
    }
    setIsSaving(false);
};


  // Dropzone hooks
  const resumeDrop = useDropzone({ onDrop: onDropResume, accept: {'application/pdf': ['.pdf']}, maxFiles: 1 });
  const projectDrop = useDropzone({ onDrop: onDropProjectImg, accept: {'image/*': []}, maxFiles: 1 });
  const certDrop = useDropzone({ onDrop: onDropCertFile, accept: {'image/*': [], 'application/pdf': []}, maxFiles: 1 });


  // --- UI HELPERS ---
  const UploadBox = ({ dropzoneHook, label, currentUrl, isPdf=false }) => (
    <div {...dropzoneHook.getRootProps()} 
      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all h-64 bg-cyber-dark/50
        ${dropzoneHook.isDragActive ? 'border-cyber-red bg-cyber-red/10' : 'border-white/20 hover:border-cyber-red/50'}
      `}>
      <input {...dropzoneHook.getInputProps()} />
      {uploadStatus === 'uploading' ? (
         <div className="animate-pulse text-cyber-red flex flex-col items-center"><Loader className="animate-spin mb-2"/><p>&gt; UPLOADING...</p></div>
      ) : currentUrl ? (
         <div className="text-green-500 flex flex-col items-center">
            <CheckCircle className="mb-2" size={32} />
            <p className="text-sm font-mono mb-2">&gt; FILE ON SERVER</p>
            {isPdf ? <FileText size={40} className="text-cyber-text opacity-50"/> : <img src={currentUrl} alt="Preview" className="h-24 w-24 object-cover rounded border border-green-500/50" />}
            <p className="text-xs text-cyber-muted mt-2">Drag to replace</p>
         </div>
      ) : (
         <div className="text-center text-gray-500">
           <Upload className="mb-4 mx-auto text-cyber-red" size={32} />
           <p className="text-lg font-bold text-white mb-1">DROP {label.toUpperCase()}</p>
         </div>
      )}
    </div>
  );

  const InputField = ({ label, value, onChange, textarea=false, placeholder }) => (
      <div className="mb-4">
          <label className="block text-xs font-bold text-cyber-muted uppercase tracking-widest mb-2">{label}</label>
          {textarea ? (
            <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyber-red font-mono" />
          ) : (
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyber-red font-mono" />
          )}
      </div>
  );


  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text pt-28 px-4 md:px-8 font-mono pb-20">
      <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-cyber-red mb-8">&gt; COMMAND_CENTER // ADMIN</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {['profile', 'project', 'certificate'].map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setStatusMsg(''); }}
            className={`px-4 py-2 uppercase tracking-widest text-sm transition-colors ${ activeTab === tab ? 'bg-cyber-red text-black font-bold' : 'text-gray-500 hover:text-white' }`}>
            [{tab.toUpperCase()}_DATA]
          </button>
        ))}
      </div>

      {/* STATUS MESSAGE */}
      {statusMsg && <div className={`mb-6 p-3 rounded border ${statusMsg.includes('Error') ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-green-500 bg-green-500/10 text-green-500'}`}>{statusMsg}</div>}

      {/* === TAB CONTENT === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
            <>
            <div className="bg-cyber-dark/30 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl text-white mb-6">&gt; EDIT DATA</h3>
                <InputField label="Role Title" value={profileData.role} onChange={e => setProfileData({...profileData, role: e.target.value})} />
                <InputField label="Email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                <InputField label="Phone" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                <InputField label="LinkedIn URL" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} />
                <InputField label="GitHub URL" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} />
                <InputField label="Instagram URL" value={profileData.instagram} onChange={e => setProfileData({...profileData, instagram: e.target.value})} />
                
                <button onClick={saveProfile} disabled={isSaving} className="mt-4 w-full flex items-center justify-center gap-2 bg-cyber-red text-black font-bold py-3 rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest">
                    {isSaving ? <Loader className="animate-spin"/> : <Save size={18}/>} SAVE PROFILE DATA
                </button>
            </div>

            <div>
                <h3 className="text-xl text-white mb-6">&gt; UPLOAD RESUME (PDF)</h3>
                <UploadBox dropzoneHook={resumeDrop} label="Resume PDF" currentUrl={profileData.resumeUrl} isPdf={true} />
                
                {profileData.resumeUrl && (
                    <div className="mt-8 bg-cyber-dark/80 border border-white/10 rounded-xl overflow-hidden h-[500px]">
                        <div className="bg-black/50 p-2 border-b border-white/10 flex justify-between text-xs text-gray-500"><span>LIVE PREVIEW</span></div>
                        <iframe src={profileData.resumeUrl} className="w-full h-full" title="Resume Preview"></iframe>
                    </div>
                )}
            </div>
            </>
        )}

        {/* --- PROJECT TAB --- */}
        {activeTab === 'project' && (
             <>
             <div className="bg-cyber-dark/30 p-6 rounded-xl border border-white/10">
                 <h3 className="text-xl text-white mb-6">&gt; ADD NEW PROJECT</h3>
                 <InputField label="Project Title" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} />
                 <InputField label="Description" textarea value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} />
                 <InputField label="Tech Stack (comma separated)" value={techStackInput} onChange={e => setTechStackInput(e.target.value)} placeholder="React, Node.js, MongoDB" />
                 <InputField label="Live Link URL" value={projectData.liveLink} onChange={e => setProjectData({...projectData, liveLink: e.target.value})} />
                 
                 <button onClick={saveProject} disabled={isSaving || !projectData.imageUrl} className="mt-4 w-full flex items-center justify-center gap-2 bg-cyber-red text-black font-bold py-3 rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
                     {isSaving ? <Loader className="animate-spin"/> : <Save size={18}/>} SAVE PROJECT
                 </button>
                 {!projectData.imageUrl && <p className="text-red-500 text-xs mt-2">* Image upload required to save.</p>}
             </div>
 
             <div>
                 <h3 className="text-xl text-white mb-6">&gt; PROJECT THUMBNAIL</h3>
                 <UploadBox dropzoneHook={projectDrop} label="Project Image" currentUrl={projectData.imageUrl} />
             </div>
             </>
        )}
         
        {/* --- CERTIFICATE TAB --- */}
        {activeTab === 'certificate' && (
             <>
             <div className="bg-cyber-dark/30 p-6 rounded-xl border border-white/10">
                 <h3 className="text-xl text-white mb-6">&gt; ADD NEW CERTIFICATE</h3>
                 <InputField label="Certificate Title" value={certData.title} onChange={e => setCertData({...certData, title: e.target.value})} />
                 <InputField label="Issuer" value={certData.issuer} onChange={e => setCertData({...certData, issuer: e.target.value})} />
                 <InputField label="Issue Date (e.g., Jan 2024)" value={certData.issueDate} onChange={e => setCertData({...certData, issueDate: e.target.value})} />
                 
                 <button onClick={saveCert} disabled={isSaving || !certData.certUrl} className="mt-4 w-full flex items-center justify-center gap-2 bg-cyber-red text-black font-bold py-3 rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
                     {isSaving ? <Loader className="animate-spin"/> : <Save size={18}/>} SAVE CERTIFICATE
                 </button>
                 {!certData.certUrl && <p className="text-red-500 text-xs mt-2">* File upload required to save.</p>}
             </div>
 
             <div>
                 <h3 className="text-xl text-white mb-6">&gt; CERTIFICATE FILE</h3>
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