import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress console errors for development
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    // Suppress Tailwind CDN warnings
    if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) {
      return;
    }
    // Suppress Supabase API errors in development
    if (args[0] && typeof args[0] === 'string' && args[0].includes('supabase.co')) {
      return;
    }
    originalError.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 