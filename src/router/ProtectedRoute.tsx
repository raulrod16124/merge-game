import {Navigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import {useEffect, useState} from 'react';

export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const authenticated = useUserStore(s => s.authenticated);
  const uid = useUserStore(s => s.uid);

  // Estado interno para evitar redirect prematuro
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Cuando ya sabemos si hay o no usuario → dejar pasar
    // (uid ≠ null o authenticated ≠ false)
    const timeout = setTimeout(() => {
      setCheckingAuth(false);
    }, 50); // pequeño delay para que main.tsx cargue Firebase Auth

    return () => clearTimeout(timeout);
  }, [authenticated, uid]);

  // --------------------------
  // 🔄 1. Loading (esperando Firebase)
  // --------------------------
  if (checkingAuth) {
    return null; // o un loader si quieres
  }

  // --------------------------
  // ❌ 2. No autenticado → login
  // --------------------------
  if (!authenticated || !uid) {
    return <Navigate to="/login" replace />;
  }

  // --------------------------
  // ✔ 3. OK: usuario autenticado
  // --------------------------
  return children;
}
