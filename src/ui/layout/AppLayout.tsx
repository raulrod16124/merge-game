// src/ui/layout/AppLayout.tsx
import React from 'react';
import styled from 'styled-components';
import {Header} from '../components/Header';
import {PWAUpdateModal} from '../components/modals/PWAUpdateModal';

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0a0d13;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding-top: 72px;
  box-sizing: border-box;
`;

export function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <Wrapper>
      <Header />
      <Content>{children}</Content>
      <PWAUpdateModal />
    </Wrapper>
  );
}
