import React, {useEffect} from 'react';
import styled from 'styled-components';
import {Button} from './Button';
import type {ModalButton} from '../core/types';
import {CircleX} from 'lucide-react';
import {COLORS} from '@/ui/constants';
import {soundManager} from '@/core/sound/soundManager';

type Props = {
  open: boolean;
  buttons: ModalButton[];
  onClose: () => void;
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
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
  position: relative;
  background: linear-gradient(180deg, #2b2346, #1a152c);
  border-radius: 24px;
  padding: 28px;
  width: 88%;
  margin: 0 6%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
  border: 1.5px solid ${COLORS.secondary};

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

export function Modal({open, title, message, buttons, onClose}: Props) {
  if (!open) return;

  useEffect(() => {
    if (open) {
      soundManager.play('store-open');
    }
  }, [open]);

  return (
    <Overlay>
      <ModalBox>
        <CircleX
          size={24}
          color="#FFFFFF"
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            cursor: 'pointer',
            top: '3%',
            right: '4%',
          }}
          onClick={onClose}
        />
        {title && <Title>{title}</Title>}
        {typeof message === 'string' ? <Text>{message}</Text> : message}

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
