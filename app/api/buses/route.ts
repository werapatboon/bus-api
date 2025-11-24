import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Bus, BusesResponse } from "../../../src/types/bus";

const filePath = path.join(process.cwd(), "data", "buses.json");

// ✅ รองรับ preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    // อ่านไฟล์ buses.json แบบ async
    const data = await fs.readFile(filePath, "utf-8");
    const buses: Bus[] = JSON.parse(data);

    // query params สำหรับ pagination
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get("offset") ?? 0);
    const limit = Number(searchParams.get("limit") ?? buses.length);

    // slice ข้อมูลตาม offset/limit
    const paginated = buses.slice(offset, offset + limit);

    const response: BusesResponse = {
      total: buses.length,
      offset,
      limit,
      lang: "en", // หรือ "th" ถ้าอยากรองรับหลายภาษา
      data: paginated,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Buses API error:", err);
    return NextResponse.json(
      { message: "Server error" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
