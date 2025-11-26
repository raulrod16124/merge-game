import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Wrapper = styled.div`
  padding: 40px 24px;
  text-align: center;
  min-height: 100vh;
  background: #0b1220;
  color: ${COLORS.white};

  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;

  h1 {
    font-size: 2.4rem;
    font-weight: 800;
    margin: 0;
    margin-bottom: 4px;
  }

  p {
    max-width: 300px;
    opacity: 0.8;
    margin-bottom: 12px;
  }

  input {
    padding: 14px 5px;
    width: 100%;
    max-width: 320px;
    border-radius: 12px;
    border: none;
    font-size: 1rem;
    margin-top: 12px;
    background: ${COLORS.tertiaryDark};
    color: ${COLORS.white};
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);

    &:focus {
      background: ${COLORS.tertiary};
    }
  }
`;

export const AvatarPreview = styled.div`
  margin-top: 12px;
  transform: scale(0.85);
`;

export const SelectorGrid = styled.div`
  width: 100%;
  max-width: 360px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
`;

export const OptionCard = styled.button<{$active: boolean}>`
  padding: 14px 10px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;

  background: ${({$active}) =>
    $active ? COLORS.secondary : COLORS.tertiaryDark};

  color: ${({$active}) => ($active ? COLORS.white : '#CCC')};

  transition: 0.15s;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
`;
