import { NextRequest, NextResponse } from 'next/server';
import { getPasswordResetToken, updateUserPassword, usePasswordResetToken } from '@/lib/db/auth-db/auth-queries';
import { isValidPassword } from '@/lib/db/auth-db/auth-utils-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Token and password are required' 
      }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: 'Password requirements not met',
        details: passwordValidation.errors
      }, { status: 400 });
    }

    // Check if token is valid and not expired
    const resetTokenData = await getPasswordResetToken(token);
    
    if (!resetTokenData || resetTokenData.resetToken.isUsed) {
      return NextResponse.json({ 
        error: 'Invalid or expired reset token' 
      }, { status: 400 });
    }

    if (new Date() > resetTokenData.resetToken.expiresAt) {
      return NextResponse.json({ 
        error: 'Reset token has expired' 
      }, { status: 400 });
    }

    // Update password
    await updateUserPassword(resetTokenData.user.id, password);
    
    // Mark token as used
    await usePasswordResetToken(token);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}