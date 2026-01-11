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
        router.push('/auth');
      } else if (!allowedRoles.includes(user.role)) {
        // If an admin hits a non-admin route, always send them back to the admin dashboard
        if (user.role === 'SUPER_ADMIN') {
          router.replace('/super-admin/dashboard');
        } else if (user.role === 'UNIVERSITY_ADMIN' || user.role === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else if (user.role === 'STUDENT') {
          router.replace('/student/dashboard');
        } else if (user.role === 'LECTURER') {
          router.replace('/lecturer/dashboard');
        } else {
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