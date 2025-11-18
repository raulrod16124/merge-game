// src/ui/board/Supernova.tsx
import {motion} from 'framer-motion';
import styled from 'styled-components';

const Wrapper = styled(motion.div)<{
  $left: number;
  $top: number;
}>`
  position: absolute;
  left: ${p => p.$left}px;
  top: ${p => p.$top}px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 30;
`;

const Pulse = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 220, 140, 1) 0%,
    rgba(255, 80, 50, 0.8) 50%,
    rgba(255, 0, 0, 0) 100%
  );
  filter: blur(3px);
`;

export default function Supernova({
  x,
  y,
  onDone,
}: {
  x: number;
  y: number;
  onDone: () => void;
}) {
  return (
    <Wrapper
      $left={x}
      $top={y}
      initial={{scale: 0, opacity: 0.6}}
      animate={{scale: 2.2, opacity: 0}}
      transition={{duration: 0.55, ease: 'easeOut'}}
      onAnimationComplete={onDone}>
      <Pulse />
    </Wrapper>
  );
}
