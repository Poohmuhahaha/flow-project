import { NextRequest, NextResponse } from 'next/server';
import { getEmailVerificationToken, verifyUserEmail } from '@/lib/db/auth-db/auth-queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ 
        error: 'Verification token is required' 
      }, { status: 400 });
    }

    // Check if token exists and is valid
    const verificationData = await getEmailVerificationToken(token);
    
    if (!verificationData) {
      return NextResponse.json({ 
        error: 'Invalid or expired verification token' 
      }, { status: 400 });
    }

    if (new Date() > verificationData.expiresAt) {
      return NextResponse.json({ 
        error: 'Verification token has expired' 
      }, { status: 400 });
    }

    // Mark email as verified
    await verifyUserEmail(verificationData.userId);

    return NextResponse.json({
      success: true,
      message: 'Email has been verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET method for verification links from emails
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/verify-email?error=missing-token', request.url));
    }

    // Check if token exists and is valid
    const verificationData = await getEmailVerificationToken(token);
    
    if (!verificationData) {
      return NextResponse.redirect(new URL('/verify-email?error=invalid-token', request.url));
    }

    if (new Date() > verificationData.expiresAt) {
      return NextResponse.redirect(new URL('/verify-email?error=expired-token', request.url));
    }

    // Mark email as verified
    await verifyUserEmail(verificationData.userId);

    return NextResponse.redirect(new URL('/verify-email?success=true', request.url));

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/verify-email?error=server-error', request.url));
  }
}