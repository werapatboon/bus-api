import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Collection, CollectionsResponse } from "../../../src/types/collection";
import type { Bus } from "../../../src/types/bus";

const collectionsPath = path.join(process.cwd(), "data", "collections.json");
const busesPath = path.join(process.cwd(), "data", "buses.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function GET() {
  // อ่านไฟล์
  const collectionsData = fs.readFileSync(collectionsPath, "utf-8");
  const busesData = fs.readFileSync(busesPath, "utf-8");

  const collections: Collection[] = JSON.parse(collectionsData);
  const buses: Bus[] = JSON.parse(busesData);

  // join busIds -> buses
  const enrichedCollections = collections.map((c) => ({
    ...c,
    buses: buses.filter((bus) => c.busIds.includes(bus.id)),
  }));

  const response: CollectionsResponse = {
    total: enrichedCollections.length,
    data: enrichedCollections,
  };

  return NextResponse.json(response, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
