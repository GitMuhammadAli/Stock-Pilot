import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

// Define route access by role
const roleBasedRoutes = {
  // These routes require admin access
  adminRoutes: [
    '/admin',
    '/settings',
    '/users'
  ],
  // These routes require inventory manager or admin access
  inventoryRoutes: [
    '/dashboard/inventory',
    '/dashboard/products'
  ],
  // These routes require supplier manager or admin access
  supplierRoutes: [
    '/dashboard/suppliers',
    '/dashboard/orders'
  ],
  // These routes are accessible to any authenticated user
  authenticatedRoutes: [
    '/dashboard',
    '/profile',
    '/notifications'
  ]
};

/**
 * Middleware for handling frontend routes authentication
 */
export async function handleFrontendRoutes(req: NextRequest) {
  console.log("🖥️ Frontend middleware running on:", req.nextUrl.pathname);
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/verify', '/about', '/contact'];
  if (publicRoutes.some(route => req.nextUrl.pathname === route)) {
    console.log("🔓 Public frontend route accessed");
    return NextResponse.next();
  }
  
  // Static assets and resources
  if (req.nextUrl.pathname.match(/\.(css|js|jpg|png|svg|ico)$/)) {
    return NextResponse.next();
  }
  
  // Check authentication for protected routes
  const authToken = req.cookies.get("authToken")?.value || 
                    req.cookies.get("token")?.value || 
                    req.headers.get("Authorization")?.replace("Bearer ", "");
  
  console.log("🔑 Frontend auth token:", authToken ? "Present" : "Missing");
  
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
    
    const { role } = decoded;
    const currentPath = req.nextUrl.pathname;
    
    // Check role-based access
    
    // Admin routes
    if (roleBasedRoutes.adminRoutes.some(route => currentPath.startsWith(route)) && role !== 'admin') {
      console.log("🚫 Non-admin attempted to access admin route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Inventory routes
    if (roleBasedRoutes.inventoryRoutes.some(route => currentPath.startsWith(route)) && 
        !['admin', 'inventory_manager'].includes(role)) {
      console.log("🚫 Unauthorized access attempt to inventory route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Supplier routes
    if (roleBasedRoutes.supplierRoutes.some(route => currentPath.startsWith(route)) && 
        !['admin', 'supplier_manager'].includes(role)) {
      console.log("🚫 Unauthorized access attempt to supplier route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    console.log("✓ Token valid for user:", decoded.email, "with role:", role);
    return NextResponse.next();
  } catch (error) {
    console.error("🚨 Invalid token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
