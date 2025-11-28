// src/App.tsx
import React, {useEffect, useState} from 'react';
import {useUserStore} from '@/state/user-store';
import styled from 'styled-components';
import Router from '@/router/Router';
import LoadingScreen from '../components/LoadingScreen';

const AppWrapper = styled.div`
  min-height: 100dvh;
  height: 100dvh;
  overflow-y: hidden;
  overflow-x: hidden;
`;

export default function App() {
  const loadFromStorage = useUserStore(s => s.loadFromStorage);
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    const firstLoad = sessionStorage.getItem('stellar_first_load');

    if (!firstLoad) {
      // Primera vez en esta sesión → mostrar loading mínimo 2s
      sessionStorage.setItem('stellar_first_load', '1');

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowLoading(false), 700); // coincide con CSS
      }, 2000);
    } else {
      // Ya cargó esta sesión → No mostrar loading
      setShowLoading(false);
    }
  }, []);

  return (
    <>
      {showLoading && <LoadingScreen fadingOut={fadeOut} />}
      {!showLoading && (
        <AppWrapper>
          <Router />
        </AppWrapper>
      )}
    </>
  );
}
