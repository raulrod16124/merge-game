// src/ui/screens/levels/index.tsx
import {useState, useEffect, useRef} from 'react';
import AppLayout from '@/ui/layout';
import {LevelCard} from '@/ui/components/LevelCard';
import {LEVELS} from '@/data/levels';
import {usePlayerStore} from '@/state/player-store';
import {
  SectionCarouselWrapper,
  SectionItem,
  SectionImage,
  LevelsPanel,
  LevelsPanelScroller,
  CloseIconWrapper,
} from './styles';
import {X} from 'lucide-react';

const SECTIONS = [
  {id: 1, title: 'Nebula Nursery', image: '/sections/section_1.png'},
  {id: 2, title: 'Orbital Awakening', image: '/sections/section_2.png'},
  {id: 3, title: 'Stellar Forge', image: '/sections/section_3.png'},
  {id: 4, title: 'Galactic Loom', image: '/sections/section_4.png'},
  {id: 5, title: 'Cosmic Ascension', image: '/sections/section_5.png'},
];

export function Levels() {
  const highestUnlocked = usePlayerStore(s => s.highestLevelUnlocked);
  const unlockedSections = usePlayerStore(s => s.unlockedSections);

  // sección seleccionada
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  // centrar la última sección desbloqueada
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    // sección más alta desbloqueada
    const lastUnlocked = unlockedSections[unlockedSections.length - 1];

    // encuentra su index real en SECTIONS
    const sectionIndex = SECTIONS.findIndex(s => s.id === lastUnlocked);
    if (sectionIndex === -1) return;

    const node = container.children[sectionIndex] as HTMLElement;
    if (!node) return;

    // delay para asegurar layout
    const t = setTimeout(() => {
      const offset =
        node.offsetLeft - window.innerWidth / 2 + node.clientWidth / 2;
      container.scrollTo({left: offset, behavior: 'smooth'});
    }, 60);

    return () => clearTimeout(t);
  }, [unlockedSections]);

  // niveles de la sección seleccionada
  const levelsOfSection = selectedSection
    ? LEVELS.filter(lvl => {
        const index = Number(lvl.id.replace('level', ''));
        return (
          index >= (selectedSection - 1) * 10 + 1 &&
          index <= selectedSection * 10
        );
      })
    : [];

  console.log({levelsOfSection, highestUnlocked});

  return (
    <AppLayout title="Mapa Cósmico" prevRoute="/home">
      {/* ---- CARRUSEL DE SECCIONES ---- */}
      <SectionCarouselWrapper ref={carouselRef}>
        {!selectedSection &&
          SECTIONS.map(sec => {
            const isUnlocked = unlockedSections.includes(sec.id);
            return (
              <SectionItem
                key={sec.id}
                $unlocked={isUnlocked}
                onClick={() => isUnlocked && setSelectedSection(sec.id)}>
                <SectionImage src={sec.image} $dimmed={!isUnlocked} />
                <div className="label">{sec.title}</div>
              </SectionItem>
            );
          })}
      </SectionCarouselWrapper>

      {/* ---- PANEL DE NIVELES DE LA SECCIÓN ---- */}
      {selectedSection && (
        <LevelsPanel>
          <h2>{levelsOfSection[0].name} </h2>
          <CloseIconWrapper onClick={() => setSelectedSection(null)}>
            <X size={22} />
          </CloseIconWrapper>

          <LevelsPanelScroller>
            {levelsOfSection.map((lvl, i) => {
              const unlocked = usePlayerStore
                .getState()
                .isLevelUnlocked(lvl.id);
              const completedLevels = usePlayerStore.getState().completedLevels;
              const completed = Boolean(completedLevels?.[lvl.id]);
              const highScore = completedLevels?.[lvl.id]?.score ?? null;

              return (
                <LevelCard
                  key={lvl.id}
                  level={lvl}
                  unlocked={unlocked}
                  completed={completed}
                  highScore={highScore}
                  index={i}
                />
              );
            })}
          </LevelsPanelScroller>
        </LevelsPanel>
      )}
    </AppLayout>
  );
}
