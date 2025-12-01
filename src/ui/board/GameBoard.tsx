// src/ui/board/GameBoard.tsx
import {motion, AnimatePresence} from 'framer-motion';
import {useGameStore} from '../../state/game-store';

import {Tile} from './Tile';
import {FloatingScore} from './animations/FloatingScore';
import {BlackHoleVisual} from './animations/BlackHoleVisual';
import {HUDBlackHoleCounter} from './animations/HUDBlackHoleCounter';
import {AbsorbedEffect} from './animations/AbsorbedEffect';

import {
  BoardWrapper,
  BoardContainer,
  Grid,
  FloatingLayer,
  ItemsLayer,
} from './GameBoard.styled';
import {COSMIC_ICONS} from '../constants';
import {DestroyAnimation} from './animations/DestroyAnimation';
import React from 'react';
import {HUDFreezeCounter} from './animations/HUDFreezeCounter';
import {FreezeOverlay} from './animations/FreezeOverlay';

/**
 * Parche de performance mínimo:
 * - Evita setCellRect en cada render usando requestAnimationFrame por celda
 * - Reduce búsquedas repetidas creando un map de items por posición
 * - Mantiene la lógica existente e interfaz visual sin cambios
 */

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

  const boardRef = React.useRef<HTMLDivElement | null>(null);
  const boardRect = boardRef.current?.getBoundingClientRect();

  const destroyAnimations = useGameStore(s => s.destroyAnimations);

  const cols = boardSize?.cols ?? 6;
  const rows = boardSize?.rows ?? 6;

  const onClickEmpty = (pos: {x: number; y: number}) => {
    addItem(pos);
  };

  // raf handles per cell to avoid stacking many RAFs
  const rafsRef = React.useRef<Record<string, number | null>>({});

  // cleanup RAFs on unmount
  React.useEffect(() => {
    return () => {
      const rafs = rafsRef.current;
      for (const k in rafs) {
        const id = rafs[k];
        if (typeof id === 'number') cancelAnimationFrame(id);
      }
      rafsRef.current = {};
    };
  }, []);

  // Build a quick lookup map for items to avoid find() per cell
  const itemsMap = React.useMemo(() => {
    const m = new Map<string, (typeof items)[0]>();
    for (const it of items) {
      m.set(`${it.pos.x},${it.pos.y}`, it);
    }
    return m;
  }, [items]);

  return (
    <BoardWrapper ref={boardRef}>
      <motion.div
        initial={{opacity: 0, y: -8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.28}}
        style={{width: '100%', height: '100%'}}>
        <BoardContainer>
          <Grid $cols={cols} $rows={rows}>
            {Array.from({length: cols * rows}).map((_, index) => {
              const x = index % cols;
              const y = Math.floor(index / cols);
              const key = `${x},${y}`;
              const item = itemsMap.get(key) ?? null;

              return (
                <div
                  key={`${x}-${y}`}
                  ref={el => {
                    if (!el) return;

                    // cancel any pending RAF for this cell
                    const prevRaf = rafsRef.current[key];
                    if (typeof prevRaf === 'number') {
                      cancelAnimationFrame(prevRaf);
                      rafsRef.current[key] = null;
                    }

                    // schedule a single RAF to compute rect and update store if changed
                    rafsRef.current[key] = requestAnimationFrame(() => {
                      try {
                        const rect = el.getBoundingClientRect();
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
                      } catch (e) {
                        // defensivo: si algo falla, no romper render
                        // eslint-disable-next-line no-console
                        console.warn('setCellRect failed', e);
                      } finally {
                        rafsRef.current[key] = null;
                      }
                    });
                  }}
                  style={{width: '100%', height: '100%'}}>
                  <Tile
                    x={x}
                    y={y}
                    item={item ?? undefined}
                    onClickEmpty={onClickEmpty}
                  />
                </div>
              );
            })}
          </Grid>

          {destroyAnimations.map(a => (
            <DestroyAnimation
              key={a.id}
              x={a.x}
              y={a.y}
              icon={a.icon}
              boardRect={boardRect}
            />
          ))}

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
                  // ⛔ 1) NO mostrar animación si está congelado
                  if (item.freezeTurns && item.freezeTurns > 0) {
                    // mostrar BH estático pero NO animación visual
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
                        initial={{scale: 1, opacity: 1}}
                        animate={{scale: 1, opacity: 1, left, top}}
                        transition={{duration: 0}}
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

                  // 2) si el BH está animándose, NO renderizar el estático
                  if (isBHAnimating) return null;

                  // 3) si NO está congelado ni animándose → render normal
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

            {/* Freeze overlays */}
            <AnimatePresence>
              {items
                .filter(
                  i =>
                    i.type === 'black_hole' &&
                    i.freezeTurns &&
                    i.freezeTurns > 0,
                )
                .map(bh => {
                  const key = `${bh.pos.x},${bh.pos.y}`;
                  const rect = cellRects[key];
                  if (!rect) return null;

                  const left = Math.round(rect.centerX - rect.size / 2);
                  const top = Math.round(rect.centerY - rect.size / 2);

                  return (
                    <FreezeOverlay
                      key={`freeze_ov_${bh.id}`}
                      size={rect.size}
                      left={left}
                      top={top}
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
          {/* Freeze HUD */}
          <HUDFreezeCounter />

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
