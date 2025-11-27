import styled from 'styled-components';

export const Container = styled.div`
  padding: 18px;
  min-height: calc(100vh - 80px);
  color: white;
`;

export const CoinsDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding-bottom: 14px;
  font-weight: 700;
  font-size: 2rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 18px;
`;

export const Card = styled.div<{$locked?: boolean}>`
  background: ${({$locked}) =>
    $locked
      ? 'rgba(70,70,90,0.25)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'};

  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px;
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 10px;

  cursor: ${({$locked}) => ($locked ? 'default' : 'pointer')};
  opacity: ${({$locked}) => ($locked ? 0.55 : 1)};
  filter: ${({$locked}) => ($locked ? 'grayscale(0.5)' : 'none')};

  transition: 0.25s ease;

  &:active {
    transform: ${({$locked}) => ($locked ? 'none' : 'scale(0.97)')};
  }
`;

export const IconWrap = styled.div<{$locked?: boolean}>`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px 0;
  color: ${({$locked}) => ($locked ? 'rgba(200,200,255,0.25)' : 'white')};
`;

export const Info = styled.div`
  text-align: center;
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 4px;
`;

export const Desc = styled.div`
  font-size: 0.75rem;
  opacity: 0.75;
  line-height: 1.2;
`;

export const Price = styled.div`
  margin-top: auto;
  padding-top: 6px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  font-weight: 700;
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const BuyButton = styled.div`
  margin-top: 8px;
`;

export const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.35);

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.8);
`;

export const QtyControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 10px;
`;

export const QtyButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: translateY(1px);
  }
`;
