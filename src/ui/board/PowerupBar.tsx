// src/ui/board/PowerupBar.tsx
import styled from 'styled-components';
import {useUserStore} from '@/state/user-store';
import {useGameStore} from '@/state/game-store';
import {COLORS} from '@/ui/constants';
import {STORE_ITEMS} from '@/data/store/store-items';
import {Store, X} from 'lucide-react';
import {usePlayerStore} from '@/state/player-store';

const Wrapper = styled.div`
  height: calc(15dvh - 24px);
  max-height: calc(15dvh - 24px);
  padding: 12px 6px;
  display: flex;
  justify-content: center;
  gap: 12px;
  background: rgba(13, 16, 32, 0.95);
  backdrop-filter: blur(6px);
`;

const PwrBtn = styled.button<{disabled?: boolean}>`
  background: ${({disabled}) =>
    disabled ? 'rgba(255,255,255,0.03)' : COLORS.tertiaryDark};
  border: none;
  padding: 1dvh 5px 0 5px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  cursor: ${({disabled}) => (disabled ? 'default' : 'pointer')};
  min-width: 84px;
  transition: 0.12s;
  opacity: ${({disabled}) => (disabled ? 0.45 : 1)};

  &:hover {
    background: ${({disabled}) => (disabled ? undefined : COLORS.tertiary)};
  }

  .label {
    margin-top: 6px;
    font-size: 0.85rem;
    font-weight: 700;
    color: ${COLORS.white};
  }

  .qty {
    margin-top: 4px;
    font-size: 0.75rem;
    color: ${COLORS.white};
    opacity: 0.8;
  }
`;

function pickPowerupsFromStore() {
  return STORE_ITEMS.filter(i => {
    if (!i || !i.id) return false;
    if (i.type === 'powerup') return true;
    return false;
  });
}

export function PowerupBar() {
  const inventory = useUserStore(s => s.inventory);
  const consumeItem = useUserStore(s => s.consumeItem);
  const activatePowerup = useGameStore(s => s.activatePowerup);

  // get unlocked powerups
  const unlockedPowerups = usePlayerStore(s => s.unlockedPowerups);
  const powerups = pickPowerupsFromStore().filter(p =>
    unlockedPowerups.includes(p.id as any),
  );

  if (!powerups || powerups.length === 0) {
    // fallback: show nothing to avoid confusing empty UI
    return null;
  }

  return (
    <Wrapper>
      {powerups.map(item => {
        const Icon = item.icon ?? Store;
        const qty = inventory[item.id] || 0;
        const disabled = qty <= 0;

        const handleClick = () => {
          if (disabled) return;
          // consume and activate
          const ok = consumeItem(item.id, 1);
          if (!ok) {
            // nothing
            return;
          }
          try {
            activatePowerup(item.id);
          } catch (e) {
            console.warn('activatePowerup failed', e);
          }
        };

        return (
          <PwrBtn key={item.id} onClick={handleClick} disabled={disabled}>
            <Icon size={22} strokeWidth={2.2} />
            <div className="label" style={{fontSize: '0.8rem'}}>
              {item.name ?? item.id}
            </div>
            <div className="qty">
              <X size={12} />
              {qty}
            </div>
          </PwrBtn>
        );
      })}
    </Wrapper>
  );
}
