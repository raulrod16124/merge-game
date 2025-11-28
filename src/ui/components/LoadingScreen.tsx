import {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {COLORS} from '../constants';

const fadeOutAnim = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Wrapper = styled.div<{$fadeOut: boolean}>`
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #120433, #09001d);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
  z-index: 9999;

  opacity: 1;
  animation: ${({$fadeOut}) => ($fadeOut ? fadeOutAnim : 'none')} 0.7s ease
    forwards;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  color: #ffffff;
  font-size: 2.6rem;
  text-align: center;
  letter-spacing: 2px;
  line-height: 1.2;
  margin-bottom: 32px;
  text-shadow:
    0 0 12px ${COLORS.secondary},
    0 0 18px ${COLORS.secondaryDark};
  user-select: none;

  @media (max-width: 420px) {
    font-size: 2.1rem;
  }
`;

const BarBg = styled.div`
  width: 65%;
  height: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

const BarFill = styled.div<{$progress: number}>`
  height: 100%;
  border-radius: 8px;
  width: ${({$progress}) => $progress}%;
  background: linear-gradient(
    90deg,
    ${COLORS.secondary},
    ${COLORS.secondaryDark}
  );
  transition: width 0.3s ease-out;
`;

export default function LoadingScreen({fadingOut}: {fadingOut: boolean}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 8;
      if (p >= 100) {
        clearInterval(interval);
      }
      setProgress(Math.min(p, 100));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper $fadeOut={fadingOut}>
      <Title>
        Stellar
        <br />
        Merge
      </Title>

      <BarBg>
        <BarFill $progress={progress} />
      </BarBg>
    </Wrapper>
  );
}
