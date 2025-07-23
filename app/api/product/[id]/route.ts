import { withAuth } from "@/lib/middleware/withAuth";
import { ProductService } from "@/lib/services/productsServices";
import { connectDB } from "@/db/connectDb";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, _context: any, user: any) {
  try {
    await connectDB();
    const productService = new ProductService();
    const userId = user.userId;
    const productId = req.nextUrl.pathname.split("/").pop();

    if (!userId || !productId)
      return NextResponse.json({ success: false, message: "Unauthorized or missing product ID" }, { status: 401 });

    if (req.method === "GET") {
      const product = await productService.getProductById(productId);
      return NextResponse.json({ success: true, data: product }, { status: 200 });

    } else if (req.method === "PUT") {
      const updateData = await req.json();
      const updated = await productService.updateProduct(productId, updateData);
      return NextResponse.json({ success: true, data: updated }, { status: 200 });

    } else if (req.method === "DELETE") {
      await productService.deleteProduct(productId);
      return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 });

    } else {
      return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
    }
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
