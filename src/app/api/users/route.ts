import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add comprehensive error handling
    console.log('API /users called');
    
    // Check environment variables
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found');
      return NextResponse.json(
        { error: 'Database configuration missing' }, 
        { status: 500 }
      );
    }

    // Mock data for testing (replace with actual database call)
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];

    // If using database, wrap in try-catch
    // const users = await prisma.user.findMany();
    // or
    // const users = await db.collection('users').find().toArray();

    return NextResponse.json({
      success: true,
      data: users,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      }, 
      { status: 500 }
    );
  }
}