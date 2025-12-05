// src/ui/board/PowerupBar.tsx

import styled from 'styled-components';
import {useUserStore} from '@/state/user-store';
import {useGameStore} from '@/state/game-store';
import {COLORS} from '@/ui/constants';
import {STORE_ITEMS} from '@/data/store/store-items';
import {usePlayerStore} from '@/state/player-store';

const Wrapper = styled.div`
  height: calc(15dvh - 5px);
  padding: 8px;
  display: flex;
  justify-content: center;
  gap: 2%;

  background: linear-gradient(
    to top,
    rgba(6, 8, 20, 0.95),
    rgba(18, 15, 40, 0.85)
  );
  backdrop-filter: blur(8px);
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const PwrBtn = styled.button<{disabled?: boolean}>`
  position: relative;

  background: ${({disabled}) =>
    disabled
      ? 'rgba(255,255,255,0.04)'
      : 'linear-gradient(145deg, #1a1a23, #272732)'};

  border: 2px solid
    ${({disabled}) =>
      disabled ? 'rgba(255,255,255,0.07)' : COLORS.secondaryDark};

  box-shadow: ${({disabled}) =>
    disabled
      ? 'none'
      : `0 0 10px ${COLORS.secondaryDark}55, 0 0 18px ${COLORS.secondary}33`};

  padding: 8px;
  border-radius: 12px;

  width: 25%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  cursor: ${({disabled}) => (disabled ? 'default' : 'pointer')};
  opacity: ${({disabled}) => (disabled ? 0.45 : 1)};

  transition: 0.18s ease;

  &:hover {
    transform: ${({disabled}) => (disabled ? 'none' : 'translateY(-4px)')};
    box-shadow: ${({disabled}) =>
      disabled
        ? 'none'
        : `0 0 14px ${COLORS.secondary}, 0 0 26px ${COLORS.secondaryDark}`};
  }
`;

const PowerupImg = styled.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

const QtyBubble = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;

  width: 10px;
  height: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${COLORS.primary};
  color: #000;
  font-size: 1rem;

  padding: 6px;
  border-radius: 50%;
  font-weight: 700;

  box-shadow: 0 0 8px ${COLORS.primary};
`;

const Label = styled.div`
  margin-top: 2px;
  font-size: 0.8rem;
  text-align: center;
  color: ${COLORS.white};
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.22);
`;

function pickPowerupsFromStore() {
  return STORE_ITEMS.filter(i => i?.type === 'powerup');
}

export function PowerupBar() {
  const inventory = useUserStore(s => s.inventory);
  const consumeItem = useUserStore(s => s.consumeItem);
  const activatePowerup = useGameStore(s => s.activatePowerup);

  const unlocked = usePlayerStore(s => s.unlockedPowerups);

  const powerups = pickPowerupsFromStore().filter(p => unlocked.includes(p.id));

  if (!powerups.length) return null;

  return (
    <Wrapper>
      {powerups.map(item => {
        const qty = inventory[item.id] || 0;
        const disabled = qty <= 0;

        const handleClick = () => {
          if (disabled) return;
          if (!consumeItem(item.id, 1)) return;
          activatePowerup(item.id);
        };

        return (
          <PwrBtn key={item.id} disabled={disabled} onClick={handleClick}>
            <PowerupImg src={`/powerups/${item.id}.png`} alt={item.id} />
            {qty > 0 && <QtyBubble>{qty}</QtyBubble>}

            <Label>{item.name ?? item.id}</Label>
          </PwrBtn>
        );
      })}
    </Wrapper>
  );
}
