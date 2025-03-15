import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const authCookies = await cookies();
  const authToken = authCookies.get("authToken");

  if (!authToken) {
    return NextResponse.json({ success: false, message: "No auth token found" }, { status: 401 });
  }

  return NextResponse.json({ success: true, token: authToken.value });
}
