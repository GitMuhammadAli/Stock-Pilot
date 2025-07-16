import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { WareHouse } from "../entities/wareHouse";
import { Supplier } from "../entities/supplier";
import { Product } from "../entities/products";
import { Order, OrderStatus } from "../entities/order";
import { OrderItem } from "../entities/orderItem";

async function seed() {
  await AppDataSource.initialize();
  console.log("📦 Database connected for seeding");

  const userId = "d3ea5966-0b8e-4aac-9fae-d700ec5a99de"; // Fetch user by ID

  const user = await AppDataSource.manager.findOne(User, {
    where: { id: userId },
  });
  if (!user) {
    console.error(`❌ No user found with ID: ${userId}`);
    process.exit(1);
  } // Clear tables

  try {
    console.log("🗑️ Clearing existing data...");
    await AppDataSource.manager.clear(OrderItem);
    await AppDataSource.manager.clear(Order);
    await AppDataSource.manager.clear(Product);
    await AppDataSource.manager.clear(Supplier);
    await AppDataSource.manager.clear(WareHouse);
  } catch (error) {
    console.log("⚠️ Fallback: Using CASCADE...");
    await AppDataSource.manager.query(
      'TRUNCATE TABLE "order_item", "order", "product", "supplier", "ware_house" CASCADE'
    );
  } // Create Warehouses

  console.log("🏢 Seeding warehouses...");
  const warehouses = await Promise.all([
    AppDataSource.manager.save(WareHouse, {
      name: "Karachi Central",
      location: "Korangi, Karachi",
      capacity: 1000,
      currentOccupancy: 500,
      createdById: user.id,
    }),
    AppDataSource.manager.save(WareHouse, {
      name: "Lahore Depot",
      location: "Johar Town, Lahore",
      capacity: 800,
      currentOccupancy: 300,
      createdById: user.id,
    }),
  ]); // Create Suppliers

  console.log("🏭 Seeding suppliers...");
  const suppliers = await Promise.all([
    AppDataSource.manager.save(Supplier, {
      name: "PakTech Supplies",
      email: "contact@paktech.pk",
      phone: "03011234567",
      address: "PECHS Block 2, Karachi",
      createdById: user.id,
    }),
    AppDataSource.manager.save(Supplier, {
      name: "Lahore Traders",
      email: "info@lahoretraders.pk",
      phone: "03021234567",
      address: "Model Town, Lahore",
      createdById: user.id,
    }),
  ]); // Create Products

  console.log("📦 Seeding products...");
  const products = await Promise.all([
    AppDataSource.manager.save(Product, {
      name: "LED TV",
      sku: "TV-001",
      price: 58000,
      quantity: 30,
      category: "Electronics",
      supplier: suppliers[0],
      supplierId: suppliers[0].id,
      warehouse: warehouses[0],
      warehouseId: warehouses[0].id,
      createdById: user.id,
    }),
    AppDataSource.manager.save(Product, {
      name: "Office Chair",
      sku: "CHR-001",
      price: 12000,
      quantity: 50,
      category: "Furniture",
      supplier: suppliers[1],
      supplierId: suppliers[1].id,
      warehouse: warehouses[1],
      warehouseId: warehouses[1].id,
      createdById: user.id,
    }),
  ]); // Create Orders

  console.log("📋 Seeding orders...");
  const orders = await Promise.all([
    AppDataSource.manager.save(Order, {
      orderNumber: "ORD-PK-001",
      status: OrderStatus.PENDING,
      supplier: suppliers[0],
      supplierId: suppliers[0].id,
      warehouse: warehouses[0],
      warehouseId: warehouses[0].id,
      createdById: user.id,
    }),
    AppDataSource.manager.save(Order, {
      orderNumber: "ORD-PK-002",
      status: OrderStatus.SHIPPED,
      supplier: suppliers[1],
      supplierId: suppliers[1].id,
      warehouse: warehouses[1],
      warehouseId: warehouses[1].id,
      createdById: user.id,
    }),
  ]); // Create Order Items

  console.log("📝 Seeding order items...");
  await Promise.all([
    AppDataSource.manager.save(OrderItem, {
      orderId: orders[0].id,
      productId: products[0].id,
      quantity: 3,
      unitPrice: products[0].price,
    }),
    AppDataSource.manager.save(OrderItem, {
      orderId: orders[1].id,
      productId: products[1].id,
      quantity: 2,
      unitPrice: products[1].price,
    }),
  ]);

  console.log("✅ All data seeded to user:", user.email);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});
