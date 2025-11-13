import {motion} from 'framer-motion';

type FloatingScoreProps = {
  x: number;
  y: number;
  points: number;
  onDone: () => void;
};

export function FloatingScore({x, y, points, onDone}: FloatingScoreProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 0}}
      animate={{opacity: 1, y: -40}}
      exit={{opacity: 0}}
      transition={{duration: 0.8}}
      onAnimationComplete={onDone}
      className="absolute text-yellow-300 font-bold text-xl pointer-events-none select-none"
      style={{
        left: x * 82 + 20,
        top: y * 82 + 10,
      }}>
      +{points}
    </motion.div>
  );
}
