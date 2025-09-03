// app/api/debug/login-test/route.ts - Debug login step by step
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db/auth-db/auth-queries';
import { verifyPassword } from '@/lib/db/auth-db/auth-utils-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    const debugSteps = [];
    
    // Step 1: Check inputs
    debugSteps.push({
      step: 1,
      name: 'Input validation',
      data: {
        hasEmail: !!email,
        hasPassword: !!password,
        email: email || 'missing'
      },
      success: !!(email && password)
    });
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Missing email or password',
        debugSteps
      });
    }
    
    // Step 2: Get user from database
    try {
      const user = await getUserByEmail(email);
      debugSteps.push({
        step: 2,
        name: 'Get user from database',
        data: {
          userFound: !!user,
          userId: user?.id || 'none',
          userEmail: user?.email || 'none',
          isActive: user?.isActive || false,
          hasPasswordHash: !!user?.passwordHash
        },
        success: !!user
      });
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          debugSteps
        });
      }
      
      // Step 3: Verify password
      try {
        const passwordValid = await verifyPassword(password, user.passwordHash);
        debugSteps.push({
          step: 3,
          name: 'Password verification',
          data: {
            passwordValid,
            passwordHashLength: user.passwordHash?.length || 0
          },
          success: passwordValid
        });
        
        return NextResponse.json({
          success: passwordValid,
          message: passwordValid ? 'All steps successful' : 'Password verification failed',
          debugSteps,
          finalResult: {
            canLogin: passwordValid && user.isActive,
            user: passwordValid ? {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              isActive: user.isActive
            } : null
          }
        });
        
      } catch (passwordError) {
        debugSteps.push({
          step: 3,
          name: 'Password verification',
          data: {
            error: passwordError instanceof Error ? passwordError.message : 'Unknown error'
          },
          success: false
        });
        
        return NextResponse.json({
          success: false,
          error: 'Password verification error',
          debugSteps
        });
      }
      
    } catch (dbError) {
      debugSteps.push({
        step: 2,
        name: 'Get user from database',
        data: {
          error: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        success: false
      });
      
      return NextResponse.json({
        success: false,
        error: 'Database error',
        debugSteps
      });
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
