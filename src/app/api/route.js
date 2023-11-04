import { NextResponse } from "next/server";
import { whatsappChatList } from "./chat";

export async function GET(req, res) {
  return NextResponse.json(
    {
      message: "Chat list get successfully",
      data: whatsappChatList,
      user: allUsers,
    },
    { status: 200 }
  );
}
