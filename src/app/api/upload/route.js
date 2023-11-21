import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const blob = await put(image.name, image, {
      access: "public",
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.error(error.message, { status: 500 });
  }
}
