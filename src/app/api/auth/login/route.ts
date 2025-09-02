
// app/api/auth/login/route.ts - Fixed with await
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createSession, updateUserLastLogin } from '@/lib/db/auth-db/auth-queries-updated';
import { verifyPassword, setSessionCookie } from '@/lib/db/auth-db/auth-utils-server';
import { getClientIP, getUserAgent } from '@/lib/db/auth-db/auth-utils-edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ 
        error: 'Account is deactivated' 
      }, { status: 401 });
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    // Create session
    const clientIP = getClientIP(request);
    const userAgent = getUserAgent(request);
    const session = await createSession(user.id, userAgent, clientIP);

    // Update last login
    await updateUserLastLogin(user.id);

    // Set cookie - ใช้ await
    await setSessionCookie(session.token);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        credits: user.credits,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}