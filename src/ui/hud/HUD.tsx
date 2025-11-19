// src/ui/hud/HUD.tsx
import {useState} from 'react';
import {TimerBar} from '../components/TimeBar';
import {ScoreBar} from './ScoreBar';
import {NextItem} from '../components/NextItem';
import {
  HUDPauseButton,
  HUDWrapper,
  InfoRow,
  MobileStack,
  RightContent,
} from './HUD.styled';
import {Pause} from 'lucide-react';
import {COLORS} from '../constants';
import {Modal} from '../../common/Modal';
import {useGameStore} from '../../state';

export function HUD() {
  const resetLevel = useGameStore(s => s.resetLevel);
  const [paused, setPaused] = useState(false);
  const openPause = () => setPaused(true);
  const closePause = () => setPaused(false);

  return (
    <>
      <HUDWrapper>
        <MobileStack>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              width: '100%',
            }}>
            <NextItem />
            <RightContent>
              <InfoRow>
                <ScoreBar />
              </InfoRow>
              <TimerBar />
            </RightContent>
            <HUDPauseButton onClick={openPause} aria-label="Pausar juego">
              <Pause size={24} color={COLORS.secondary} />
            </HUDPauseButton>
          </div>
        </MobileStack>

        <div className="desktop">
          <NextItem />
          <ScoreBar />
          <TimerBar />
          <HUDPauseButton onClick={openPause} aria-label="Pausar juego">
            <Pause size={24} color="#ffffff" />
          </HUDPauseButton>
        </div>
      </HUDWrapper>

      {paused && (
        <Modal
          onClose={closePause}
          open={paused}
          title="Juego pausado"
          buttons={
            [
              {
                label: 'Reanudar',
                variant: 'primary',
                onClick: closePause,
              },
              {
                label: 'Reinicar',
                variant: 'secondary',
                onClick: () => {
                  resetLevel();
                  closePause();
                },
              },
              {
                label: 'Salir',
                variant: 'tertiary',
                to: '/levels',
              },
            ].filter(Boolean) as any
          }
        />
      )}
    </>
  );
}
