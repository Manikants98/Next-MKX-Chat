import { NextResponse } from "next/server";
import { whatsappChatList } from "./chat";
import { sql } from "@vercel/postgres";

export async function GET(req, res) {
  const { rows } = await sql`SELECT * from users`;
  return NextResponse.json(
    {
      message: "Chat list get successfully",
      data: whatsappChatList,
      rows: rows,
    },
    { status: 200 }
  );
}
