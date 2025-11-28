// src/ui/screens/inventory/index.tsx

import {useUserStore} from '@/state/user-store';
import {STORE_ITEMS} from '@/data/store/store-items';

import AppLayout from '@/ui/layout';

import {
  Container,
  Subtitle,
  Grid,
  ItemBox,
  Badge,
  EmptyMessage,
} from './styles';

import {Store} from 'lucide-react';

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
          <EmptyMessage>
            Todavía no tienes objetos.
            <br />
            Consíguelos en la Store <Store size={16} strokeWidth={2.4} />
          </EmptyMessage>
        ) : (
          <Grid>
            {itemsOwned.map(item => {
              const Icon = item.icon;

              return (
                <ItemBox key={item.id}>
                  <Icon size={32} strokeWidth={2.4} />
                  <Badge>{inventory[item.id]}</Badge>
                </ItemBox>
              );
            })}
          </Grid>
        )}
      </Container>
    </AppLayout>
  );
}
