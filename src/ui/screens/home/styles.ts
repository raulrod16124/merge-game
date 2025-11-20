import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Container = styled.div`
  padding: 24px;
  height: calc(100% - 150px);
  min-height: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  color: ${COLORS.white};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  .coins {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${COLORS.primary};
  }
`;

export const IconButtons = styled.div`
  display: flex;
  gap: 12px;

  button {
    background: ${COLORS.tertiaryDark};
    border-radius: 12px;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: ${COLORS.white};
    transition: 0.15s;

    &:hover {
      background: ${COLORS.tertiary};
    }
  }
`;

export const AvatarArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;

  .avatar {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: ${COLORS.tertiaryDark};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    font-weight: 700;
    color: ${COLORS.primary};
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  }

  p {
    margin-top: 16px;
    font-size: 1.2rem;
    opacity: 0.85;
  }
`;

export const PlayArea = styled.div`
  margin-top: auto;
  width: 100%;
`;
