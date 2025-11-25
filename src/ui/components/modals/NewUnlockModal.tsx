// src/ui/components/NewUnlockModal.tsx
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {Button} from '@/common/Button';
import type {UnlockItem} from '@/core/types';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.45);
`;

const Card = styled(motion.div)`
  width: min(680px, 92vw);
  background: linear-gradient(
    180deg,
    rgba(20, 20, 30, 1) 0%,
    rgba(14, 14, 22, 1) 100%
  );
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  color: #fff;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
`;

const Items = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 12px 0 18px 0;
`;

const Item = styled.div`
  min-width: 120px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
`;

export default function NewUnlockModal({
  open,
  items,
  onClose,
}: {
  open: boolean;
  items: UnlockItem[];
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <Overlay initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
      <Card initial={{scale: 0.98}} animate={{scale: 1}} exit={{scale: 0.98}}>
        <Title>¡Nuevo contenido desbloqueado!</Title>
        <Items>
          {items.map((it, i) => (
            <Item key={i}>
              <div style={{fontWeight: 700, marginBottom: 8}}>
                {it.name ?? it.id}
              </div>
              <div style={{fontSize: 12, opacity: 0.9}}>
                {it.kind === 'coins' ? `${it.amount} coins` : it.kind}
              </div>
            </Item>
          ))}
        </Items>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button variant="primary" onClick={onClose}>
            Continuar
          </Button>
        </div>
      </Card>
    </Overlay>
  );
}
