import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authServices";
import { AppDataSource } from "@/db/data-source";
import { connectDB } from "@/db/data-source";
import Email from "next-auth/providers/email";

export async function POST(req: NextRequest) {
    // console.log(req.json())
  const { name , email } = await req.json();

  
  if (!email || !name) {
    return NextResponse.json(
      { success: false, message: "Email and Name is required." },
      { status: 400 }
    );
  }

  await connectDB();
  const authService = new AuthService();
  const response = await authService.register({name , email });

  return NextResponse.json(response);
}
