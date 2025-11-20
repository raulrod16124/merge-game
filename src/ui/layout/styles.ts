import styled from 'styled-components';
import {COLORS} from '../constants';

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
`;

export const Header = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  margin-bottom: 8px;

  h2 {
    margin: 0;
    color: ${COLORS.primary};
    font-size: 1.4rem;
    font-weight: 800;
  }
`;

export const BackButton = styled.button`
  background: ${COLORS.tertiaryDark};
  border: none;
  padding: 10px 10px;
  border-radius: 12px;
  cursor: pointer;
  color: ${COLORS.white};
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;
