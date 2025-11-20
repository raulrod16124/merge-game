import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;

  h2 {
    flex: 1;
    text-align: center;
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .back-btn {
    width: 48px;
  }
`;

export const Content = styled.main`
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
