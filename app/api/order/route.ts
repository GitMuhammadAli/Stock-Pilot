// app/api/order/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderService } from "@/lib/services/orderServices"; // Import the singleton instance
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb"; // Import connectDB
async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const userId = user.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: User ID not found." },
        { status: 401 }
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      console.log("Create Order Request Body:", body);

      const response = await orderService.createOrder({
        createdById: userId, // Pass the authenticated user's ID
        ...body,
      });

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 201 });
      } else {
        const statusCode = response.message.includes("not found") ? 400 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else if (req.method === "GET") {
      console.log("Fetching All Orders.");
      const response = await orderService.getAllOrders();

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Order API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Order API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
export const GET = withAuth(handler);