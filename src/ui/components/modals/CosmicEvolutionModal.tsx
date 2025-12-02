import {motion, AnimatePresence} from 'framer-motion';
import styled from 'styled-components';
import {usePlayerStore} from '@/state/player-store';
import {useUserStore} from '@/state/user-store';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {useEffect, useState} from 'react';
import {Button} from '@/common/Button';
import {AvatarVariant} from '../cosmic-avatar/types';

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
  background: rgba(255, 255, 255, 0.07);
  padding: 30px;
  border-radius: 20px;
  width: 320px;
  text-align: center;
  color: white;
  backdrop-filter: blur(12px);
`;

const AvatarWrap = styled.div`
  margin: 20px auto;
  display: flex;
  justify-content: center;
`;

export function CosmicEvolutionModal() {
  const level = usePlayerStore(s => s.lastEvolutionLevel);
  const clearLevelFlag = () =>
    usePlayerStore.setState({lastEvolutionLevel: null});

  const currentVariant = useUserStore(s => s.avatar);

  const [previousVariant, setPreviousVariant] = useState<AvatarVariant | null>(
    null,
  );

  /** Control interno para evitar que se dispare varias veces */
  const [animationStage, setAnimationStage] = useState<
    'before' | 'pulse' | 'after'
  >('before');

  useEffect(() => {
    if (level) {
      // guardar solo 1 vez
      if (!previousVariant) {
        setPreviousVariant(currentVariant ?? AvatarVariant.HYBRID);
      }
      // inicializar animación
      setAnimationStage('before');
      const timer1 = setTimeout(() => setAnimationStage('pulse'), 600);
      const timer2 = setTimeout(() => setAnimationStage('after'), 1200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setPreviousVariant(null);
    }
  }, [level]);

  /** Si no hay nivel → no renderizar */
  if (!level) return null;

  return (
    <Backdrop>
      <AnimatePresence mode="wait">
        <motion.div
          key={animationStage}
          initial={{opacity: 0, scale: 0.6}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5}}>
          <Box>
            <h2>¡Tu Ser Cósmico ha evolucionado!</h2>
            <p>Nivel {level}</p>

            <AvatarWrap>
              {/* ------------ ANIMACIÓN DE EVOLUCIÓN ------------- */}
              {animationStage === 'before' && (
                <motion.div
                  initial={{opacity: 1}}
                  animate={{opacity: 0.2, scale: 0.9}}
                  transition={{duration: 0.6}}>
                  <CosmicAvatar
                    forceVariant={previousVariant ?? AvatarVariant.HYBRID}
                  />
                </motion.div>
              )}

              {animationStage === 'pulse' && (
                <motion.div
                  initial={{scale: 1, opacity: 0.3}}
                  animate={{scale: 1.2, opacity: 0}}
                  transition={{duration: 0.6, ease: 'easeOut'}}
                  style={{position: 'absolute'}}>
                  <CosmicAvatar
                    forceVariant={previousVariant ?? AvatarVariant.HYBRID}
                  />
                </motion.div>
              )}

              {animationStage === 'after' && (
                <motion.div
                  initial={{opacity: 0, scale: 0.7}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.5}}>
                  <CosmicAvatar />
                </motion.div>
              )}
            </AvatarWrap>

            <Button
              variant="primary"
              onClick={() => {
                clearLevelFlag(); // 🔥 muy importante
                setPreviousVariant(null);
              }}>
              Continuar
            </Button>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Backdrop>
  );
}
