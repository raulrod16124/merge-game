import styled from 'styled-components';
import {breatheAnim} from './styles';

const Body = styled.div`
  position: absolute;
  width: 70px;
  height: 115px;
  background: rgba(255, 255, 255, 0.09);
  border-radius: 40px;
  top: 28px;
  backdrop-filter: blur(3px);
  ${breatheAnim}
`;

const Head = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  top: -5px;
  left: 11px;
  backdrop-filter: blur(3px);
  ${breatheAnim}
`;

interface IProps {
  detail?: number;
}

export function HumanoidShape({detail = 0}: IProps) {
  return (
    <>
      <Body
        style={{
          opacity: 0.85 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
      <Head
        style={{
          opacity: 0.9 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
    </>
  );
}
