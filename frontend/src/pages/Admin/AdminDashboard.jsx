import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ManageProjects from './ManageProjects';
import ViewMessages from './ViewMessages';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-slate-800 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-300 mb-8">Welcome, {user?.name}! Manage your portfolio content.</p>

        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 font-bold transition ${
              activeTab === 'projects'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 font-bold transition ${
              activeTab === 'messages'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Contact Messages
          </button>
        </div>

        {activeTab === 'projects' && <ManageProjects />}
        {activeTab === 'messages' && <ViewMessages />}
      </div>
    </div>
  );
}
