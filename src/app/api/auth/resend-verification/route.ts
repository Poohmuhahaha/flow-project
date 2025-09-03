import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createEmailVerificationToken } from '@/lib/db/auth-db/auth-queries';
import { sendVerificationEmail } from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'No account found with this email address' 
      }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ 
        error: 'Email is already verified' 
      }, { status: 400 });
    }

    // Generate new verification token
    const verificationToken = await createEmailVerificationToken(user.id);
    
    // Send email
    await sendVerificationEmail(user.email, verificationToken.token);

    return NextResponse.json({
      success: true,
      message: 'Verification email has been sent'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}