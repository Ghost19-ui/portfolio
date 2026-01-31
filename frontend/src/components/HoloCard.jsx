import React from 'react';

const HoloCard = ({ children, title = "SYSTEM TERMINAL" }) => {
  return (
    <div className="holo-container relative group">
        
      {/* Floating Animation Wrapper */}
      <div className="animate-float">
        
        {/* The Glass Window */}
        <div className="
            relative 
            bg-black/40 
            backdrop-blur-md 
            border border-red-500/30 
            rounded-lg 
            p-1 
            shadow-[0_0_50px_rgba(255,15,57,0.15)]
            overflow-hidden
        ">
            
          {/* Scanline Effect Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%] opacity-20"></div>

          {/* Window Header / Title Bar */}
          <div className="flex justify-between items-center bg-red-900/20 px-4 py-2 border-b border-red-500/30 relative z-10">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ff0000]"></div>
                <span className="font-mono text-xs text-red-400 tracking-widest uppercase">{title}</span>
            </div>
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-red-500/50"></div>
                <div className="w-2 h-2 bg-red-500/50"></div>
                <div className="w-2 h-2 bg-red-500/50"></div>
            </div>
          </div>

          {/* Window Content */}
          <div className="p-8 relative z-10 text-slate-200">
            {children}
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-red-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-red-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-red-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-red-500"></div>
        </div>
      </div>
      
    </div>
  );
};

export default HoloCard;