import styled, {keyframes} from 'styled-components';

export const Section = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 24px;
  margin-bottom: 8px;
  color: #9fd6ff;
  text-shadow: 0 0 6px rgba(90, 160, 255, 0.5);
`;

export const List = styled.div`
  padding: 12px 0;
  animation: ${fadeIn} 0.4s ease;
`;

export const FriendCard = styled.div`
  padding: 14px;
  background: linear-gradient(145deg, #1c1c25 0%, #232334 100%);
  border-radius: 16px;
  margin-bottom: 12px;

  border: 1px solid rgba(100, 160, 255, 0.22);
  box-shadow:
    0 0 12px rgba(70, 130, 255, 0.15),
    inset 0 0 12px rgba(90, 160, 255, 0.07);

  display: flex;
  justify-content: space-between;
  align-items: center;

  backdrop-filter: blur(4px);
`;

export const FriendName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #d7eaff;
  text-shadow: 0 0 5px rgba(110, 170, 255, 0.4);
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const CosmicDivider = styled.div`
  width: 100%;
  height: 2px;
  margin: 6px 0 14px 0;

  background: linear-gradient(
    90deg,
    rgba(90, 160, 255, 0) 0%,
    rgba(150, 220, 255, 0.8) 50%,
    rgba(90, 160, 255, 0) 100%
  );

  box-shadow: 0 0 8px rgba(120, 200, 255, 0.4);
`;
