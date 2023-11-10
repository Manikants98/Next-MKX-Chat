import dbConnect from "@/lib/db";
import { Chat } from "@/lib/model/chat";
import { NextResponse } from "next/server";
export async function GET() {
  await dbConnect();
  const chat = await Chat.find();
  return NextResponse.json({ results: chat });
}
