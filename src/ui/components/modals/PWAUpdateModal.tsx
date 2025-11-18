import {Modal} from '../../../common/Modal';
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
      <Modal
        open={show}
        title="Nueva versión disponible"
        message="Pulsa para actualizar ahora"
        buttons={
          [
            {
              label: 'Actualizar',
              variant: 'primary',
              onClick: refresh,
            },
          ].filter(Boolean) as any
        }
      />
    </Backdrop>
  );
}
