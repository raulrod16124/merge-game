import {motion} from 'framer-motion';
import styled from 'styled-components';

const Container = styled(motion.div)<{
  $left: number;
  $top: number;
  $size: number;
}>`
  position: absolute;
  left: ${p => p.$left}px;
  top: ${p => p.$top}px;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 25;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

type Props = {
  from: {x: number; y: number};
  to: {x: number; y: number};
  size: number;
  icon: string;
  onDone: () => void;
};

export default function AbsorbAnimation({from, to, size, icon, onDone}: Props) {
  return (
    <Container
      $size={size}
      $left={from.x}
      $top={from.y}
      initial={{scale: 1, opacity: 1}}
      animate={{
        left: to.x,
        top: to.y,
        scale: 0.4,
        opacity: 0,
      }}
      transition={{duration: 0.35, ease: 'easeOut'}}
      onAnimationComplete={onDone}>
      {icon ? <Img src={icon} /> : null}
    </Container>
  );
}
