// src/ui/board/HoleEnemyView.tsx
import {motion} from 'framer-motion';
import styled from 'styled-components';
import {COSMIC_ICONS} from '../constants';

type Props = {
  x: number;
  y: number;
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundWarp = styled(motion.div)`
  position: absolute;
  width: 130%;
  height: 130%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.35) 45%,
    rgba(0, 0, 0, 0) 75%
  );
  filter: blur(6px);
`;

const BHImage = styled(motion.img)`
  width: 72%;
  height: 72%;
  object-fit: contain;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
`;

export function BlackHole({x, y}: Props) {
  const seed = (x * 31 + y * 17) % 7;
  const distanceFactor = Math.sqrt(x * x + y * y) / 10;

  return (
    <Wrapper>
      <BackgroundWarp
        initial={{scale: 0.8, opacity: 0}}
        animate={{
          scale: [
            1 + distanceFactor,
            1.08 + distanceFactor,
            1 + distanceFactor,
          ],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 2.8 + seed * 0.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <BHImage
        src={COSMIC_ICONS.black_hole}
        initial={{scale: 0.4, opacity: 0}}
        animate={{
          scale: 1,
          opacity: 1,
          rotate: [0, 360],
        }}
        transition={{
          duration: 6 + seed * 0.4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </Wrapper>
  );
}
