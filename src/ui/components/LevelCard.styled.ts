// src/ui/components/LevelCard.styled.ts
import styled from 'styled-components';

export const CardWrap = styled.div`
  background: linear-gradient(180deg, #ffffff, #f7fbff);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 10px 24px rgba(12, 38, 56, 0.06);
  border: 1px solid rgba(10, 30, 45, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 20px;
    color: #13344b;
  }

  .sub {
    color: #4b6f7f;
    font-size: 12px;
    margin-top: 6px;
  }
`;

export const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.15)
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 70%;
    height: auto;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StatPill = styled.div`
  background: rgba(14, 50, 72, 0.05);
  color: #1f4960;
  padding: 10px;
  border-radius: 12px;
  font-size: 14px;
`;

export const PlayButton = styled.button`
  background: linear-gradient(180deg, #ffd66b, #f0b63a);
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 800;
  color: #2b1910;
  box-shadow: 0 8px 0 rgba(224, 160, 60, 0.14);
  cursor: pointer;
  font-size: 15px;
`;

export const Footer = styled.div`
  text-align: right;
  color: #6e8a98;
  font-size: 13px;
  margin-top: 6px;
`;
