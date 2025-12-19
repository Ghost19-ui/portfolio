import React from 'react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white">About Me</h1>
      
      <div className="bg-slate-800 rounded-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Who Am I?</h2>
        <p className="text-gray-300 mb-4">
          I'm a passionate 3rd-year B.Tech CSE student specializing in Cybersecurity at Parul University. 
          My journey in tech started with curiosity about how systems work and how to secure them.
        </p>
        <p className="text-gray-300 mb-4">
          I specialize in penetration testing, vulnerability assessment, ethical hacking, and building secure web applications. 
          I believe in learning by doing and constantly pushing my boundaries.
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Penetration Testing', 
            'Kali Linux', 'Ethical Hacking', 'Web Security', 'SQL', 'Bash', 'Git'].map((skill) => (
            <div key={skill} className="bg-blue-600 p-3 rounded text-center font-semibold">
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Education</h2>
        <div className="border-l-4 border-blue-600 pl-4">
          <h3 className="text-xl font-bold">B.Tech CSE (Cybersecurity)</h3>
          <p className="text-gray-300">Parul University, 3rd Year</p>
          <p className="text-gray-400">Expected Graduation: 2026</p>
        </div>
      </div>
    </div>
  );
}
