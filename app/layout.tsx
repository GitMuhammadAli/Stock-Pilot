import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/providers/AuthProvider';
import { connectDB } from "./db/connectDb";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import type React from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StockPilot - Intelligent Inventory Management",
  description: "Optimize your inventory, reduce costs, and prevent stockouts with StockPilot",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectDB();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

