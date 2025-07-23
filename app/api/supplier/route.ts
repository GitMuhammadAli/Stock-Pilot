import { withAuth } from "@/lib/middleware/withAuth";
import { supplierService } from "@/lib/services/supplierServices"; 
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

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
      console.log("Create Supplier Request Body:", body);

      const response = await supplierService.createSupplier({
        createdById: userId,
        ...body,
      });

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 201 });
      } else {
        const statusCode = response.message.includes("User not found") ? 400 : 500;
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: statusCode }
        );
      }
    }
    else if (req.method === "GET") {
      console.log("Fetching All Suppliers.");
      const response = await supplierService.getAllSuppliers();

      if (response.success) {
        return NextResponse.json({ success: true, data: response.data }, { status: 200 });
      } else {
        return NextResponse.json(
          { success: false, message: response.message, error: response.error?.message || response.error },
          { status: 500 }
        );
      }
    }
    else {
      return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Supplier API Handler Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred in the Supplier API.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Export the handlers wrapped with authentication middleware
export const POST = withAuth(handler);
export const GET = withAuth(handler);