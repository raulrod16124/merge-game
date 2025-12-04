import {useEffect, useState} from 'react';
import AppLayout from '@/ui/layout';
import {useFriendsStore} from '@/state/friends-store';
import {Button} from '@/common/Button';
import {
  ActionRow,
  CosmicDivider,
  FriendCard,
  FriendName,
  List,
  Section,
  SectionTitle,
} from './styles';
import AddFriendModal from '@/ui/components/modals/AddFriendModal';
import {useUserStore} from '@/state';

export default function FriendsScreen() {
  const {
    friends,
    incoming,
    outgoing,
    loadFriends,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
  } = useFriendsStore();
  const {uid} = useUserStore();

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <AppLayout title="Amigos" showBack={true} prevRoute="/home">
      <Section>
        {/* Botón principal */}
        <Button
          variant="secondary"
          onClick={() => setShowAddModal(true)}
          fullWidth={true}
          styles={{
            marginTop: 6,
            marginBottom: 18,
            boxShadow: '0 0 12px rgba(120, 200, 255, 0.5)',
          }}>
          + Agregar Amigo
        </Button>

        {/* --- SECCIÓN: AMIGOS --- */}
        <SectionTitle>Mis Amigos</SectionTitle>
        <CosmicDivider />

        <List>
          {friends.length === 0 && (
            <div style={{opacity: 0.6}}>No tienes amigos aún</div>
          )}

          {friends.map(friend => (
            <FriendCard key={friend.uid}>
              <div>
                <FriendName>{friend.name}</FriendName>
                <div style={{opacity: 0.7, fontSize: '12px'}}>
                  {friend.uniqueName} — Nivel Cósmico {friend.cosmicLevel}
                </div>
              </div>
              <Button variant="fail" onClick={() => removeFriend(friend.uid)}>
                Eliminar
              </Button>
            </FriendCard>
          ))}
        </List>

        {/* --- SECCIÓN: SOLICITUDES RECIBIDAS --- */}
        <SectionTitle>Solicitudes Recibidas</SectionTitle>
        <CosmicDivider />

        <List>
          {incoming.length === 0 && (
            <div style={{opacity: 0.6}}>No hay solicitudes</div>
          )}

          {incoming.map(friend => (
            <FriendCard key={friend.uid}>
              <FriendName>{friend.name}</FriendName>
              <ActionRow>
                <Button
                  variant="primary"
                  onClick={() => acceptRequest(friend.uid)}>
                  Aceptar
                </Button>
                <Button
                  variant="fail"
                  onClick={() => rejectRequest(friend.uid)}>
                  Rechazar
                </Button>
              </ActionRow>
            </FriendCard>
          ))}
        </List>

        {/* --- SECCIÓN: SOLICITUDES ENVIADAS --- */}
        <SectionTitle>Solicitudes Enviadas</SectionTitle>
        <CosmicDivider />

        <List>
          {outgoing.length === 0 && (
            <div style={{opacity: 0.6}}>No hay solicitudes enviadas</div>
          )}

          {outgoing.map(friend => (
            <FriendCard key={friend.uid}>
              <FriendName>{friend.name}</FriendName>
              <Button variant="fail" onClick={() => cancelRequest(friend.uid)}>
                Cancelar
              </Button>
            </FriendCard>
          ))}
        </List>

        {/* --- MODAL AGREGAR AMIGO --- */}
        {uid !== null && (
          <AddFriendModal
            userUid={uid}
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </Section>
    </AppLayout>
  );
}
