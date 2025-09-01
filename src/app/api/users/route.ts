// app/api/users/route.ts

import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { unstable_noStore as noStore } from 'next/cache';

// ฟังก์ชันนี้จะจัดการกับ HTTP GET requests ที่เข้ามาที่ /api/users
export async function GET() {
  // noStore() ใช้เพื่อป้องกัน Next.js ไม่ให้ cache ผลลัพธ์ของ API นี้
  // ทำให้เราได้ข้อมูลสดใหม่จาก database ทุกครั้งที่เรียกใช้
  noStore();

  try {
    // ดึงข้อมูลผู้ใช้ทั้งหมดจาก database เหมือนเดิม
    const allUsers = await db.select().from(usersTable);

    // ส่งข้อมูลกลับไปในรูปแบบ JSON พร้อม status code 200 (OK)
    return NextResponse.json({ 
      count: allUsers.length,
      users: allUsers 
    }, { status: 200 });

  } catch (error) {
    // กรณีเกิดข้อผิดพลาดในการเชื่อมต่อหรือดึงข้อมูล database
    console.error("API Error:", error); // แสดง error ใน console ของ server
    
    // ส่ง response ข้อผิดพลาดกลับไปพร้อม status code 500 (Internal Server Error)
    return NextResponse.json(
      { error: "Failed to fetch users from the database." },
      { status: 500 }
    );
  }
}