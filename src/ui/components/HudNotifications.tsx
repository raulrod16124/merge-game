// src/ui/components/HudNotifications.tsx
import styled from 'styled-components';
import {AnimatePresence, motion} from 'framer-motion';
import {useHudStore} from '@/state/hud-store';
import {Sparkles} from 'lucide-react';

const Wrapper = styled.div`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  gap: 8px;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 10px 18px;
  color: white;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
`;

export function HudNotifications() {
  const notifications = useHudStore(s => s.notifications);

  return (
    <Wrapper>
      <AnimatePresence>
        {notifications.map(n => (
          <Card
            key={n.id}
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.28}}>
            <Sparkles size={18} strokeWidth={2.4} />
            {n.title}
          </Card>
        ))}
      </AnimatePresence>
    </Wrapper>
  );
}
