// src/ui/screens/Home.styled.ts
import styled from 'styled-components';

export const Hero = styled.section`
  width: 100%;
  max-width: 980px;
  margin: 28px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 6px 18px 36px;
  box-sizing: border-box;
`;

export const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(28px, 6vw, 48px);
  color: #0b2340;
  text-shadow: 0 6px 18px rgba(20, 60, 90, 0.12);
  margin: 12px 0 0;
`;

export const HeroSubtitle = styled.p`
  max-width: 760px;
  text-align: center;
  color: #3a647a;
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 760px;
  display: flex;
  gap: 14px;
  align-items: center;
  background: linear-gradient(180deg, #ffffff, #f6fbff);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(14, 45, 66, 0.08);
  overflow: hidden;
  border: 1px solid rgba(10, 30, 45, 0.04);

  @media (max-width: 640px) {
    flex-direction: column;
    padding-bottom: 8px;
  }
`;

export const PreviewBoard = styled.div`
  width: 42%;
  min-width: 220px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #dff6ff, #d9f3fa);
  border-radius: 12px;
  margin: 16px;

  img {
    width: 68%;
    height: auto;
    filter: drop-shadow(0 8px 12px rgba(22, 60, 72, 0.12));
  }

  @media (max-width: 640px) {
    width: 86%;
    height: 140px;
    margin: 12px 0 0;
  }
`;

export const StartButton = styled.button`
  background: linear-gradient(180deg, #ffd66b, #f0b63a);
  border: none;
  padding: 14px 22px;
  border-radius: 14px;
  font-weight: 800;
  color: #2b1910;
  box-shadow: 0 8px 0 rgba(224, 160, 60, 0.18);
  cursor: pointer;
  font-size: 1rem;
`;

export const Credits = styled.div`
  color: #7aa0b5;
  font-size: 12px;
  margin-top: 6px;
`;
