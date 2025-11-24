import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Bus, BusesResponse } from "../../../src/types/bus";


const filePath = path.join(process.cwd(), "data", "buses.json");

export async function GET(req: NextRequest) {
  // อ่านไฟล์ buses.json
  const data = fs.readFileSync(filePath, "utf-8");
  const buses: Bus[] = JSON.parse(data);

  // query params สำหรับ pagination (optional)
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

  return NextResponse.json(response);
}
