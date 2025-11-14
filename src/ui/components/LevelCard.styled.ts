import styled from 'styled-components';

export const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 1.4rem 1.2rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Fredoka', sans-serif;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #2b3d5c;
  margin: 0;
`;

export const BoardSizeInfo = styled.p`
  font-size: 0.8rem;
  color: #6c7a96;
  margin: 0.2rem 0 0;
`;

export const IconPreview = styled.div`
  font-size: 2.8rem;
  user-select: none;
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3));
`;

export const InfoBlock = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding: 0.8rem 1rem;
  margin: 1rem 0;
  border-radius: 16px;
  color: #2b3d5c;
  font-size: 0.9rem;
`;

export const PlayButton = styled.button`
  background: linear-gradient(180deg, #ffd969 0%, #ffbc33 100%);
  border: none;
  width: 100%;
  padding: 0.9rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #3a2c16;
  cursor: pointer;
  box-shadow: 0px 5px 0px #d39d29;
  transition: 0.1s;

  &:hover {
    transform: translateY(-3px);
  }
  &:active {
    transform: translateY(0px) scale(0.97);
  }
`;

export const FooterInfo = styled.div`
  margin-top: 0.6rem;
  font-size: 0.9rem;
  color: #6c7a96;
  text-align: right;
`;
