import { withAuth } from "@/lib/middleware/withAuth";
import { ProductService } from "@/lib/services/productsServices";
import { connectDB } from "@/db/connectDb";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, res: NextResponse, user: any) {
  try {
    await connectDB();
    const productService = new ProductService();
    const userId = user.userId;

    if (!userId)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (req.method === "POST") {
      const body = await req.json();
      const product = await productService.createProduct({ ...body, createdById: userId });
      return NextResponse.json({ success: true, data: product }, { status: 201 });
    } else if (req.method === "GET") {
      const products = await productService.getProductsByUser(userId);
      return NextResponse.json({ success: true, data: products }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error("Product API Error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
