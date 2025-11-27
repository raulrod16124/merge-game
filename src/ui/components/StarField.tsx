// src/ui/components/StarField.tsx
import styled, {keyframes} from 'styled-components';

const twinkle = keyframes`
  0% { opacity: 0.2; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.2; transform: scale(0.85); }
`;

const shoot = keyframes`
  0% {
    transform: translateX(-20vw) translateY(-20vh) scale(0.4);
    opacity: 0;
  }
  10% { opacity: 1; }
  100% {
    transform: translateX(130vw) translateY(40vh) scale(0.15);
    opacity: 0;
  }
`;

const Field = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

/* bright static stars */
const Star = styled.div<{
  $left: string;
  $top: string;
  $size: number;
  $delay: string;
}>`
  position: absolute;
  left: ${p => p.$left};
  top: ${p => p.$top};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: radial-gradient(white, rgba(255, 180, 255, 0.6));

  filter: drop-shadow(0 0 6px rgba(255, 200, 255, 0.9));
  opacity: 0.8;

  animation: ${twinkle} ${() => (Math.random() * 3 + 2).toFixed(2)}s ease-in-out
    infinite;
  animation-delay: ${p => p.$delay};
`;

/* shooting stars */
const ShootingStar = styled.div<{
  $delay: string;
  $top: string;
  $left: string;
}>`
  position: absolute;
  left: ${p => p.$left};
  top: ${p => p.$top};
  width: 3px;
  height: 3px;
  border-radius: 50%;

  background: radial-gradient(
    circle,
    white 0%,
    rgba(255, 255, 255, 0.4) 40%,
    transparent 100%
  );

  box-shadow: 0 0 8px rgba(255, 255, 255, 1);

  &:before {
    content: '';
    position: absolute;
    width: 60px;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0)
    );
    top: 0;
    left: -60px;
  }

  animation: ${shoot} 1.8s linear infinite;
  animation-delay: ${p => p.$delay};
  transform-origin: left;
`;

export default function StarField() {
  const staticStars = Array.from({length: 45}).map((_, i) => (
    <Star
      key={i}
      $left={`${Math.random() * 100}%`}
      $top={`${Math.random() * 100}%`}
      $size={Math.random() < 0.7 ? 2 : 3 + Math.random() * 2}
      $delay={`${Math.random() * 4}s`}
    />
  ));

  const shooting = [
    <ShootingStar key="shoot1" $left="-10%" $top="10%" $delay="0s" />,
    <ShootingStar key="shoot2" $left="-20%" $top="55%" $delay="1.5s" />,
    <ShootingStar key="shoot3" $left="-15%" $top="30%" $delay="3.4s" />,
  ];

  return (
    <Field aria-hidden>
      {staticStars}
      {shooting}
    </Field>
  );
}
