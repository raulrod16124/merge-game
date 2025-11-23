// src/ui/board/AbsorbedEffect.tsx
import {motion} from 'framer-motion';
import styled from 'styled-components';
import {COSMIC_ICONS} from '../constants';

const AbsImg = styled(motion.img)`
  position: fixed;
  z-index: 45;
  pointer-events: none;
`;

type Props = {
  id: string;
  absorbedType: string;
  fromRect: {centerX: number; centerY: number; size: number};
  toRect: {centerX: number; centerY: number; size: number};
  onDone: (id: string) => void;
};

export function AbsorbedEffect({
  id,
  absorbedType,
  fromRect,
  toRect,
  onDone,
}: Props) {
  const fromLeft = Math.round(fromRect.centerX - fromRect.size / 2);
  const fromTop = Math.round(fromRect.centerY - fromRect.size / 2);
  const toLeft = Math.round(toRect.centerX - toRect.size / 2);
  const toTop = Math.round(toRect.centerY - toRect.size / 2);

  return (
    <AbsImg
      src={COSMIC_ICONS[absorbedType as keyof typeof COSMIC_ICONS]}
      initial={{left: fromLeft, top: fromTop, scale: 1, opacity: 1}}
      animate={{
        left: toLeft,
        top: toTop,
        scale: 0.1,
        opacity: 0,
      }}
      transition={{
        delay: 0,
        duration: 0.45,
        ease: 'easeIn',
      }}
      style={{
        width: fromRect.size,
        height: fromRect.size,
      }}
      onAnimationComplete={() => onDone(id)}
    />
  );
}
