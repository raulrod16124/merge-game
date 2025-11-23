// src/ui/board/BlackHoleVisual.tsx
import {motion} from 'framer-motion';
import styled from 'styled-components';
import {COSMIC_ICONS} from '../constants';
import {useGameStore} from '@/state/game-store';

const BHImg = styled(motion.img)`
  position: fixed;
  z-index: 40;
  pointer-events: none;
`;

type Props = {
  plan: {
    bhId: string;
    from: {x: number; y: number};
    to: {x: number; y: number};
    absorbedId?: string;
    absorbedType?: string;
  };
  fromRect: {centerX: number; centerY: number; size: number};
  toRect: {centerX: number; centerY: number; size: number};
  onDone: () => void;
};

export function BlackHoleVisual({plan, fromRect, toRect, onDone}: Props) {
  const confirmEnemyMove = useGameStore(s => s.confirmEnemyMove);

  const fromLeft = Math.round(fromRect.centerX - fromRect.size / 2);
  const fromTop = Math.round(fromRect.centerY - fromRect.size / 2);
  const toLeft = Math.round(toRect.centerX - toRect.size / 2);
  const toTop = Math.round(toRect.centerY - toRect.size / 2);

  return (
    <BHImg
      src={COSMIC_ICONS.black_hole}
      initial={{left: fromLeft, top: fromTop, scale: 0.7, opacity: 0}}
      animate={{left: toLeft, top: toTop, scale: 1, opacity: 1}}
      transition={{
        delay: 0.15,
        duration: 0.45,
        ease: 'easeInOut',
      }}
      style={{
        width: fromRect.size,
        height: fromRect.size,
        left: fromLeft,
        top: fromTop,
      }}
      onAnimationComplete={() => {
        confirmEnemyMove(plan.bhId, plan.to, plan.absorbedId);
        onDone();
      }}
    />
  );
}
