import {Button} from '@/common/Button';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Modal} from '@/common/Modal';
import {usePWAInstall} from '@/hooks/usePWAInstall';
import {Wrapper} from './styles';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';

export default function Landing() {
  const authenticated = useUserStore(s => s.authenticated);
  const navigate = useNavigate();

  const {canInstall, installApp} = usePWAInstall();

  const [modalInstall, setModalInstall] = useState(false);
  const [modalIOS, setModalIOS] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // Detectar si es PWA instalada
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  const isIOS =
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Si está instalada → no mostrar Landing
  useEffect(() => {
    if (isStandalone) {
      if (authenticated) navigate('/home');
      else navigate('/login');
    }
  }, [isStandalone, authenticated, navigate]);

  // Marcar que la app ha sido instalada
  useEffect(() => {
    const handler = () => {
      setJustInstalled(true);
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  const goNext = () => {
    if (authenticated) navigate('/home');
    else navigate('/login');
  };

  const handleStart = () => {
    if (justInstalled) return;

    if (isIOS) {
      setModalIOS(true);
      return;
    }

    if (canInstall) {
      setModalInstall(true);
      return;
    }

    goNext();
  };

  const handleInstall = async () => {
    await installApp();
    setModalInstall(false);
    setJustInstalled(true);
  };

  return (
    <>
      <Wrapper>
        <CosmicAvatar hideProgress={true} />

        <h1>Stellar Merge</h1>
        <p>Crea, fusiona y da forma al universo.</p>

        {!justInstalled && (
          <Button variant="secondary" onClick={handleStart} fullWidth={true}>
            Comenzar
          </Button>
        )}

        {justInstalled && (
          <p
            style={{
              color: '#9eff9e',
              marginTop: '20px',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}>
            ✔ App instalada. Ahora puedes abrir Stellar Merge desde tu pantalla
            de inicio.
          </p>
        )}
      </Wrapper>

      {/* Modal Android / Desktop */}
      <Modal
        open={modalInstall}
        title="Instalar Stellar Merge"
        message="¿Quieres instalar la aplicación para usarla más rápido y sin conexión?"
        onClose={() => setModalInstall(false)}
        buttons={[
          {
            label: 'Instalar aplicación',
            variant: 'primary',
            onClick: handleInstall,
          },
          {
            label: 'Continuar en navegador',
            variant: 'tertiary',
            onClick: goNext,
          },
        ]}
      />

      {/* Modal guía iOS */}
      <Modal
        open={modalIOS}
        title="Instalar en iPhone / iPad"
        message={
          <div style={{textAlign: 'left', lineHeight: '1.5'}}>
            Para instalar Stellar Merge en tu dispositivo Apple:
            <br />
            <br />
            1️⃣ Abre este sitio en <b>Safari</b>
            <br />
            2️⃣ Pulsa <b>Compartir</b> (icono cuadrado con flecha ↑)
            <br />
            3️⃣ Selecciona <b>“Añadir a pantalla de inicio”</b>
            <br />
            4️⃣ Confirma con <b>Añadir</b>
          </div>
        }
        onClose={() => setModalIOS(false)}
        buttons={[
          {
            label: 'OK',
            variant: 'primary',
            onClick: () => setModalIOS(false),
          },
          {
            label: 'Continuar en navegador',
            variant: 'tertiary',
            onClick: goNext,
          },
        ]}
      />
    </>
  );
}
