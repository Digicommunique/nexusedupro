
import React from 'react';
import ReactDOM from 'react-dom/client';

// Ensure process is defined before App and other services are imported
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
}

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);