// app/api/order-item/[id]/total/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderItemService } from "@/lib/services/orderItemServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

interface Params {
  id: string; // Order Item ID
}

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const orderItemId = _context.params.id as string;

    if (!orderItemId) {
      return NextResponse.json(
        { success: false, message: "Order Item ID is required." },
        { status: 400 }
      );
    }

    if (req.method === "GET") {
      console.log(`Calculating total for Order Item ID: ${orderItemId}`);
      const response = await orderItemService.calculateOrderItemTotal(orderItemId);

      if (response.success) {
        if (!response.data) { // Check if data is null (order item not found)
          return NextResponse.json({ success: false, message: response.message }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Calculate Order Item Total API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Calculate Order Item Total API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);