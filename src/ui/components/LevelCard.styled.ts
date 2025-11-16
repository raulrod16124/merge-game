import styled from 'styled-components';

export const Card = styled.div`
  background: linear-gradient(180deg, #1a1b2f 0%, #12121f 100%);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  color: #eef1ff;
  transition: transform 0.15s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const LevelCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Icon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

export const Name = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

export const Sub = styled.div`
  font-size: 13px;
  opacity: 0.8;
`;

export const Info = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
`;

export const Pill = styled.div`
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 10px;
  border-radius: 10px;
  width: fit-content;
`;

export const PlayBtn = styled.button`
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  color: #12121f;
  font-weight: 700;
  font-size: 14px;
  background: linear-gradient(180deg, #9efff3, #4bf7d3);
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);

  &:active {
    transform: scale(0.96);
  }
`;
