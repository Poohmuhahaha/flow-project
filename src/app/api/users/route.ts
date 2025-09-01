import { NextResponse, NextRequest } from "next/server";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    // ตรวจสอบว่า DATABASE_URL มีอยู่หรือไม่
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not defined");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("Attempting to connect to database...");

    // แก้ไข SQL query - เลือกเฉพาะ field ที่ต้องการ และไม่เอา password
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        // ไม่เอา password ออกมาเพื่อความปลอดภัย
      })
      .from(users);

    console.log("Successfully fetched users:", allUsers.length);

    return NextResponse.json({
      success: true,
      data: allUsers,
      count: allUsers.length
    });

  } catch (error) {
    console.error("Database Error:", error);
    
    // ตรวจสอบประเภทของ error
    if (error instanceof Error) {
      // ถ้าเป็น timeout error
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return NextResponse.json(
          { 
            error: "Database connection timeout. Please try again later.",
            details: "Connection to database timed out"
          },
          { status: 504 }
        );
      }
      
      // ถ้าเป็น connection error
      if (error.message.includes('connect') || error.message.includes('fetch failed')) {
        return NextResponse.json(
          { 
            error: "Unable to connect to database",
            details: "Database connection failed"
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}