import {useEffect, useState} from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 9999;
`;

const Box = styled.div`
  background: #1d1e2b;
  color: #fff;
  padding: 22px 28px;
  border-radius: 14px;
  text-align: center;
  width: 90%;
  max-width: 340px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
`;

const Btn = styled.button`
  margin-top: 18px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  background: linear-gradient(180deg, #9efff3, #4bf7d3);
  color: #12121f;
  cursor: pointer;
`;

export function PWAUpdateModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener('pwaUpdateAvailable', handler);
    return () => window.removeEventListener('pwaUpdateAvailable', handler);
  }, []);

  const refresh = () => {
    window.location.reload();
  };

  if (!show) return null;

  return (
    <Backdrop>
      <Box>
        <h3>Nueva versión disponible</h3>
        <p>Pulsa para actualizar ahora.</p>
        <Btn onClick={refresh}>Actualizar</Btn>
      </Box>
    </Backdrop>
  );
}
