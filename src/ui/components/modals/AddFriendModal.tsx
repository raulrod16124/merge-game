// ------------------------------------------
// NUEVO MODAL DE BÚSQUEDA DE AMIGOS
// ------------------------------------------
import {useState} from 'react';
import {Input} from '@/common/Input';
import {Button} from '@/common/Button';
import {Modal} from '@/common/Modal';
import {searchProfilesByName} from '@/core/friendsSearchService';
import styled from 'styled-components';
import {useFriendsStore} from '@/state/friends-store';
import {Plus} from 'lucide-react';

const ResultList = styled.div`
  margin-top: 12px;
  max-height: 260px;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  background: #1f2330;
  padding: 10px 16px;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export default function AddFriendModal({
  userUid,
  open,
  onClose,
}: {
  userUid: string;
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const sendFriendRequest = useFriendsStore(s => s.sendFriendRequest);

  async function handleSearch(text: string) {
    setQuery(text);

    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    const found = await searchProfilesByName(text.trim());
    setResults(found.filter(u => u.uid !== userUid));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Buscar jugador"
      message={
        <>
          <Input
            label="Escribe un nombre o uniqueName"
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />

          <ResultList>
            {results.map(profile => (
              <ResultItem key={profile.uid}>
                <div>
                  <strong>{profile.name}</strong>
                  <div style={{opacity: 0.6, fontSize: '12px'}}>
                    {profile.uniqueName}
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => {
                    sendFriendRequest(profile.uid);
                    onClose();
                  }}
                  styles={{padding: '0.5rem', borderRadius: '12px'}}>
                  <Plus size={25} />
                </Button>
              </ResultItem>
            ))}

            {query.length >= 2 && results.length === 0 && (
              <div style={{marginTop: '12px', opacity: 0.6}}>
                No se encontraron jugadores
              </div>
            )}
          </ResultList>
        </>
      }
      buttons={[]}
    />
  );
}
