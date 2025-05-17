// import { NextRequest, NextResponse } from "next/server";
// import { getProductsByUser, createProduct } from "@/app/lib/services/productServices";
// import { verifyJWT } from "@/app/lib/utils/auth";

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     const decoded = verifyJWT(token);

//     const products = await getProductsByUser(decoded.userId);
//     return NextResponse.json({ success: true, data: products });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const token = req.cookies.get("token")?.value;
//     const decoded = verifyJWT(token);

//     const newProduct = await createProduct({ ...body, userId: decoded.userId });
//     return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 400 });
//   }
// }
