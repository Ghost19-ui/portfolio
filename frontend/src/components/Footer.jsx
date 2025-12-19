import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white text-center py-6 mt-12">
      <div className="flex justify-center gap-4 mb-4">
        <a href="https://linkedin.com/in/tushar-saini" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
          LinkedIn
        </a>
        <a href="https://instagram.com/tushar_saini___19" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
          Instagram
        </a>
        <a href="https://github.com/tushar-saini" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          GitHub
        </a>
      </div>
      <p>© {currentYear} Tushar Saini. All rights reserved.</p>
    </footer>
  );
}
