// src/ui/screens/Home.styled.ts
import styled from 'styled-components';

export const HomeWrapper = styled.div`
  width: 100%;
  min-height: 100dvh; /* viewport real, evita saltos en móvil */
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #78b8ff 0%, #cfeeff 100%);
  padding: 2rem 1rem 4rem;
  box-sizing: border-box;

  font-family: 'Fredoka', sans-serif;

  @media (max-width: 768px) {
    padding-top: 4rem;
  }
`;

export const ContentArea = styled.div`
  width: 100%;
  max-width: 450px; /* limita en desktop */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: 900;
  text-align: center;
  color: #ffffff;
  margin-bottom: 1.4rem;
  text-shadow: 0px 3px 3px rgba(0, 0, 0, 0.35);

  @media (min-width: 480px) {
    font-size: 3.2rem;
  }
`;

export const Card = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 28px;
  padding: 1.8rem 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 12px 25px rgba(0, 0, 0, 0.18);
  margin-bottom: 1.5rem;
`;

export const Illustration = styled.div`
  width: 100%;
  height: clamp(150px, 40vw, 220px); /* se adapta sin deformar en móviles */
  border-radius: 22px;
  background: linear-gradient(180deg, #7ee57d 0%, #3aa83d 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.3rem;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.18);

  font-size: clamp(3rem, 10vw, 4.5rem);
  user-select: none;
`;

export const Description = styled.p`
  font-size: 1.05rem;
  text-align: center;
  color: #2a3452;
  line-height: 1.45;
  margin-bottom: 1.8rem;
  padding: 0 0.5rem;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  font-size: 1.3rem;
  font-weight: 800;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  color: #3a2c16;
  background: linear-gradient(180deg, #ffd969 0%, #ffbc33 100%);
  box-shadow: 0px 6px 0px #d39d29;
  transition: 0.12s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(0px) scale(0.97);
    box-shadow: 0px 3px 0px #c08d22;
  }
`;

export const FooterInfo = styled.div`
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
`;
