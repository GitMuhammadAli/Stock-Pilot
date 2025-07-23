// app/api/order/[id]/status/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderService } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";
import { OrderStatus } from "@/db/entities/order"; // Import OrderStatus enum

interface Params {
  id: string; // Order ID
}

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const orderId = _context.params.id as string;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    if (req.method === "PUT") {
      const { status }: { status: OrderStatus } = await req.json(); // Expecting a 'status' field in the body

      // Validate if the provided status is a valid OrderStatus enum value
      if (!status || !Object.values(OrderStatus).includes(status)) {
        return NextResponse.json(
          { success: false, message: `Invalid or missing 'status' in request body. Must be one of: ${Object.values(OrderStatus).join(', ')}.` },
          { status: 400 }
        );
      }

      console.log(`Updating Order ID ${orderId} status to: ${status}`);
      const response = await orderService.updateOrderStatus(orderId, status);

      if (response.success) {
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
    console.error("Update Order Status API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Update Order Status API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(handler);