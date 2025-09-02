// components/providers/auth-provider.tsx - Alternative approach
"use client"

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return React.createElement(AuthProvider, null, children);
}