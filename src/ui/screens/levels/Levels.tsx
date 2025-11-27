// src/ui/screens/levels/index.tsx
import {useEffect, useRef} from 'react';
import AppLayout from '@/ui/layout';
import {LevelCard} from '@/ui/components/LevelCard';
import {LEVELS} from '@/data/levels';
import {usePlayerStore} from '@/state/player-store';
import {LevelsWrapper} from './styles';
import StarField from '@/ui/components/StarField';

export function Levels() {
  const levels = LEVELS;
  const highestUnlocked = usePlayerStore(s => s.highestLevelUnlocked);
  const completed = usePlayerStore(s => s.completedLevelUnlocks);
  const scores = usePlayerStore(s => s.completedLevels);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // helper que centra el nodo idx en el contenedor
  const centerNode = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const node = nodeRefs.current[idx];
    if (!node) return;

    // offsetTop es más estable para scrollear dentro del contenedor
    const nodeOffsetTop = node.offsetTop;
    const nodeHeight = node.clientHeight;
    const containerHeight = container.clientHeight;

    const target = Math.max(
      0,
      Math.floor(nodeOffsetTop - containerHeight / 2 + nodeHeight / 2),
    );

    container.scrollTo({top: target, behavior: 'smooth'});
  };

  useEffect(() => {
    // si aún no se han renderizado los nodos, reintentar al próximo frame
    const idx = Math.max(0, highestUnlocked - 1);
    let raf = 0;
    const tryCenter = () => {
      const node = nodeRefs.current[idx];
      const container = containerRef.current;
      if (container && node) {
        centerNode(idx);
      } else {
        // reintentar unas cuantas veces, por si el layout tarda
        raf = requestAnimationFrame(() => {
          const nodeNow = nodeRefs.current[idx];
          if (nodeNow && containerRef.current) centerNode(idx);
        });
      }
    };

    // pequeño delay para asegurar layout completo (lo hace más fiable en dispositivos)
    const t = window.setTimeout(tryCenter, 80);

    return () => {
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [highestUnlocked, levels.length]);

  return (
    <AppLayout title="Mapa Cósmico" prevRoute="/home">
      <LevelsWrapper ref={containerRef}>
        <StarField />
        <div className="nebula" style={{top: '30%', left: '-20%'}} />
        <div className="nebula" style={{top: '70%', right: '-15%'}} />

        {levels.map((lvl, i) => {
          const index = Number(lvl.id.replace('level', ''));
          const unlocked = index <= highestUnlocked;
          const isCompleted = Boolean(completed[index]);
          const highScore = scores?.[lvl.id]?.score ?? null;

          return (
            <div
              key={lvl.id}
              ref={el => {
                nodeRefs.current[i] = el;
              }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}>
              <LevelCard
                level={lvl}
                unlocked={unlocked}
                completed={isCompleted}
                highScore={highScore}
                index={i}
              />
            </div>
          );
        })}
      </LevelsWrapper>
    </AppLayout>
  );
}
