import {motion} from 'framer-motion';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 30;
  pointer-events: none;
  background: rgba(0, 180, 255, 0.25);
  backdrop-filter: blur(1px);
  border-radius: 50%;
  border: 2px solid rgba(0, 220, 255, 0.4);
`;

type Props = {
  size: number;
  left: number;
  top: number;
};

export function FreezeOverlay({size, left, top}: Props) {
  return (
    <Overlay
      initial={{scale: 0, opacity: 0}}
      animate={{scale: 1, opacity: 1, left, top}}
      exit={{scale: 0, opacity: 0}}
      transition={{duration: 0.22}}
      style={{width: size, height: size, left, top}}
    />
  );
}
