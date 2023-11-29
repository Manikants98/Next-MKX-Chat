import dbConnect from "@/lib/db";
import { Message } from "@/lib/model/message";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await dbConnect();
    const message = await Message.find();
    console.log(message);
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
