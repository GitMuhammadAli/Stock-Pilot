import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No authentication token found"
      }, { status: 401 });
    }
    console.log(token)
    const decoded = verifyJwt(token);
    console.log(decoded)
    
    return NextResponse.json({
      authenticated: true,
      user: decoded,
      token: token 
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Invalid authentication token",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 401 });
  }
}
