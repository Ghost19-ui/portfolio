import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-cyber-text selection:bg-cyber-red/30 bg-cyber-black">
      <Navbar />
      <main className="flex-grow w-full relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
