// app/api/auth/register/route.ts - Enhanced error handling
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, createEmailVerificationToken } from '@/lib/db/auth-db/auth-queries';
import { isValidEmail, isValidPassword } from '@/lib/db/auth-db/auth-utils-server';
import { sendVerificationEmail } from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    console.log('Register API called');
    
    // Test database connection first
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found');
      return NextResponse.json({ 
        error: 'Database configuration missing' 
      }, { status: 500 });
    }
    
    const body = await request.json();
    console.log('Request body received:', {
      firstName: body.firstName || 'missing',
      lastName: body.lastName || 'missing', 
      email: body.email || 'missing',
      hasPassword: !!body.password,
      hasConfirmPassword: !!body.confirmPassword
    });
    
    const { firstName, lastName, email, company, role, password, confirmPassword } = body;

    // Enhanced validation
    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    
    if (missingFields.length > 0) {
      console.log('Validation failed: missing fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      console.log('Validation failed: invalid email:', email);
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      console.log('Validation failed: passwords do not match');
      return NextResponse.json({ 
        error: 'Passwords do not match' 
      }, { status: 400 });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      console.log('Validation failed: password requirements not met:', passwordValidation.errors);
      return NextResponse.json({ 
        error: 'Password requirements not met',
        details: passwordValidation.errors
      }, { status: 400 });
    }

    console.log('All validations passed, checking if user exists...');
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('User already exists with email:', email);
      return NextResponse.json({ 
        error: 'User already exists with this email' 
      }, { status: 409 });
    }

    console.log('Creating new user...');
    
    // Create user with enhanced error handling
    const userData = {
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company?.trim() || null,
      role: role?.trim() || null,
    };
    
    console.log('User data to create:', { ...userData, password: '[HIDDEN]' });
    
    const user = await createUser(userData);
    
    console.log('User created successfully:', { id: user.id, email: user.email });

    // Send verification email
    try {
      const verificationToken = await createEmailVerificationToken(user.id);
      await sendVerificationEmail(user.email, verificationToken.token);
      console.log('Verification email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails - user can resend later
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully. Please check your email for verification instructions.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });

  } catch (error) {
    console.error('Registration error occurred:');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error type:', typeof error);
    console.error('Full error:', error);
    
    // Check for specific database errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('connect') || errorMessage.includes('ENOTFOUND')) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, { status: 503 });
    }
    
    if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
      return NextResponse.json({ 
        error: 'Email address already exists',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Something went wrong'
    }, { status: 500 });
  }
}