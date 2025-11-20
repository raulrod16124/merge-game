// src/ui/layout/AppLayout.tsx
import React from 'react';
import {Header} from '../components/Header';
import {PWAUpdateModal} from '../components/modals/PWAUpdateModal';
import {Content, Wrapper} from './AppLayout.styled';

interface IProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export function AppLayout({children, hideHeader}: IProps) {
  return (
    <Wrapper>
      {hideHeader ? null : <Header />}
      <Content>{children}</Content>
      <PWAUpdateModal />
    </Wrapper>
  );
}
