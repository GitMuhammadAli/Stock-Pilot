
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    // Read the token from HTTP-only cookie
    const token = req.cookies.get('authToken')?.value;
    const user = null;
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found"
      }, { status: 401 });
    }
    
    // Verify the token
    const decoded = verifyJwt(token);
    
    

    return NextResponse.json({
      authenticated: true,
      user: decoded
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Invalid token",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 401 });
  }
}
