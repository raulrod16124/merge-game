import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Section = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  align-self: center;
  transform: scale(0.75);
  margin-top: -20px;
`;

export const EditIcon = styled.button`
  background: ${COLORS.tertiaryDark};
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.15s;

  position: absolute;
  bottom: 4px;
  right: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const RightContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  & .edit {
    position: relative;
    margin-left: 10px;
  }
`;

export const FieldLabel = styled.div`
  font-size: 0.95rem;
  opacity: 0.7;
`;

export const Value = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${COLORS.white};
`;

export const ButtonsArea = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
