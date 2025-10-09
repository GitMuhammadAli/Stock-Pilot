import { withAuth } from "@/lib/middleware/withAuth";
import { orderItemService } from "@/lib/services/orderItemServices"; // Import the singleton instance
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    // No specific user ID check needed here as order items are linked to orders/products,
    // and the `withAuth` middleware already ensures authentication.

    if (req.method === "POST") {
      const body = await req.json();
      console.log("Create Order Item Request Body:", body);

      // Ensure required fields for creation are present
      if (!body.orderId || !body.productId || body.quantity === undefined || body.unitPrice === undefined) {
        return NextResponse.json(
          { success: false, message: "Missing required fields: orderId, productId, quantity, and unitPrice are required." },
          { status: 400 }
        );
      }

      const response = await orderItemService.createOrderItem(body);

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 201 });
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("greater than 0") || response.message.includes("cannot be negative") ? 400 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else if (req.method === "GET") {
      console.log("Fetching All Order Items.");
      const response = await orderItemService.getAllOrderItems();

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
    console.error("Order Item API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Order Item API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
export const GET = withAuth(handler);