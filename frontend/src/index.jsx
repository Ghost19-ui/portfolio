import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// FIX: Add this line back to load your styles and Tailwind
import './styles/index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);