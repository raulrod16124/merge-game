// src/ui/board/BlackHole.tsx
import {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import styled from 'styled-components';
import {useGameStore} from '../../state/game-store';

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
  z-index: 22;
  pointer-events: none;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export default function BlackHole({x, y}: {x: number; y: number}) {
  const {cellRects, holes} = useGameStore();

  const hole = holes?.find(h => h.pos.x === x && h.pos.y === y);

  // === HOOKS (deben ir siempre en el mismo orden)
  const prev = useRef({x, y});
  const prevFragments = useRef(0);

  const [isMoving, setIsMoving] = useState(false);
  const [isAbsorbing, setIsAbsorbing] = useState(false);

  const cell = cellRects?.[`${x},${y}`] || null;

  // --- Detect movement ---
  useEffect(() => {
    if (!cell) return; // ← permitido dentro del hook
    if (prev.current.x !== x || prev.current.y !== y) {
      setIsMoving(true);
      const t = setTimeout(() => setIsMoving(false), 200);
      prev.current = {x, y};
      return () => clearTimeout(t);
    }
  }, [x, y, cell]);

  // --- Detect absorption ---
  const fragmentCount = hole
    ? Object.values(hole.fragments ?? {}).reduce(
        (a: number, b: any) => a + b,
        0,
      )
    : 0;

  useEffect(() => {
    if (!cell) return;
    if (fragmentCount > prevFragments.current) {
      setIsAbsorbing(true);
      const t = setTimeout(() => setIsAbsorbing(false), 200);
      prevFragments.current = fragmentCount;
      return () => clearTimeout(t);
    }
  }, [fragmentCount, cell]);

  // --- Animate state ---
  const animateProps = isAbsorbing
    ? {scale: 0.75, rotate: -5}
    : isMoving
      ? {scale: 1.12, rotate: 5, y: -4}
      : {scale: 1, rotate: 0, y: 0};

  const blackHoleImage = `${import.meta.env.BASE_URL}cosmic/black_hole.png`;

  // === RETURN FINAL (después de los hooks) ===
  if (!cell) return null;

  return (
    <AnimatePresence>
      <Container
        key={`${x}-${y}`}
        $left={cell.centerX}
        $top={cell.centerY}
        $size={cell.size * 0.9}
        initial={{scale: 1, rotate: 0, y: 0}}
        animate={animateProps}
        transition={{duration: 0.25, ease: 'easeOut'}}>
        <Img src={blackHoleImage} />
      </Container>
    </AnimatePresence>
  );
}
