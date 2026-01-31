import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

const ACCEPT_MAP = {
  'application/pdf': ['.pdf'],
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
};

const parseAccept = (acceptStr) => {
  if (typeof acceptStr !== 'string') return undefined;
  const parts = acceptStr.split(',').map((s) => s.trim());
  const obj = {};
  parts.forEach((p) => {
    if (ACCEPT_MAP[p]) obj[p] = ACCEPT_MAP[p];
  });
  return Object.keys(obj).length ? obj : { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] };
};

const FileUploadZone = ({ onFileSelect, accept = 'application/pdf, image/*', label = 'Drop file here or click to browse' }) => {
  const acceptObj = useMemo(() => parseAccept(accept), [accept]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) onFileSelect(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObj,
    maxFiles: 1,
    multiple: false,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center gap-3
        ${isDragActive
          ? 'border-cyber-red bg-cyber-red/10 shadow-[0_0_24px_rgba(220,38,38,0.4)]'
          : 'border-cyber-text/30 bg-cyber-dark/50 hover:border-cyber-red/60 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]'
        }
      `}
      whileHover={!isDragActive ? { scale: 1.01 } : {}}
      whileTap={{ scale: 0.99 }}
    >
      <input {...getInputProps()} />
      <Upload
        size={40}
        className={isDragActive ? 'text-cyber-red' : 'text-cyber-text/60'}
      />
      <span
        className={`font-mono text-sm font-bold uppercase tracking-wider ${
          isDragActive ? 'text-cyber-red' : 'text-cyber-text/80'
        }`}
      >
        {isDragActive ? 'Release to upload' : label}
      </span>
    </motion.div>
  );
};

export default FileUploadZone;
