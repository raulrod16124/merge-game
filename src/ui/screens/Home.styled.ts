import styled, {keyframes} from 'styled-components';

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  text-align: center;
  color: #eef3ff;

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

  @media (min-width: 768px) {
    padding: 72px 32px;
  }
`;

export const glow = keyframes`
  0% { text-shadow: 0 0 4px rgba(160,130,255,0.85), 0 0 16px rgba(100,50,255,0.25); }
  50% { text-shadow: 0 0 12px rgba(180,160,255,0.95), 0 0 28px rgba(120,70,255,0.3); }
  100% { text-shadow: 0 0 4px rgba(160,130,255,0.85), 0 0 16px rgba(100,50,255,0.25); }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(36px, 10vw, 64px);
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 0.9;
  background: linear-gradient(90deg, #fffbff, #c6d9ff 40%, #9efff3 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${glow} 3s ease-in-out infinite;
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
    flex-direction: row;
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

export const LeanText = styled.div`
  max-width: 580px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
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
