"use strict";
import prisma from "@/app/lib/prisma";

export default async function handler(req, res) {
  const { name, email } = await req.query;
  try {
    const str = "Hello World";
    const newUer = await prisma.User.create({
      data: { name, email },
    });
    res.json({
      user: newUer,
      error: null,
      data: str,
      message: "User craeted successfully",
    });
  } catch (error) {
    res.json({ error: error.message, message: str });
  }
}
