// src/ui/hud/HUD.tsx
import {useGameStore} from '@/state/gameStore';
import {TimerBar} from '../components/TimeBar';
import {ScoreBar} from './ScoreBar';
import {NextItem} from '../components/NextItem';

export function HUD() {
  const resetLevel = useGameStore(s => s.resetLevel);

  return (
    <div
      style={{
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '12px',
        backdropFilter: 'blur(6px)',
        marginBottom: '12px',
      }}>
      {/* Next item */}
      <NextItem />
      {/* Score and Time */}
      <div style={{flexGrow: 1, margin: '0 16px'}}>
        <ScoreBar />
        <TimerBar />
      </div>

      <button
        onClick={resetLevel}
        style={{
          padding: '8px 14px',
          borderRadius: '10px',
          background: '#d9534f',
          border: 'none',
          color: 'white',
          fontWeight: 600,
          boxShadow: '0 3px 5px rgba(0,0,0,0.25)',
        }}>
        Reiniciar
      </button>
    </div>
  );
}
