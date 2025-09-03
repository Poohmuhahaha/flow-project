
// app/api/auth/login/route.ts - Fixed with await
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createSession, updateUserLastLogin } from '@/lib/db/auth-db/auth-queries';
import { verifyPassword, setSessionCookie } from '@/lib/db/auth-db/auth-utils-server';
import { getClientIP, getUserAgent } from '@/lib/db/auth-db/auth-utils-edge';

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called');
    const body = await request.json();
    console.log('Login request body:', {
      email: body.email || 'missing',
      hasPassword: !!body.password
    });
    
    const { email, password, rememberMe } = body;

    // Validation
    if (!email || !password) {
      console.log('Login validation failed: missing email or password');
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    console.log('Getting user by email:', email);
    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    console.log('User found:', { id: user.id, email: user.email, isActive: user.isActive });
    
    if (!user.isActive) {
      console.log('User account is deactivated');
      return NextResponse.json({ 
        error: 'Account is deactivated' 
      }, { status: 401 });
    }

    console.log('Verifying password...');
    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      console.log('Password verification failed');
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    console.log('Password verified, creating session...');
    // Create session
    const clientIP = getClientIP(request);
    const userAgent = getUserAgent(request);
    const session = await createSession(user.id, userAgent, clientIP);
    
    console.log('Session created:', { sessionId: session.id, token: session.token.substring(0, 10) + '...' });

    console.log('Updating last login...');
    // Update last login
    await updateUserLastLogin(user.id);

    console.log('Setting session cookie...');
    // Set cookie - ใช้ await
    await setSessionCookie(session.token);
    
    console.log('Login successful for user:', user.email);

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
    console.error('Login error occurred:');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error type:', typeof error);
    console.error('Full error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('connect') || errorMessage.includes('ENOTFOUND')) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Something went wrong'
    }, { status: 500 });
  }
}