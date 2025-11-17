// src/ui/hud/HUD.tsx
import {useState} from 'react';
import {TimerBar} from '../components/TimeBar';
import {ScoreBar} from './ScoreBar';
import {NextItem} from '../components/NextItem';
import {HUDWrapper, InfoRow, MobileStack, PauseButton} from './HUD.styled';
import {PauseModal} from '../components/modals/PauseModal';

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
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <NextItem />
            <InfoRow>
              <ScoreBar />
            </InfoRow>
            <PauseButton onClick={openPause}>☼</PauseButton>
          </div>

          <TimerBar />
        </MobileStack>

        <div className="desktop">
          <NextItem />
          <ScoreBar />
          <TimerBar />
          <PauseButton onClick={openPause}>☼</PauseButton>
        </div>
      </HUDWrapper>

      {paused && <PauseModal onClose={closePause} />}
    </>
  );
}
