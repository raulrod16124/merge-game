// src/ui/hud/HUD.tsx
import {TimerBar} from './TimeBar';
import {ScoreBar} from './ScoreBar';
import {NextItem} from './NextItem';
import {HUDWrapper, MobileStack, RightContent} from './HUD.styled';
import {LevelObjectiveBar} from './LevelObjectiveBar';

export function HUD() {
  return (
    <>
      <HUDWrapper>
        <MobileStack>
          <NextItem />
          <RightContent>
            <LevelObjectiveBar />
            <TimerBar />
          </RightContent>
        </MobileStack>

        <div className="desktop">
          <NextItem />
          <ScoreBar />
          <TimerBar />
        </div>
      </HUDWrapper>
    </>
  );
}
