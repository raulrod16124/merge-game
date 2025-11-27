import {useMemo, useState} from 'react';
import AppLayout from '@/ui/layout';
import {useUserStore} from '@/state/user-store';
import {usePlayerStore} from '@/state/player-store';
import {STORE_ITEMS, type StoreItem} from '@/data/store/store-items';

import {Modal} from '@/common/Modal';
import {Coins, Lock, Minus, Plus} from 'lucide-react';

import {
  Container,
  CoinsDisplay,
  Grid,
  Card,
  IconWrap,
  Info,
  Title,
  Desc,
  Price,
  LockedOverlay,
  QtyControls,
  QtyButton,
} from './styles';

export default function Store() {
  const coins = useUserStore(s => s.coins);
  const addCoins = useUserStore(s => s.addCoins);
  const addInventoryItem = useUserStore(s => s.addInventoryItem);
  const inventory = useUserStore(s => s.inventory);

  const isPowerupUnlocked = usePlayerStore(s => s.isPowerupUnlocked);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const openModal = (item: StoreItem) => {
    if (item.type === 'powerup' && !isPowerupUnlocked(item.id)) {
      return; // → bloqueado: no hacer nada
    }
    setError(null);
    setQty(1);
    setSelected(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setQty(1);
    setError(null);
  };

  const totalPrice = useMemo(() => {
    return selected ? selected.price * qty : 0;
  }, [selected, qty]);

  const increment = () => setQty(q => Math.min(99, q + 1));
  const decrement = () => setQty(q => Math.max(1, q - 1));

  const buy = () => {
    if (!selected) return;

    if (selected.type === 'powerup' && !isPowerupUnlocked(selected.id)) {
      setError('Este powerup no está desbloqueado todavía.');
      return;
    }

    if (coins < totalPrice) {
      setError('No tienes suficientes monedas.');
      return;
    }

    addCoins(-totalPrice);
    addInventoryItem(selected.id, qty);
    closeModal();
  };

  return (
    <AppLayout title="Tienda" showBack={true} prevRoute="/home">
      <Container>
        <CoinsDisplay>
          <Coins size={20} strokeWidth={2.4} /> {coins}
        </CoinsDisplay>

        <Grid>
          {STORE_ITEMS.map(item => {
            const Icon = item.icon;
            const locked =
              item.type === 'powerup' && !isPowerupUnlocked(item.id);

            return (
              <Card
                key={item.id}
                $locked={locked}
                onClick={() => !locked && openModal(item)}>
                <IconWrap $locked={locked}>
                  <Icon size={34} strokeWidth={2.6} />
                </IconWrap>

                <Info>
                  <Title>{item.name}</Title>
                  <Desc>{item.description}</Desc>

                  <div
                    style={{marginTop: 6, fontSize: '0.75rem', opacity: 0.7}}>
                    Tienes: <b>{inventory[item.id] ?? 0}</b>
                  </div>
                </Info>

                <Price>
                  {item.price} <Coins size={16} strokeWidth={2.4} />
                </Price>

                {locked && (
                  <LockedOverlay>
                    <Lock size={28} strokeWidth={3} />
                  </LockedOverlay>
                )}
              </Card>
            );
          })}
        </Grid>
      </Container>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={selected?.name ?? 'Comprar'}
        message={
          selected ? (
            <div>
              <div style={{marginBottom: 6, fontSize: '0.85rem', opacity: 0.8}}>
                Stock actual: <b>{inventory[selected.id] ?? 0}</b>
              </div>
              <div style={{marginBottom: 10}}>{selected.description}</div>

              <QtyControls>
                <QtyButton onClick={decrement}>
                  <Minus size={16} />
                </QtyButton>

                <div style={{minWidth: 50, textAlign: 'center'}}>{qty}</div>

                <QtyButton onClick={increment}>
                  <Plus size={16} />
                </QtyButton>
              </QtyControls>

              <div style={{marginTop: 12, fontWeight: 600}}>
                Total: {totalPrice}{' '}
                <Coins size={14} style={{verticalAlign: -2}} />
              </div>

              {error && (
                <div
                  style={{
                    marginTop: 10,
                    color: '#ffb6b6',
                    fontSize: '0.9rem',
                  }}>
                  {error}
                </div>
              )}
            </div>
          ) : null
        }
        buttons={[
          {
            label: 'Cancelar',
            variant: 'tertiary',
            onClick: closeModal,
          },
          {
            label: 'Comprar',
            variant: 'primary',
            onClick: buy,
          },
        ]}
      />
    </AppLayout>
  );
}
