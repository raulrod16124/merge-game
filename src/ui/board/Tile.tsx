// src/ui/board/Tile.tsx
import React from 'react';
import {motion} from 'framer-motion';
import type {ItemBase} from '../../core/types';
import {COSMIC_ICONS} from '../constants';
import {TileBase, TilePlaceholder} from './Tile.styled';
import {useGameStore} from '@/state/game-store';
import {Plus} from 'lucide-react';

/**
 * Tile component — muestra el item si existe, o un placeholder.
 *
 * Cambios principales:
 * - Sólo animamos la "entrada" si el item fue creado recientemente (item.createdAt).
 * - Si el item es un black_hole y existe un plan visual para ese BH, ocultamos
 *   el render estático para evitar la copia/ghost en celda de origen durante
 *   la animación (el visual animado está en una capa superior: BlackHoleVisual).
 */

type TileProps = {
  x: number;
  y: number;
  item?: ItemBase;
  onClickEmpty: (pos: {x: number; y: number}) => void;
};

export function Tile({x, y, item, onClickEmpty}: TileProps) {
  const {activePowerup, selectedCell, selectCell} = useGameStore(s => s);
  const handleClick = () => {
    // 1) Si un powerup está activo -> SOLO selectCell
    if (activePowerup) {
      selectCell({x, y});
      return;
    }

    // 2) Si NO hay powerup activo:
    // Si la celda está vacía -> acción normal
    if (!item) {
      onClickEmpty({x, y});
      return;
    }

    // 3) Si hay item y no hay powerup,
    // deja el comportamiento normal del juego (merge/add)
    selectCell({x, y});
  };

  // Access visualEnemyPlans to know si hay un movimiento visual de BH activo
  const visualEnemyPlans = useGameStore(s => s.visualEnemyPlans ?? []);

  const isBHMoving =
    item?.type === 'black_hole' &&
    Boolean(visualEnemyPlans.find(p => p?.bhId === item.id));

  return (
    <TileBase
      onClick={handleClick}
      className="aspect-square"
      style={
        activePowerup === 'move' &&
        selectedCell &&
        selectedCell.x === x &&
        selectedCell.y === y
          ? {
              outline: '3px solid #4ade80', // verde suave
              outlineOffset: '-3px',
              borderRadius: '10px',
              background: 'rgba(74, 222, 128, 0.15)',
            }
          : undefined
      }>
      {item && !isBHMoving ? (
        <motion.img
          key={item.id}
          src={COSMIC_ICONS[item.type as keyof typeof COSMIC_ICONS]}
          alt={item.type}
          draggable={false}
          transition={{duration: 0.22}}
        />
      ) : (
        <TilePlaceholder>
          <Plus size={24} />
        </TilePlaceholder>
      )}
    </TileBase>
  );
}
