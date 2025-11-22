// src/ui/board/AbsorbedEffect.tsx
import {motion} from 'framer-motion';
import styled from 'styled-components';
import {COSMIC_ICONS} from '../constants';

const AbsImg = styled(motion.img)`
  position: fixed;
  z-index: 60;
  pointer-events: none;
`;

type AbsorbedEffectProps = {
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
}: AbsorbedEffectProps) {
  if (!fromRect || !toRect) return null;

  const fromLeft = Math.round(fromRect.centerX - fromRect.size / 2);
  const fromTop = Math.round(fromRect.centerY - fromRect.size / 2);
  const toLeft = Math.round(toRect.centerX - toRect.size / 2);
  const toTop = Math.round(toRect.centerY - toRect.size / 2);

  return (
    <AbsImg
      src={COSMIC_ICONS[absorbedType as keyof typeof COSMIC_ICONS]}
      alt={absorbedType}
      initial={{
        left: fromLeft,
        top: fromTop,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        left: toLeft,
        top: toTop,
        opacity: 0,
        scale: 0.2,
      }}
      // transition={{duration: 0.36, ease: 'easeOut'}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      onAnimationComplete={() => onDone(id)}
      style={{
        width: fromRect.size,
        height: fromRect.size,
      }}
    />
  );
}
