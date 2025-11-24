// src/ui/board/GameBoard.tsx
import {motion, AnimatePresence} from 'framer-motion';
import {useGameStore} from '../../state/game-store';

import {Tile} from './Tile';
import {FloatingScore} from './FloatingScore';
import {BlackHoleVisual} from './BlackHoleVisual';
import {HUDBlackHoleCounter} from './HUDBlackHoleCounter';
import {AbsorbedEffect} from './AbsorbedEffect';

import {
  BoardWrapper,
  BoardContainer,
  Grid,
  FloatingLayer,
  ItemsLayer,
} from './GameBoard.styled';
import {COSMIC_ICONS} from '../constants';

export function GameBoard() {
  const {
    items,
    boardSize,
    addItem,
    floatingScores,
    cellRects,
    removeFloatingScore,
    visualEnemyPlans,
    absorbedEffects,
  } = useGameStore();

  const cols = boardSize?.cols ?? 6;
  const rows = boardSize?.rows ?? 6;

  const onClickEmpty = (pos: {x: number; y: number}) => {
    addItem(pos);
  };

  return (
    <BoardWrapper>
      <motion.div
        initial={{opacity: 0, y: -8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.28}}
        style={{width: '100%', height: '100%'}}>
        <BoardContainer>
          <Grid cols={cols} rows={rows}>
            {Array.from({length: cols * rows}).map((_, index) => {
              const x = index % cols;
              const y = Math.floor(index / cols);
              const item = items.find(i => i.pos.x === x && i.pos.y === y);

              return (
                <div
                  key={`${x}-${y}`}
                  ref={el => {
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const key = `${x},${y}`;
                    const prev = useGameStore.getState().cellRects[key];

                    const newRect = {
                      size: rect.width,
                      centerX: rect.left + rect.width / 2,
                      centerY: rect.top + rect.height / 2,
                    };

                    if (
                      !prev ||
                      prev.size !== newRect.size ||
                      prev.centerX !== newRect.centerX ||
                      prev.centerY !== newRect.centerY
                    ) {
                      useGameStore.getState().setCellRect(key, newRect);
                    }
                  }}
                  style={{width: '100%', height: '100%'}}>
                  <Tile x={x} y={y} item={item} onClickEmpty={onClickEmpty} />
                </div>
              );
            })}
          </Grid>

          {/* Items layer: absolute rendered items for smooth animation */}
          <ItemsLayer aria-hidden>
            <AnimatePresence>
              {items.map(item => {
                // Ocultar agujeros negros estáticos si están siendo animados
                const isBH = item.type === 'black_hole';
                const isBHAnimating = visualEnemyPlans.some(
                  p => p.bhId === item.id,
                );

                if (isBH) {
                  // si está animándose, NO renderizamos el BH estático
                  if (isBHAnimating) return null;

                  // si NO está animándose, renderizar BH estático
                  const key = `${item.pos.x},${item.pos.y}`;
                  const rect = cellRects?.[key];
                  if (!rect) return null;

                  const left = Math.round(rect.centerX - rect.size / 2);
                  const top = Math.round(rect.centerY - rect.size / 2);

                  return (
                    <motion.img
                      key={item.id}
                      src={COSMIC_ICONS.black_hole}
                      alt={item.type}
                      draggable={false}
                      initial={{scale: 0.7, opacity: 0}}
                      animate={{scale: 1, opacity: 1, left, top}}
                      exit={{opacity: 0, scale: 0.6}}
                      transition={{duration: 0.22}}
                      style={{
                        position: 'fixed',
                        width: rect.size,
                        height: rect.size,
                        left,
                        top,
                        pointerEvents: 'none',
                        zIndex: 20,
                      }}
                    />
                  );
                }

                // Items normales (no agujeros negros)
                const key = `${item.pos.x},${item.pos.y}`;
                const rect = cellRects?.[key];
                if (!rect) return null;

                const left = Math.round(rect.centerX - rect.size / 2);
                const top = Math.round(rect.centerY - rect.size / 2);

                return (
                  <motion.img
                    key={item.id}
                    src={COSMIC_ICONS[item.type as keyof typeof COSMIC_ICONS]}
                    alt={item.type}
                    draggable={false}
                    initial={{scale: 0.4, opacity: 0}}
                    exit={{opacity: 0, scale: 0.6}}
                    transition={{duration: 0.22}}
                    style={{
                      position: 'fixed',
                      width: rect.size,
                      height: rect.size,
                      left,
                      top,
                      pointerEvents: 'none',
                      zIndex: 20,
                    }}
                  />
                );
              })}
            </AnimatePresence>

            {/* Render BH visual plans */}
            <AnimatePresence>
              {visualEnemyPlans.map(plan => {
                const fromKey = `${plan.from.x},${plan.from.y}`;
                const toKey = `${plan.to.x},${plan.to.y}`;
                const fromRect = cellRects?.[fromKey];
                const toRect = cellRects?.[toKey];
                if (!fromRect || !toRect) return null;

                return (
                  <BlackHoleVisual
                    key={`bh_visual_${plan.bhId}_${plan.to.x}_${plan.to.y}`}
                    plan={plan as any}
                    fromRect={fromRect}
                    toRect={toRect}
                    onDone={() => {
                      useGameStore
                        .getState()
                        .removeVisualEnemyPlan(plan.bhId, plan.to);
                    }}
                  />
                );
              })}
            </AnimatePresence>

            {/* Absorbed effects: object shrinking + moving */}
            <AnimatePresence>
              {absorbedEffects.map(effect => {
                const fromKey = `${effect.from.x},${effect.from.y}`;
                const toKey = `${effect.to.x},${effect.to.y}`;
                const fromRect = cellRects?.[fromKey];
                const toRect = cellRects?.[toKey];
                if (!fromRect || !toRect) return null;

                return (
                  <AbsorbedEffect
                    key={effect.id}
                    id={effect.id}
                    absorbedType={effect.absorbedType}
                    fromRect={fromRect}
                    toRect={toRect}
                    onDone={id => {
                      useGameStore.getState().removeAbsorbedEffect(id);
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </ItemsLayer>

          {/* HUD counters above BHs */}
          <HUDBlackHoleCounter />

          {/* Floating scores */}
          <FloatingLayer>
            <AnimatePresence>
              {floatingScores.map(fs => (
                <FloatingScore
                  key={fs.id}
                  x={fs.x}
                  y={fs.y}
                  points={fs.points}
                  onDone={() => removeFloatingScore(fs.id)}
                />
              ))}
            </AnimatePresence>
          </FloatingLayer>
        </BoardContainer>
      </motion.div>
    </BoardWrapper>
  );
}
