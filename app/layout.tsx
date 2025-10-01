import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { connectDB } from "./db/connectDb";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import type React from "react";
import { Inter } from "next/font/google";
import { WarehouseProvider } from "./providers/wareHouseProvider";
import { SupplierProvider } from "./providers/supplierProvider";
import { ProductProvider } from "./providers/productProvider";
import { OrderItemProvider } from "./providers/orderItemProvider";
import { OrderProvider } from "./providers/orderProvider";

const inter = Inter({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StockPilot - Intelligent Inventory Management",
  description:
    "Optimize your inventory, reduce costs, and prevent stockouts with StockPilot",
};

// Initialize database connection when the app starts
connectDB().catch(console.error);
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className} min-h-screen`}
      >
        <AuthProvider>
          <WarehouseProvider>
            <ProductProvider>
              <OrderProvider>
                <OrderItemProvider>
                  <SupplierProvider>{children}</SupplierProvider>
                </OrderItemProvider>
              </OrderProvider>
            </ProductProvider>
          </WarehouseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
