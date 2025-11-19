// src/ui/layout/AppLayout.tsx
import React from 'react';
import styled from 'styled-components';
import {Header} from '../components/Header';
import {PWAUpdateModal} from '../components/modals/PWAUpdateModal';

const Wrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  background: #0a0d13;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      800px 400px at 50% 0%,
      rgba(110, 45, 255, 0.06),
      transparent
    ),
    radial-gradient(
      800px 400px at 50% 100%,
      rgba(0, 220, 200, 0.05),
      transparent
    );
  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 960px;
  }
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
