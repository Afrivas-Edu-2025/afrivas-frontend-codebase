"use client"

import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    console.log('User Role:', user);
    console.log('Token:', token);
    console.log('Allowed Roles:', allowedRoles);
    console.log('Loading:', loading);

    // Wait until loading is complete
    if (!loading) {
      setIsAuthChecked(true);
      if (!token || !user) {
        router.push('/auth/login');
      } else if (!allowedRoles.includes(user.role)) {
        // If an admin hits a non-admin route, always send them back to the admin dashboard
        if (user.role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else {
          // For other roles, send them to the public home page
          router.replace('/');
        }
      }
    }
  }, [user, token, loading, router, allowedRoles]);

  // Return null while auth is still loading or if auth check fails
  if (loading || !isAuthChecked || !token || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}