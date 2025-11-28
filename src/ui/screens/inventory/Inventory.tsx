// src/ui/screens/inventory/index.tsx

import {useUserStore} from '@/state/user-store';
import {STORE_ITEMS} from '@/data/store/store-items';
import AppLayout from '@/ui/layout';

import {
  Container,
  Subtitle,
  Grid,
  ItemCard,
  IconWrap,
  ItemName,
  ItemDescription,
  QuantityBanner,
  EmptyMessage,
} from './styles';

export default function Inventory() {
  const {inventory} = useUserStore();

  const itemsOwned = STORE_ITEMS.filter(
    item => inventory[item.id] && inventory[item.id] > 0,
  );

  return (
    <AppLayout title="Inventario Cósmico" showBack={true} prevRoute="/home">
      <Container>
        <Subtitle>Objetos que has adquirido</Subtitle>

        {itemsOwned.length === 0 ? (
          <EmptyMessage>No tienes objetos todavía.</EmptyMessage>
        ) : (
          <Grid>
            {itemsOwned.map(item => {
              const qty = inventory[item.id];
              const img = `/powerups/${item.id}.png`;

              return (
                <ItemCard key={item.id}>
                  <IconWrap>
                    <img src={img} alt={item.name} />
                  </IconWrap>

                  <ItemName>{item.name}</ItemName>

                  <ItemDescription>
                    {item.description ?? 'Power cósmico especial.'}
                  </ItemDescription>

                  <QuantityBanner>x{qty}</QuantityBanner>
                </ItemCard>
              );
            })}
          </Grid>
        )}
      </Container>
    </AppLayout>
  );
}
