import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
`;

export const Input = styled.input`
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  border: none;
  outline: none;
  color: ${COLORS.white};
  background: ${COLORS.tertiaryDark};
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);

  &:focus {
    background: ${COLORS.tertiary};
  }
`;
