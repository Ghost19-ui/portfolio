import React, { useEffect, useState } from 'react';
import API from '../../api/axiosConfig';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        techStack: formData.techStack.split(',').map((t) => t.trim()),
      };

      if (editingId) {
        await API.put(`/projects/${editingId}`, data);
        setEditingId(null);
      } else {
        await API.post('/projects', data);
      }

      setFormData({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
      fetchProjects();
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || error.message);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await API.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        alert('Error: ' + error.response?.data?.error || error.message);
      }
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-slate-700 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">{editingId ? 'Edit' : 'Add'} Project</h2>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project title"
          required
          className="w-full px-4 py-2 rounded bg-slate-600 text-white border border-blue-600"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project description"
          required
          rows="4"
          className="w-full px-4 py-2 rounded bg-slate-600 text-white border border-blue-600"
        />

        <input
          type="text"
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="Tech stack (comma-separated: React, Node, MongoDB)"
          className="w-full px-4 py-2 rounded bg-slate-600 text-white border border-blue-600"
        />

        <input
          type="url"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full px-4 py-2 rounded bg-slate-600 text-white border border-blue-600"
        />

        <input
          type="url"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleChange}
          placeholder="Live demo URL"
          className="w-full px-4 py-2 rounded bg-slate-600 text-white border border-blue-600"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold transition"
          >
            {editingId ? 'Update' : 'Add'} Project
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
              }}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-bold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Projects ({projects.length})</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-slate-700 p-4 rounded-lg flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-300">{project.description.substring(0, 100)}...</p>
                <div className="flex gap-2 mt-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="bg-blue-600 px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
