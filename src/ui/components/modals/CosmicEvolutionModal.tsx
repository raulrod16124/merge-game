import {motion} from 'framer-motion';
import styled from 'styled-components';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {usePlayerStore} from '@/state/player-store';
import {Button} from '@/common/Button';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Box = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  width: 320px;
  color: white;
  backdrop-filter: blur(10px);
`;

const AvatarContent = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px auto;
`;

export function CosmicEvolutionModal() {
  const level = usePlayerStore(s => s.lastEvolutionLevel);
  const clear = () => usePlayerStore.setState({lastEvolutionLevel: null});

  if (!level) return null;

  return (
    <Backdrop>
      <motion.div
        initial={{scale: 0.5, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.5}}>
        <Box>
          <h2>¡Tu Ser Cósmico ha evolucionado!</h2>
          <p>Nivel {level}</p>

          <AvatarContent>
            <CosmicAvatar />
          </AvatarContent>

          <Button variant="primary" onClick={clear}>
            Continuar
          </Button>
        </Box>
      </motion.div>
    </Backdrop>
  );
}
