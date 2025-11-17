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
import {PauseModal} from '../components/modals/PauseModal';
import {Pause} from 'lucide-react';
import {COLORS} from '../constants';

export function HUD() {
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

      {paused && <PauseModal onClose={closePause} />}
    </>
  );
}
