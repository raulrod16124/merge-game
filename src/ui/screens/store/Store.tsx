// src/ui/screens/store/index.tsx

import {useState} from 'react';
import AppLayout from '@/ui/layout';

import {useUserStore} from '@/state/user-store';
import {usePlayerStore} from '@/state/player-store';

import {
  Container,
  SectionTitle,
  Grid,
  Card,
  CardIcon,
  CardInfo,
  CardFooter,
  LockedOverlay,
  QuantitySelector,
} from './styles';

import {STORE_ITEMS} from '@/data/store/store-items';
import {Button} from '@/common/Button';
import {Coins, Lock} from 'lucide-react';
import {Modal} from '@/common/Modal';
import type {PowerupType} from '@/core/types';
import {COLORS} from '@/ui/constants';
import {formatCoins} from '@/utils/formatCoins';

export default function Store() {
  const coins = useUserStore(s => s.coins);
  const inventory = useUserStore(s => s.inventory);
  const unlockedPowerups = usePlayerStore(s => s.unlockedPowerups);

  const addCoins = useUserStore(s => s.addCoins);
  const addInventoryItem = useUserStore(s => s.addInventoryItem);

  const [modal, setModal] = useState({
    open: false,
    item: null as any,
    qty: 1,
  });

  const openModal = (item: any) => setModal({open: true, item, qty: 1});

  const closeModal = () => setModal({open: false, item: null, qty: 1});

  const buyItems = () => {
    if (!modal.item) return;

    const total = modal.item.price * modal.qty;

    if (coins < total) {
      alert('No tienes suficientes monedas');
      return;
    }

    addCoins(-total);
    addInventoryItem(modal.item.id, modal.qty);
    closeModal();
  };

  const isUnlocked = (id: string) =>
    unlockedPowerups.includes(id as PowerupType);

  return (
    <AppLayout title="Tienda Cósmica" prevRoute="/home" showBack={true}>
      <Container>
        {/* MONEDAS */}
        <div style={{display: 'flex', justifyContent: 'center', padding: 12}}>
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              padding: '8px 14px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: '1.6rem',
              color: COLORS.primary,
            }}>
            <Coins size={20} /> {formatCoins(coins)}
          </div>
        </div>

        {/* POWERUPS */}
        <SectionTitle>Powerups</SectionTitle>

        <Grid>
          {STORE_ITEMS.map(item => {
            const locked = !isUnlocked(item.id);
            const qty = inventory[item.id] ?? 0;

            return (
              <Card key={item.id} $locked={locked}>
                {/* ICON */}
                <CardIcon>
                  <img src={`/powerups/${item.id}.png`} alt={item.name} />
                </CardIcon>

                {/* INFO */}
                <CardInfo>
                  <h4>{item.name}</h4>

                  <div className="stock">
                    Stock: <b>{qty}</b>
                  </div>
                </CardInfo>

                {locked && (
                  <LockedOverlay>
                    <Lock size={28} />
                  </LockedOverlay>
                )}

                {/* FOOTER */}
                <CardFooter>
                  <div
                    className="price"
                    style={{color: COLORS.primary, fontWeight: 700}}>
                    <Coins size={20} /> {item.price}
                  </div>

                  <Button
                    variant="secondary"
                    disabled={locked}
                    onClick={() => !locked && openModal(item)}
                    styles={{
                      fontSize: '0.8rem',
                      borderRadius: '10px',
                      padding: '10px',
                    }}>
                    Comprar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </Grid>
      </Container>

      {/* MODAL */}
      <Modal
        open={modal.open}
        title={modal.item?.name}
        onClose={closeModal}
        message={
          modal.item ? (
            <>
              <p>{modal.item.description}</p>

              <p>
                Stock actual: <b>{inventory[modal.item.id] ?? 0}</b>
              </p>

              <QuantitySelector>
                <button
                  onClick={() =>
                    setModal(m => ({...m, qty: Math.max(1, m.qty - 1)}))
                  }>
                  -
                </button>

                <span>{modal.qty}</span>

                <button onClick={() => setModal(m => ({...m, qty: m.qty + 1}))}>
                  +
                </button>
              </QuantitySelector>

              <p
                style={{fontWeight: 600, marginTop: 14, color: COLORS.primary}}>
                Precio total: {modal.item.price * modal.qty} <Coins size={20} />
              </p>
            </>
          ) : null
        }
        buttons={[
          {label: 'Cancelar', variant: 'tertiary', onClick: closeModal},
          {label: 'Comprar', variant: 'primary', onClick: buyItems},
        ]}
      />
    </AppLayout>
  );
}
