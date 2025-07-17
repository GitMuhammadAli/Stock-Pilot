// app/api/supplier/[id]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { supplierService } from "@/lib/services/supplierServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

async function handler(req: NextRequest, user: any) {
  try {
    await connectDB();
    const supplierId = req.nextUrl.pathname.split("/").pop();
    const userId = user.userId;
    if (!supplierId) {
      return NextResponse.json(
        { success: false, message: "Supplier ID is required." },
        { status: 400 }
      );
    }
    // Handle GET request (Get Supplier by ID)
    if (req.method === "GET") {
      console.log(`Fetching Supplier with ID: ${supplierId}`);
      const response = await supplierService.getSupplierById(supplierId);
      if (response.success) {
        if (!response.data) {
          // Explicitly check for null data when not found
          return NextResponse.json(
            { success: false, message: response.message },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { success: true, data: response.data },
          { status: 200 }
        );
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    }
    // Handle PUT request (Update Supplier)
    else if (req.method === "PUT") {
      const body = await req.json();
      console.log(`Updating Supplier ID ${supplierId} with data:`, body);

      const response = await supplierService.updateSupplier(supplierId, body);

      if (response.success) {
        return NextResponse.json(
          { success: true, data: response.data },
          { status: 200 }
        );
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    }
    // Handle DELETE request (Delete Supplier)
    else if (req.method === "DELETE") {
      console.log(`Deleting Supplier with ID: ${supplierId}`);

      const response = await supplierService.deleteSupplier(supplierId);

      if (response.success) {
        return NextResponse.json(
          { success: true, message: response.message },
          { status: 200 }
        );
      } else {
        const statusCode = response.message.includes("not found") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    }
    // Handle unsupported methods
    else {
      return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Supplier API Handler (ID) Error:", error);
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

export const GET = withAuth(handler);
export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);
