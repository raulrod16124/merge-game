// src/App.tsx
import React from 'react';
import {useUserStore} from '@/state/user-store';
import styled from 'styled-components';
import Router from '@/router/Router';

const AppWrapper = styled.div`
  min-height: 100dvh;
  height: 100dvh;
  overflow-y: hidden;
  overflow-x: hidden;
`;

export default function App() {
  const loadFromStorage = useUserStore(s => s.loadFromStorage);

  React.useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <AppWrapper>
      <Router />
    </AppWrapper>
  );
}
