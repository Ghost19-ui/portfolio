import React from 'react';

const GlitchText = ({ text, className }) => {
  return (
    <div className={`cyber-glitch font-mono font-bold tracking-widest ${className}`} data-text={text}>
      {text}
    </div>
  );
};

export default GlitchText;