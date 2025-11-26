import styled, {keyframes} from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Aura = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 184, 68, 0.25),
    rgba(255, 184, 68, 0.08),
    transparent
  );

  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 5s ease-in-out infinite;
`;

export function CosmicAura({
  children,
  color,
  intensity,
}: {
  children: React.ReactNode;
  color: string;
  intensity: number;
}) {
  return (
    <Aura
      style={{
        boxShadow: `0 0 ${40 * intensity}px ${color}66`,
        background: `radial-gradient(circle, ${color}33, ${color}11, transparent)`,
      }}>
      {children}
    </Aura>
  );
}
