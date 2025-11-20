// src/ui/screens/store/index.tsx

import {useState} from 'react';
import AppLayout from '@/ui/layout';
import {useUserStore} from '@/state/user-store';

import {
  Container,
  CoinsDisplay,
  ItemsList,
  ItemCard,
  ItemTitle,
  ItemDesc,
  PriceTag,
} from './styles';

import {STORE_ITEMS, type StoreItem} from '@/data/store/store-items';
import {Button} from '@/common/Button';
import {Modal} from '@/common/Modal';
import {Coins} from 'lucide-react';

export default function Store() {
  const {coins, addCoins, addInventoryItem} = useUserStore();
  const [modal, setModal] = useState<{open: boolean; item?: StoreItem | null}>({
    open: false,
  });
  const [itemTitle, setItemTitle] = useState<string>('');

  const openModal = (item: StoreItem) => {
    setModal({open: true, item});
    setItemTitle(`${item.name}`);
  };

  const closeModal = () => {
    setModal({open: false, item: null});
  };

  const buyItem = () => {
    if (!modal.item) return;

    const item = modal.item;

    // Verificar si hay monedas
    if (coins < item.price) {
      alert('No tienes suficientes monedas');
      return;
    }

    addCoins(-item.price);
    addInventoryItem(item.id);

    closeModal();
  };

  return (
    <AppLayout title="Store" showBack={true} prevRoute="/home">
      <Container>
        <CoinsDisplay>
          <Coins size={22} strokeWidth={2.4} /> {coins}
        </CoinsDisplay>

        <ItemsList>
          {STORE_ITEMS.map(item => (
            <ItemCard key={item.id}>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemDesc>{item.description}</ItemDesc>

              <PriceTag>
                {item.price} <Coins size={22} strokeWidth={2.4} />
              </PriceTag>

              <Button
                variant="secondary"
                fullWidth
                onClick={() => openModal(item)}>
                Comprar
              </Button>
            </ItemCard>
          ))}
        </ItemsList>
      </Container>

      {/* Modal de compra */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={itemTitle || 'Confirmar Compra'}
        message={
          modal.item ? (
            <div>
              ¿Comprar <b>{modal.item.name}</b> por <b>{modal.item.price}</b>{' '}
              monedas?
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
            onClick: buyItem,
          },
        ]}
      />
    </AppLayout>
  );
}
