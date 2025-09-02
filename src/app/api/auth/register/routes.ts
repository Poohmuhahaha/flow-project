// app/api/auth/register/route.ts - Updated imports
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db/auth-db/auth-queries-updated';
import { isValidEmail, isValidPassword } from '@/lib/db/auth-db/auth-utils-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, role, password, confirmPassword } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ 
        error: 'First name, last name, email, and password are required' 
      }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ 
        error: 'Passwords do not match' 
      }, { status: 400 });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: 'Password requirements not met',
        details: passwordValidation.errors
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists with this email' 
      }, { status: 409 });
    }

    // Create user
    const user = await createUser({
      email,
      password,
      firstName,
      lastName,
      company,
      role,
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}