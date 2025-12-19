import React, { useEffect, useState } from 'react';
import API from '../../api/axiosConfig';

export default function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await API.get('/contact/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await API.delete(`/contact/${id}`);
        fetchMessages();
      } catch (error) {
        alert('Error: ' + error.response?.data?.error || error.message);
      }
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact Messages ({messages.length})</h2>

      {messages.length === 0 ? (
        <p className="text-gray-300">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-slate-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{msg.name}</h3>
                  <p className="text-gray-400">{msg.email}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-bold ${
                  msg.status === 'new' ? 'bg-red-600' : 'bg-green-600'
                }`}>
                  {msg.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 mb-3">{msg.message}</p>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(msg._id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
