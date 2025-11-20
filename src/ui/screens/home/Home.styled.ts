import styled from 'styled-components';

export const Hero = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  text-align: center;
  color: #eef3ff;

  @media (min-width: 768px) {
    width: auto;
    padding: 72px 32px;
    margin: 0 auto;
  }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(36px, 10vw, 64px);
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 0.9;
  background: linear-gradient(90deg, #fffbff, #7b4dff 40%, #5a2fd4 60%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const HeroSubtitle = styled.p`
  margin: 20px auto 0;
  max-width: 620px;
  font-size: 16px;
  line-height: 1.45;
  opacity: 0.92;
`;

export const HeroBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-top: 36px;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

export const PreviewOrb = styled.div`
  width: 108px;
  height: 108px;
  border-radius: 36px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: visible;

  background:
    radial-gradient(
      circle at 25% 25%,
      rgba(255, 255, 255, 0.16),
      rgba(120, 60, 255, 0.06)
    ),
    linear-gradient(180deg, rgba(120, 70, 255, 0.12), rgba(63, 10, 120, 0.1));
  box-shadow:
    0 6px 24px rgba(100, 50, 255, 0.18),
    inset 0 -4px 12px rgba(0, 0, 0, 0.18);
  border: 3px solid rgba(255, 255, 255, 0.06);
`;

export const OrbLabel = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 800;
  color: rgba(230, 240, 255, 0.88);
  text-transform: uppercase;
`;

export const StartButton = styled.a`
  display: inline-flex;
  justify-content: center;
  padding: 14px 26px;
  border-radius: 16px;
  margin-top: 18px;

  font-size: 18px;
  font-weight: 900;
  text-decoration: none;

  background: linear-gradient(180deg, #fff5bd, #ffd28a, #ffb374);
  color: #1a0f00;
  border: 3px solid rgba(0, 0, 0, 0.07);
  box-shadow:
    0 10px 0 rgba(0, 0, 0, 0.2),
    0 18px 40px rgba(255, 180, 90, 0.12);

  transition: 140ms ease;

  &:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow:
      0 14px 0 rgba(0, 0, 0, 0.22),
      0 26px 60px rgba(255, 180, 90, 0.18);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const Credits = styled.div`
  margin-top: 32px;
  font-size: 13px;
  opacity: 0.7;
`;
