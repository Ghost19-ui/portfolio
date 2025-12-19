import React, { useState } from 'react';
import API from '../api/axiosConfig';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert('Error sending message: ' + error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Get In Touch</h1>
      
      {submitted && (
        <div className="bg-green-600 text-white p-4 rounded mb-6 text-center">
          ✓ Message received! I'll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 space-y-6">
        <div>
          <label className="text-white font-semibold block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-600 focus:outline-none"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-white font-semibold block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-600 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="text-white font-semibold block mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            minLength="10"
            rows="6"
            className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-600 focus:outline-none resize-none"
            placeholder="Your message here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
