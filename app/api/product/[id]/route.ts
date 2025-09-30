import { withAuth } from "@/lib/middleware/withAuth";
import { ProductService } from "@/lib/services/productsServices";
import { connectDB } from "@/db/connectDb";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const productService = new ProductService();
    const userId = user.id;
    const productId = req.nextUrl.pathname.split("/").pop();

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or missing product ID" },
        { status: 401 }
      );
    }

    if (req.method === "GET") {
      const productResponse = await productService.getProductById(productId);
      return NextResponse.json(productResponse, {
        status: productResponse.success ? 200 : 404,
      });
    }

    if (req.method === "PUT") {
      const updateData = await req.json();
      const updateResponse = await productService.updateProduct(productId, updateData);
      return NextResponse.json(updateResponse, {
        status: updateResponse.success ? 200 : 400,
      });
    }

    if (req.method === "DELETE") {
      const deleteResponse = await productService.deleteProduct(productId);
      return NextResponse.json(deleteResponse, {
        status: deleteResponse.success ? 200 : 404,
      });
    }

    return NextResponse.json(
      { success: false, message: "Method Not Allowed" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);
