// src/ui/components/cosmic-avatar/CosmicEvolutionModal.tsx

import {motion, AnimatePresence} from 'framer-motion';
import styled from 'styled-components';
import {usePlayerStore} from '@/state/player-store';
import {useUserStore} from '@/state/user-store';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {useEffect, useState} from 'react';
import {Button} from '@/common/Button';
import {AvatarVariant, type AvatarAppearance} from '../cosmic-avatar/types';
import {vibrate} from '@/core/vibration';
import {soundManager} from '@/core/sound/soundManager';

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

  const currentAppearance = useUserStore(s => s.avatar);
  const [previousAppearance, setPreviousAppearance] =
    useState<AvatarAppearance | null>(null);

  const [animationStage, setAnimationStage] = useState<
    'before' | 'pulse' | 'after'
  >('before');

  useEffect(() => {
    if (level) {
      soundManager.play('evolution');
      vibrate([20, 40, 20, 40, 60]);

      if (!previousAppearance) {
        setPreviousAppearance(
          currentAppearance ?? {
            shape: AvatarVariant.HYBRID,
            color: '#4cc9f0',
            accessories: [],
          },
        );
      }

      setAnimationStage('before');
      const t1 = setTimeout(() => setAnimationStage('pulse'), 600);
      const t2 = setTimeout(() => setAnimationStage('after'), 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setPreviousAppearance(null);
    }
  }, [level]);

  if (!level) return null;

  const safePrevAppearance: AvatarAppearance = previousAppearance ??
    currentAppearance ?? {
      shape: AvatarVariant.HYBRID,
      color: '#4cc9f0',
      accessories: [],
    };

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
              {animationStage === 'before' && (
                <motion.div
                  initial={{opacity: 1}}
                  animate={{opacity: 0.2, scale: 0.9}}
                  transition={{duration: 0.6}}>
                  <CosmicAvatar
                    forceAppearance={safePrevAppearance}
                    hideProgress
                  />
                </motion.div>
              )}

              {animationStage === 'pulse' && (
                <motion.div
                  initial={{opacity: 0.4, scale: 1}}
                  animate={{opacity: 0, scale: 1.3}}
                  transition={{duration: 0.6}}
                  style={{position: 'absolute'}}>
                  <CosmicAvatar
                    forceAppearance={safePrevAppearance}
                    hideProgress
                  />
                </motion.div>
              )}

              {animationStage === 'after' && (
                <motion.div
                  initial={{opacity: 0, scale: 0.7}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.5}}>
                  <CosmicAvatar hideProgress />
                </motion.div>
              )}
            </AvatarWrap>

            <Button
              variant="primary"
              onClick={() => {
                clearLevelFlag();
                setPreviousAppearance(null);
              }}>
              Continuar
            </Button>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Backdrop>
  );
}
