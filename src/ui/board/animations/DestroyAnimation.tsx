import {motion} from 'framer-motion';
import {COSMIC_ICONS} from '@/ui/constants';

export function DestroyAnimation({
  x,
  y,
  icon,
  boardRect,
}: {
  x: number;
  y: number;
  icon: string;
  boardRect?: DOMRect | null;
}) {
  const localX = x - (boardRect?.left ?? 0);
  const localY = y - (boardRect?.top ?? 0);
  return (
    <motion.img
      // @ts-ignore
      src={COSMIC_ICONS[icon]}
      style={{
        position: 'absolute',
        left: localX - 24,
        top: localY - 24,
        width: 48,
        height: 48,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      initial={{scale: 1, opacity: 1, rotate: 0}}
      animate={{scale: 1.8, opacity: 0, rotate: 120}}
      transition={{duration: 0.5, ease: 'easeOut'}}
    />
  );
}
