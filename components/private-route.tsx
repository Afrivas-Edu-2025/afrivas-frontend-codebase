"use client"

import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const normalizedUserRole = String(user?.role || "").toUpperCase();
  const normalizedAllowedRoles = useMemo(
    () => allowedRoles.map((role) => role.toUpperCase()),
    [allowedRoles],
  );

  useEffect(() => {
    // Wait until loading is complete
    if (!loading) {
      setIsAuthChecked(true);
      if (!token || !user) {
        router.push('/login');
      } else if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        // Redirect to the correct dashboard based on role
        if (normalizedUserRole === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else if (normalizedUserRole === 'SUPER_ADMIN') {
          router.replace('/super-admin/dashboard');
        } else if (normalizedUserRole === 'STAFF') {
          router.replace('/staff/dashboard');
        } else {
          // For other roles, send them to the public home page
          router.replace('/');
        }
      }
    }
  }, [user, token, loading, router, normalizedAllowedRoles, normalizedUserRole]);

  // Return null while auth is still loading or if auth check fails
  if (loading || !isAuthChecked || !token || !user || !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return null;
  }

  return <>{children}</>;
}
