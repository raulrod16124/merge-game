// src/main.tsx
import React from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import {BrowserRouter} from 'react-router-dom';
import App from '../src/ui/screens/App';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

const updateSW = registerSW({
  onNeedRefresh() {
    /* opcional: notificar UI */
  },
  onOfflineReady() {
    /* opcional: notificar UI */
  },
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

export {updateSW};
