import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { User } from "../../../src/types/user"; 

const filePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // อ่าน users.json
  const data = fs.readFileSync(filePath, "utf-8");
  const users: User[] = JSON.parse(data);

  // ตรวจสอบ credentials
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // จำลอง token (จริงควรใช้ JWT)
  const token = `${user.email}-token`;

  return NextResponse.json({
    token,
    role: user.role,
    email: user.email,
  });
}
