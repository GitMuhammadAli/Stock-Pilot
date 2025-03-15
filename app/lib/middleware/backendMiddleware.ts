import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

/**
 * Middleware for handling API routes authentication and validation
 */
export async function handleApiRoutes(req: NextRequest) {
  console.log("⚙️ API middleware running on:", req.nextUrl.pathname);
  
  // Public API endpoints that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify',
    '/api/auth/checkCookie'
  ];
  
  if (publicApiRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    console.log("🔓 Public API route accessed");
    return NextResponse.next();
  }
  
  // For protected API routes
  const authToken = req.cookies.get("authToken")?.value || 
                    req.cookies.get("token")?.value || 
                    req.headers.get("Authorization")?.replace("Bearer ", "");
  
  console.log("🔑 API auth token:", authToken ? "Present" : "Missing");
  
  if (!authToken) {
    console.log("🚫 API request rejected: No auth token");
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
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
      console.log("⏰ API request rejected: Token expired");
      return NextResponse.json(
        { success: false, error: "Token expired" },
        { status: 401 }
      );
    }
    
    // Role-based access control
    // Inventory management - only inventory managers and admins
    if (req.nextUrl.pathname.startsWith('/api/inventory') && 
        !['admin', 'inventory_manager'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions for inventory management" },
        { status: 403 }
      );
    }
    
    // Supplier management - only supplier managers and admins
    if (req.nextUrl.pathname.startsWith('/api/supplier') && 
        !['admin', 'supplier_manager'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions for supplier management" },
        { status: 403 }
      );
    }
    
    // Admin-only routes
    if (req.nextUrl.pathname.startsWith('/api/admin') && decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    
    console.log("✓ API token valid for user:", decoded.email, "with role:", decoded.role);
    
    // Add user info to request headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-role', decoded.role);
    
    // Continue with the modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
  } catch (error) {
    console.error("🚨 Invalid API token:", error);
    return NextResponse.json(
      { success: false, error: "Invalid authentication token" },
      { status: 401 }
    );
  }
}
