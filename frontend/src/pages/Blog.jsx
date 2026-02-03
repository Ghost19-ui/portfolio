import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import CyberGlobe from '../components/CyberGlobe'; // <--- UPDATED IMPORT
import { Loader2, Calendar, Tag } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/content/blogs')
      .then(res => setBlogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      {/* 1. REPLACED MISSING BACKGROUND WITH CYBERGLOBE */}
      <CyberGlobe />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12 border-b border-red-900/30 pb-6">
          <h1 className="text-4xl font-bold text-white mb-2">INTELLIGENCE_LOGS</h1>
          <p className="text-red-500 text-sm tracking-widest">:: SECURITY RESEARCH & CTF WRITEUPS ::</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>
        ) : (
          <div className="space-y-12">
            {blogs.length > 0 ? blogs.map(blog => (
              <article key={blog._id} className="bg-black/60 border border-gray-800 p-8 rounded hover:border-red-600 transition-all group backdrop-blur-sm">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-mono">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="text-red-900">|</span>
                  <div className="flex gap-2">
                    {(blog.tags || []).map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 text-red-400 bg-red-950/30 px-2 py-0.5 rounded"><Tag size={10}/> {tag}</span>
                    ))}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{blog.title}</h2>
                <p className="text-gray-400 mb-6 font-sans leading-relaxed border-l-2 border-red-900/50 pl-4">{blog.summary}</p>
                
                <div className="text-gray-300 font-sans whitespace-pre-wrap leading-relaxed border-t border-gray-800 pt-6">
                  {blog.content}
                </div>
              </article>
            )) : (
              <div className="text-center py-10 border border-dashed border-red-900/30 text-gray-500">
                No intelligence reports filed yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}