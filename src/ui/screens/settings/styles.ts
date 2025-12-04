// src/ui/screens/settings/styles.ts

import styled, {keyframes} from 'styled-components';
import {COLORS} from '@/ui/constants';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Wrapper = styled.div`
  overflow: auto;
  padding-bottom: 12dvh;
`;

export const Section = styled.div`
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.4s ease;
  gap: 1dvh;
`;

export const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 8px 0;
  color: #9fd6ff;
  text-shadow: 0 0 6px rgba(90, 160, 255, 0.5);
`;

export const CosmicDivider = styled.div`
  width: 100%;
  height: 2px;
  margin: 6px 0 16px 0;

  background: linear-gradient(
    90deg,
    rgba(90, 160, 255, 0) 0%,
    rgba(150, 220, 255, 0.8) 50%,
    rgba(90, 160, 255, 0) 100%
  );

  box-shadow: 0 0 8px rgba(120, 200, 255, 0.4);
`;

export const SettingCard = styled.div`
  padding: 16px 18px;
  background: linear-gradient(
    145deg,
    ${COLORS.tertiary} 0%,
    ${COLORS.tertiaryDark} 100%
  );
  border-radius: 12px;

  border: 1px solid ${COLORS.secondary};
  box-shadow:
    0 0 12px rgba(70, 130, 255, 0.15),
    inset 0 0 12px rgba(90, 160, 255, 0.07);

  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;

  cursor: pointer;
  transition: 0.15s;
  backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 14px rgba(90, 160, 255, 0.35);
  }
`;

export const Label = styled.span`
  color: #d7eaff;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(110, 170, 255, 0.4);
`;

export const Toggle = styled.div<{$active: boolean}>`
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 10px;

  background: ${({$active}) =>
    $active ? COLORS.successDark : COLORS.failDark};

  color: white;
  font-weight: 700;
  letter-spacing: 0.5px;

  box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
`;

export const LinkCard = styled(SettingCard)`
  grid-template-columns: 1fr auto;
`;
