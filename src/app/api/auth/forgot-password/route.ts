import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createPasswordResetToken } from '@/lib/db/auth-db/auth-queries';
import { sendPasswordResetEmail } from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Check if user exists (but don't reveal if they don't)
    const user = await getUserByEmail(email);
    
    if (user) {
      // Generate reset token
      const resetToken = await createPasswordResetToken(user.id);
      
      // Send email (don't await to avoid timing attacks)
      sendPasswordResetEmail(user.email, resetToken.token).catch(console.error);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent password reset instructions.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}