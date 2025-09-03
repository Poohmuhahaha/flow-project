// middleware.ts - Edge Runtime compatible
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/db/auth-db/auth-utils-edge';

// Protected routes ที่ต้อง login
const protectedRoutes = [
  '/dashboard',
  '/purchase',
  '/api/auth/api-keys', // เพิ่ม API keys management
  '/api/credits',       // เพิ่ม credits management (POST)
];

// Public API routes ที่ใช้ API key authentication
const apiKeyRoutes = [
  '/api/demo',
  '/api/usage',
  '/api/gis/',
];

// Public routes ที่ไม่ต้อง auth
const publicRoutes = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
];

// Auth routes ที่ login แล้วไม่ควรเข้า
const authRoutes = [
  '/login',
  '/register',
  '/auth',
  '/forgot-password'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionFromRequest(request);

  // ตรวจสอบ route types
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isApiKeyRoute = apiKeyRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Public routes - ผ่านไปเลย
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // API key routes - ให้ API endpoint จัดการเอง
  if (isApiKeyRoute) {
    return NextResponse.next();
  }

  // Protected routes
  if (isProtectedRoute) {
    if (!sessionToken) {
      // ไม่มี session -> redirect ไป login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // สำหรับ API routes - ให้ API endpoint ตรวจสอบ session เอง
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  // Auth routes - ถ้ามี session แล้ว -> redirect dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
