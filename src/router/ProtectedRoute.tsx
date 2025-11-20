import type React from 'react';
import {Navigate} from 'react-router-dom';
import {useUserStore} from './../state/user-store';

export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const authenticated = useUserStore(s => s.authenticated);

  if (!authenticated) return <Navigate to="/login" />;

  return children;
}
