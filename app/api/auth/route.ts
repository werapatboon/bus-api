import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { User } from "../../../src/types/user";

// ชี้ไปที่ไฟล์ users.json
const filePath = path.join(process.cwd(), "data", "users.json");

// ✅ รองรับ preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// ✅ Login API
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // อ่าน users.json แบบ async
    const data = await fs.readFile(filePath, "utf-8");
    const users: User[] = JSON.parse(data);

    // ตรวจสอบ credentials
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        {
          status: 401,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // จำลอง token (จริงควรใช้ JWT)
    const token = `${user.email}-token`;

    return NextResponse.json(
      {
        token,
        role: user.role,
        email: user.email,
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { message: "Server error" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
