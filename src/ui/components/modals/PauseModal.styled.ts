import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
`;

export const ModalBox = styled.div`
  background: linear-gradient(180deg, #2b2346, #1a152c);
  border-radius: 22px;
  padding: 28px;
  width: 82%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);

  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    color: #fff;
    font-size: 1.8rem;
    margin-bottom: 18px;
    font-weight: 700;
    text-shadow: 0 0 12px #9b7bff;
  }
`;
