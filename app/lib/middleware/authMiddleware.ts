import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthService } from "@/lib/services/authServices";
import { connectDB } from "@/db/connectDb";

dotenv.config();

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified: boolean;
}

export async function authMiddleware(req: NextRequest) {
  try {
    await connectDB();
    const token =
      req.cookies.get("authToken")?.value ||
      (req.headers.get("authorization")?.startsWith("Bearer ")
        ? req.headers.get("authorization")?.split(" ")[1]
        : null);

    if (!token) {
      console.log("i am inside token");
      const response = NextResponse.redirect(new URL("/", req.url));
      return response;
    }

    console.log("i am token in auth", token);
    const secret = process.env.JWT_SECRET || "mysecret";
    const decoded = jwt.verify(token, secret) as DecodedToken;
    console.log("decoded token", decoded);

    // ✅ Add an explicit check for the userId
    if (!decoded || !decoded.userId) {
      console.log("Invalid decoded token or missing userId");
      const response = NextResponse.redirect(new URL("/", req.url));
      return response;
    }
    console.log("i am token in auth", decoded);

    // ✅ Use the correct property: decoded.userId
    const authService = new AuthService();
    const user = await authService.userExists({ id: decoded.userId });
    console.log("i am inside user after authmiddlware", user);
    if (!user) {
      console.log("User not found in the database");
      const response = NextResponse.redirect(new URL("/", req.url));
      return response;
    }

    return { user };
  } catch (error) {
    console.log("i am inside catch");
    console.error("Authentication error:", error);
    const response = NextResponse.redirect(new URL("/", req.url));
    return response;
  }
}

















// export async function authMiddleware(req: NextRequest) {
//   try {
//     await connectDB(); // Ensure DB is ready
    
//     const token = req.cookies.get("authToken")?.value;
//     if (!token) {
//       console.log("No token found");
//       return redirectToLogin(req);
//     }

//     // Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
//     if (!decoded?.id) {
//       console.log("Invalid token payload");
//       return redirectToLogin(req);
//     }

//     // Fetch user
//     const authService = new AuthService();
//     const user = await authService.userExists({ id: decoded.id });
//     console.log(user)
    
//     if (!user) {
//       console.log("User not found in database");
//       return redirectToLogin(req);
//     }

//     // Verify user is active
//     if (!user.isVerified) {
//       console.log("User not verified");
//       return redirectToLogin(req);
//     }

//     return { user };
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return redirectToLogin(req);
//   }
// }

// function redirectToLogin(req: NextRequest) {
//   const response = NextResponse.redirect(new URL("/login", req.url));
//   response.cookies.delete("authToken");
//   return response;
// }