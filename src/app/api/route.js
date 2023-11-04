import { NextResponse } from "next/server";
import { whatsappChatList } from "./chat";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req, res) {
  const allUsers = await prisma.users.findMany();
  return NextResponse.json(
    { message: "Hello World", data: whatsappChatList, user: allUsers },
    { status: 200 }
  );
}
