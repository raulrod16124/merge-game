// src/ui/layout/GameLayout.tsx
import styled from 'styled-components';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  overflow: hidden;
`;

const HUDContainer = styled.div`
  flex: 0 0 auto;
  width: 100%;
  z-index: 10;
`;

const BoardArea = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export default function GameLayout({children}: {children: React.ReactNode}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}

export {HUDContainer, BoardArea};
