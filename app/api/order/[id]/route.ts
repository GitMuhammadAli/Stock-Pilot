// app/api/order/[id]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { orderService } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

interface Params {
  id: string; // Order ID
}

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const orderId =_context.params.id as string;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    if (req.method === "GET") {
      console.log(`Fetching Order with ID: ${orderId}`);
      const response = await orderService.getOrderById(orderId);

      if (response.success) {
        if (!response.data) {
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
    } else if (req.method === "PUT") {
      const body = await req.json();
      console.log(`Updating Order ID ${orderId} with data:`, body);

      const response = await orderService.updateOrder(orderId, body);

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    } else if (req.method === "DELETE") {
      console.log(`Deleting Order with ID: ${orderId}`);

      const response = await orderService.deleteOrder(orderId);

      if (response.success) {
        return NextResponse.json({ success: true, message: response.message }, { status: 200 });
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
    console.error("Order API Handler (ID) Error:", error);
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

export const GET = withAuth(handler);
export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);