import {keyframes, css} from 'styled-components';

export const breathe = keyframes`
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.04); filter: brightness(1.12); }
  100% { transform: scale(1); filter: brightness(1); }
`;

export const breatheAnim = css`
  animation: ${breathe} 3s ease-in-out infinite;
`;
