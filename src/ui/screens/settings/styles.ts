import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Section = styled.div`
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionTitle = styled.h3`
  color: ${COLORS.primary};
  margin: 0 0 6px;
  font-size: 1.2rem;
  font-weight: 800;
`;

export const Row = styled.div`
  background: ${COLORS.tertiaryDark};
  padding: 14px 18px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
  &:active {
    background: ${COLORS.tertiaryDark};
  }
`;

export const Label = styled.span`
  color: ${COLORS.white};
  font-size: 1rem;
  font-weight: 600;
`;

export const Toggle = styled.div<{active: boolean}>`
  font-size: 0.9rem;
  padding: 4px 10px;
  border-radius: 8px;
  background: ${({active}) => (active ? COLORS.successDark : COLORS.failDark)};
  color: white;
`;

export const LinkRow = styled.div`
  background: ${COLORS.tertiaryDark};
  padding: 14px 18px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
`;
