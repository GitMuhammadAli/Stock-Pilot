// app/api/supplier/[id]/route.ts
import { withAuth } from "@/lib/middleware/withAuth";
import { supplierService } from "@/lib/services/supplierServices";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connectDb";

// Unified handler for GET, PUT, and DELETE requests to /api/supplier/[id]
async function supplierIdHandler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const supplierId = req.nextUrl.pathname.split("/").pop();

    if (!supplierId) {
      return NextResponse.json(
        { success: false, message: "Supplier ID is required." },
        { status: 400 }
      );
    }

    const { method } = req;
    const userId = user.id;

    if (method === "GET") {
      console.log(`Fetching Supplier with ID: ${supplierId}`);
      // Use getSupplierByIdAndUser to ensure the user has access to this supplier
      const response = await supplierService.getSupplierByIdAndUser(supplierId, userId);
      
      if (response.success) {
        if (!response.data) {
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
        const statusCode = response.message.includes("not found") || response.message.includes("not authorized") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    } else if (method === "PUT") {
      const body = await req.json();
      console.log(`Updating Supplier ID ${supplierId} with data:`, body);
      // Use updateSupplierAndUser to ensure the user is authorized to update
      const response = await supplierService.updateSupplierAndUser(supplierId, userId, body);

      if (response.success) {
        return NextResponse.json(
          { success: true, data: response.data },
          { status: 200 }
        );
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("not authorized") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
          { status: statusCode }
        );
      }
    } else if (method === "DELETE") {
      console.log(`Deleting Supplier with ID: ${supplierId}`);
      // Use deleteSupplierAndUser to ensure the user is authorized to delete
      const response = await supplierService.deleteSupplierAndUser(supplierId, userId);

      if (response.success) {
        return NextResponse.json(
          { success: true, message: response.message },
          { status: 200 }
        );
      } else {
        const statusCode = response.message.includes("not found") || response.message.includes("not authorized") ? 404 : 500;
        return NextResponse.json(
          {
            success: false,
            message: response.message,
            error: response.error?.message || response.error,
          },
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

export const GET = withAuth(supplierIdHandler);
export const PUT = withAuth(supplierIdHandler);
export const DELETE = withAuth(supplierIdHandler);