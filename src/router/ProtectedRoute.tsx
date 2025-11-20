import {Navigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import type React from 'react';

export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const authenticated = useUserStore(s => s.authenticated);

  return authenticated ? children : <Navigate to="/login" />;
}
