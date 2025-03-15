import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function middleware(req: NextRequest) {
  console.log("✅ Middleware is running on:", req.nextUrl.pathname);
  
  // Log all cookies for debugging
  const cookieString = req.headers.get('cookie');
  console.log("🍪 All cookies:", cookieString);
  
  // Skip authentication for home and login pages
  if (req.nextUrl.pathname === "/" || 
      req.nextUrl.pathname === "/login" || 
      req.nextUrl.pathname === "/register" || 
      req.nextUrl.pathname === "/verify") {
    return NextResponse.next();
  }
  
  // For dashboard routes, check authentication
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Try all possible ways to get the token
    const authToken = req.cookies.get("authToken")?.value || 
                      req.cookies.get("token")?.value || 
                      req.headers.get("Authorization")?.replace("Bearer ", "");
    
    console.log("🔑 Auth token from cookies:", req.cookies.get("authToken")?.value);
    console.log("🔑 Auth token from alternate cookie:", req.cookies.get("token")?.value);
    console.log("🔑 Auth token from header:", req.headers.get("Authorization"));
    console.log("🔑 Final auth token used:", authToken ? "Present" : "Missing");
    
    if (!authToken) {
      console.log("🚫 No auth token - redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    try {
      // Verify JWT token
      const decoded = jwt.verify(authToken, SECRET_KEY) as { 
        id: string; 
        email: string; 
        role: string; 
        exp: number 
      };
      
      // Check token expiration
      if (Date.now() >= decoded.exp * 1000) {
        console.log("⏰ Token expired - redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }
      
      console.log("✓ Token valid for user:", decoded.email);
      return NextResponse.next();
    } catch (error) {
      console.error("🚨 Invalid token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  // For all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ],
};