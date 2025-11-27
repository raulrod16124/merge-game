// src/main.tsx
import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import {BrowserRouter} from 'react-router-dom';
import App from '../src/ui/screens/App';
import './index.css';
import {usePlayerStore, useUserStore} from './state';
import {onAuthChanged} from './core/firebase';

function InitFirebaseAuthSync() {
  useEffect(() => {
    const unsubscribe = onAuthChanged(async user => {
      if (user) {
        // 🔹 Estado inicial para evitar pantallazos de redirección
        useUserStore.setState({
          uid: user.uid,
          authenticated: true,
          loading: true,
        });

        // 🔹 Cargar datos del usuario
        await useUserStore.getState().loadFromFirebase(user.uid);

        // 🔹 Cargar progreso del jugador
        await usePlayerStore.getState().loadFromFirebase();

        // 🔹 Marcamos carga como terminada
        useUserStore.setState({loading: false});
      } else {
        // 🔹 Limpiar completamente el estado
        useUserStore.getState().logout();
        usePlayerStore.getState().resetToInitialState();
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}

const updateSW = registerSW({
  onNeedRefresh() {
    /* opcional: notificar UI */
  },
  onOfflineReady() {
    /* opcional: notificar UI */
  },
});

function updateViewportSize() {
  document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
}

// Ejecutar al inicio
updateViewportSize();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InitFirebaseAuthSync />
    <BrowserRouter
      basename={
        window.location.hostname.includes('github.io') ? '/merge-game/' : '/'
      }>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

export {updateSW};
