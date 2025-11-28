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

export default function Store() {
  const coins = useUserStore(s => s.coins);
  const inventory = useUserStore(s => s.inventory);
  const unlockedPowerups = usePlayerStore(s => s.unlockedPowerups);

  const addCoins = useUserStore(s => s.addCoins);
  const addInventoryItem = useUserStore(s => s.addInventoryItem);

  const [modal, setModal] = useState<{
    open: boolean;
    item: any | null;
    qty: number;
  }>({open: false, item: null, qty: 1});

  const openModal = (item: any) => {
    setModal({open: true, item, qty: 1});
  };

  const closeModal = () =>
    setModal({
      open: false,
      item: null,
      qty: 1,
    });

  const buyItems = () => {
    if (!modal.item) return;

    const totalPrice = modal.item.price * modal.qty;

    if (coins < totalPrice) {
      alert('No tienes suficientes monedas');
      return;
    }

    addCoins(-totalPrice);
    addInventoryItem(modal.item.id, modal.qty);

    closeModal();
  };

  const isUnlocked = (itemId: string) =>
    unlockedPowerups.includes(itemId as PowerupType);

  return (
    <AppLayout
      title="Tienda Cósmica"
      showBack={true}
      prevRoute="/home"
      secondaryBg={true}>
      <Container>
        {/* Monedas */}
        <div style={{display: 'flex', justifyContent: 'center', padding: 12}}>
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 12px',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: '1.5rem',
              color: COLORS.primary,
            }}>
            <Coins size={20} /> {coins}
          </div>
        </div>

        {/* SECCION POWERUPS */}
        <SectionTitle>Powerups</SectionTitle>

        <Grid>
          {STORE_ITEMS.map(item => {
            const locked = !isUnlocked(item.id);

            return (
              <Card key={item.id} $locked={locked}>
                <CardIcon>
                  <item.icon size={34} />
                </CardIcon>

                <CardInfo>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>

                  <div className="stock">
                    Stock: <b>{inventory[item.id] ?? 0}</b>
                  </div>
                </CardInfo>

                {locked && (
                  <LockedOverlay>
                    <Lock size={26} />
                  </LockedOverlay>
                )}

                <CardFooter>
                  <div className="price" style={{color: COLORS.primary}}>
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

      {/* MODAL DE COMPRA */}
      <Modal
        open={modal.open}
        title={modal.item ? modal.item.name : 'Comprar'}
        onClose={closeModal}
        message={
          modal.item ? (
            <>
              <p>{modal.item.description}</p>
              <br />
              <p>
                Stock actual: <b>{inventory[modal.item.id] ?? 0}</b>
              </p>
              <br />

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

              <br />
              <p style={{fontWeight: 600}}>
                Precio total: {modal.item.price * modal.qty} <Coins size={20} />
              </p>
            </>
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
            onClick: buyItems,
          },
        ]}
      />
    </AppLayout>
  );
}
