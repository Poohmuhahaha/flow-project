"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerified?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requireEmailVerified = false,
  fallback 
}: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (requireEmailVerified && !user.emailVerified) {
        router.push('/verify-email');
        return;
      }

      setIsChecking(false);
    }
  }, [user, isLoading, requireEmailVerified, router]);

  if (isLoading || isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requireEmailVerified && !user.emailVerified) {
    return null; // Will redirect to verification
  }

  return <>{children}</>;
}

// HOC version for easier use
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireEmailVerified?: boolean;
    fallback?: React.ReactNode;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}