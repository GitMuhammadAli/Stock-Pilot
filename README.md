# Inventory & Supply Chain Tracker SaaS

## 📌 Project Overview

### 💡 Purpose:
Your Inventory & Supply Chain Tracker SaaS is designed to help businesses manage inventory, track supply chains, and optimize stock levels efficiently.<br>

### 🚀 Core Features:<br>
1️⃣ Authentication & Security (Login, Tokens, Role Management) ✅ (Completed Phase 1, Moving to Phase 2)<br>
2️⃣ Inventory Management (Products, Stock Levels, Categories, Alerts)<br>
3️⃣ Supply Chain Tracking (Orders, Suppliers, Shipment Tracking)<br>
4️⃣ Barcode Scanning & SKU System (Scan & Manage Inventory Fast)(Optional)<br>
5️⃣ Reporting & Analytics (Sales Reports, Low Stock Alerts)<br>
6️⃣ Multi-Tenant SaaS Model (Multiple businesses, separate data)<br>
7️⃣ Admin Panel & User Management (Role-based access)(Optional)<br>
8️⃣ Notifications & Real-time Updates (Web-push, Email Alerts)<br>


## 📌 Roadmap & Development Flow<br>

### ✅ Phase 1: Authentication & Security (Completed)<br>
- User login/registration<br>
- Secure cookies & JWT-based auth<br>
- Route protection middleware<br>

### 🚀 Phase 2: Inventory Management (Start Now)<br>
💡 **Goal:** Allow users to manage inventory, add/edit products, set stock levels.<br>
✅ **Steps:**<br>
1️⃣ Create Inventory Entity & Migration (TypeORM)<br>
2️⃣ API for CRUD Operations (Create, Read, Update, Delete Products)<br>
3️⃣ Stock Level & Quantity Tracking<br>
4️⃣ Categories & Tags for Products<br>
5️⃣ UI Dashboard to View Inventory<br>

### 🔥 Phase 3: Supply Chain Tracking<br>
💡 **Goal:** Track orders, suppliers, and shipments<br>
✅ **Steps:**<br>
1️⃣ Create Order & Supplier Entities<br>
2️⃣ Supplier Management (CRUD APIs & UI)<br>


### 📦 Phase 4: Advanced Features & SaaS Setup(Optional)<br>
💡 **Goal:** Enable multi-tenant support, advanced reporting, & automation<br>
✅ **Steps:**<br>
1️⃣ Multi-Tenant SaaS Setup (Separate data for businesses)(Optional)<br>
2️⃣ Reporting & Analytics (Sales, Low Stock, Alerts)<br>
3️⃣ Role-Based Access (Admin, Manager, Staff)<br>
4️⃣ Email & Web Push Notifications<br>
5️⃣ Payment Gateway Integration (For SaaS subscription plans)<br>


---

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:7700](http://localhost:7700) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
