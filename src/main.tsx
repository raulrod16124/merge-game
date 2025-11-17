// src/main.tsx
import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from '@/ui/screens/App';
import {registerSW} from 'virtual:pwa-register';
import './index.css';

registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('pwaUpdateAvailable'));
  },
  onOfflineReady() {
    console.log('App lista para uso offline');
  },
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
