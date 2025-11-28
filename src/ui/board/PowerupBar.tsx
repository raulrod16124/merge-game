// src/ui/board/PowerupBar.tsx
import styled from 'styled-components';
import {useUserStore} from '@/state/user-store';
import {useGameStore} from '@/state/game-store';
import {COLORS} from '@/ui/constants';
import {STORE_ITEMS} from '@/data/store/store-items';
import {X} from 'lucide-react';
import {usePlayerStore} from '@/state/player-store';

const Wrapper = styled.div`
  height: calc(15dvh - 24px);
  padding: 0.5dvh 8px;
  display: flex;
  justify-content: center;
  gap: 18px;

  background: rgba(13, 16, 32, 0.95);
  backdrop-filter: blur(6px);

  /* Centrado seguro */
  width: 100%;
  box-sizing: border-box;
`;

const PowerupImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

const PwrBtn = styled.button<{disabled?: boolean}>`
  background: ${({disabled}) =>
    disabled ? 'rgba(255,255,255,0.03)' : COLORS.tertiaryDark};
  border: 1px solid ${COLORS.primaryDark};

  padding: 8px 8px 8px 8px;
  border-radius: 14px;
  min-width: 90px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  cursor: ${({disabled}) => (disabled ? 'default' : 'pointer')};
  opacity: ${({disabled}) => (disabled ? 0.45 : 1)};

  transition: 0.16s ease;

  &:hover {
    background: ${({disabled}) => (disabled ? undefined : COLORS.tertiary)};
    transform: ${({disabled}) => (disabled ? 'none' : 'translateY(-2px)')};
  }

  .label {
    margin-top: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    color: ${COLORS.white};
    text-align: center;
  }

  .qty {
    margin-top: 4px;
    font-size: 0.75rem;
    color: ${COLORS.white};
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

const QtyBubble = styled.div`
  position: absolute;
  top: -2dvh;
  right: -40px;

  background: ${COLORS.primary};
  color: #000;
  font-size: 1.2rem;

  padding: 3px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 24px;
  text-align: center;
`;

const IconWrap = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
`;

function pickPowerupsFromStore() {
  return STORE_ITEMS.filter(i => i?.type === 'powerup');
}

export function PowerupBar() {
  const inventory = useUserStore(s => s.inventory);
  const consumeItem = useUserStore(s => s.consumeItem);
  const activatePowerup = useGameStore(s => s.activatePowerup);

  const unlockedPowerups = usePlayerStore(s => s.unlockedPowerups);

  const powerups = pickPowerupsFromStore().filter(p => {
    const unlocked = unlockedPowerups.includes(p.id);
    const qty = inventory[p.id] || 0;
    return unlocked && qty > 0;
  });

  if (!powerups || powerups.length === 0) return null;

  return (
    <Wrapper>
      {powerups.map(item => {
        const qty = inventory[item.id] || 0;
        const disabled = qty <= 0;

        const handleClick = () => {
          if (disabled) return;

          const ok = consumeItem(item.id, 1);
          if (!ok) return;

          try {
            activatePowerup(item.id);
          } catch (e) {
            console.warn('activatePowerup failed', e);
          }
        };

        return (
          <PwrBtn key={item.id} disabled={disabled} onClick={handleClick}>
            <IconWrap>
              <PowerupImg src={`/powerups/${item.id}.png`} alt={item.id} />
              {qty > 0 && <QtyBubble>{qty}</QtyBubble>}
            </IconWrap>

            <div className="label">{item.name ?? item.id}</div>
          </PwrBtn>
        );
      })}
    </Wrapper>
  );
}
