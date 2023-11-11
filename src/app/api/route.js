import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json("MKX API", { status: 200 });
}
