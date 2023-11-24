import { NextResponse } from "next/server";

export async function TokenFetcher(request) {
  const headers = await request?.headers;
  const token = await headers?.get("authorization");
  return token;
}
export async function isValidAuthorization(user) {
  if (!user) {
    return NextResponse.json(
      { message: "Provide a valid authorization token" },
      { status: 200 }
    );
  }
}
