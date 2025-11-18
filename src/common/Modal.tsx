import React from 'react';
import styled from 'styled-components';
import {Button} from './Button';

type ModalButton = {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'fail';
  onClick?: () => void;
  to?: string;
  fullWidth?: boolean;
};

type Props = {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  buttons: ModalButton[];
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBox = styled.div`
  background: linear-gradient(180deg, #2b2346, #1a152c);
  border-radius: 24px;
  padding: 28px;
  width: 88%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
  border: 1.5px solid rgba(255, 255, 255, 0.12);

  display: flex;
  flex-direction: column;
  gap: 20px;

  animation: popIn 0.22s ease-out;
  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.86);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 1.9rem;
  font-weight: 800;
  text-shadow: 0 0 12px #9b7bff88;
`;

const Text = styled.p`
  color: #ffffff;
  font-size: 1.05rem;
  opacity: 0.92;
  line-height: 1.36;
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 6px;
`;

export function Modal({open, title, message, buttons}: Props) {
  if (!open) return;

  return (
    <Overlay>
      <ModalBox>
        {title && <Title>{title}</Title>}
        {message && <Text>{message}</Text>}

        <BtnGroup>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              variant={btn.variant ?? 'primary'}
              to={btn.to}
              onClick={btn.onClick}
              fullWidth={btn.fullWidth ?? true}
              styles={{width: 'auto'}}>
              {btn.label}
            </Button>
          ))}
        </BtnGroup>
      </ModalBox>
    </Overlay>
  );
}
