// import { NextRequest, NextResponse } from "next/server";
// import { verifyJwt } from '@/lib/utils/jwt';

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get('authToken')?.value;
    
//     if (!token) {
//       return NextResponse.json({
//         authenticated: false,
//         message: "No authentication token found"
//       }, { status: 401 });
//     }
//     console.log(token)
//     const decoded = verifyJwt(token);
//     console.log(decoded)
    
//     return NextResponse.json({
//       authenticated: true,
//       user: decoded,
//       token: token 
//     });
//   } catch (error) {
//     return NextResponse.json({
//       authenticated: false,
//       message: "Invalid authentication token",
//       error: error instanceof Error ? error.message : String(error)
//     }, { status: 401 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from '@/lib/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    // Read the token from HTTP-only cookie
    const token = req.cookies.get('authToken')?.value;
    
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
