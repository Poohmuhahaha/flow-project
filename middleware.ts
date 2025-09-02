// middleware.ts - Edge Runtime compatible
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-utils-edge';

// Protected routes ที่ต้อง login
const protectedRoutes = [
  '/dashboard',
  '/purchase',
  '/api/gis/analyze',
  '/api/usage',
  '/api/auth/api-key',
];

// Auth routes ที่ login แล้วไม่ควรเข้า
const authRoutes = [
  '/login',
  '/register',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionFromRequest(request);

  // ตรวจสอบว่าเป็น protected route หรือไม่
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // ตรวจสอบว่าเป็น auth route หรือไม่
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // ถ้าเป็น protected route
  if (isProtectedRoute) {
    if (!sessionToken) {
      // ไม่มี session -> redirect ไป login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // สำหรับ API routes - ให้ API endpoint ตรวจสอบ session เอง
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // สำหรับ page routes - redirect ถ้าไม่มี session
    return NextResponse.next();
  }

  // ถ้าเป็น auth route และมี session แล้ว -> redirect dashboard
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