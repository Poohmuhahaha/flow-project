import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
  noStore();

  try {
    // Debug logging
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("Attempting to connect to database...");
    
    const allUsers = await db.select().from(users);
    
    console.log("Successfully fetched users:", allUsers.length);

    return NextResponse.json({ 
      count: allUsers.length,
      users: allUsers 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Database Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch users from the database.",
        details: error?.message || "Unknown error",
        code: error?.code || "UNKNOWN"
      },
      { status: 500 }
    );
  }
}