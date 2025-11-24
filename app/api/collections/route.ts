import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Collection, CollectionsResponse } from "../../../src/types/collection";

const filePath = path.join(process.cwd(), "data", "collections.json");

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
    // อ่านไฟล์ collections.json แบบ async
    const data = await fs.readFile(filePath, "utf-8");
    const collections: Collection[] = JSON.parse(data);

    // query params สำหรับ pagination
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get("offset") ?? 0);
    const limit = Number(searchParams.get("limit") ?? collections.length);

    // slice ข้อมูลตาม offset/limit
    const paginated = collections.slice(offset, offset + limit);

    const response: CollectionsResponse = {
      total: collections.length,
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
    console.error("Collections API error:", err);
    return NextResponse.json(
      { message: "Server error" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
