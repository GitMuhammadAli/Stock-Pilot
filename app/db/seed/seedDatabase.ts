import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User, UserRole, UserStatus } from "../entities/User";
import { WareHouse, WarehouseStatus } from "../entities/wareHouse";
import { Supplier, SupplierStatus, SupplierTier } from "../entities/supplier";
import { Product, ProductStatus, ProductCondition } from "../entities/products";
import {
  Order,
  OrderStatus,
  OrderType,
  PaymentStatus,
} from "../entities/order";
import { OrderItem, OrderItemStatus } from "../entities/orderItem";

async function seed() {
  await AppDataSource.initialize();
  console.log("📦 Database connected for seeding");

  try {
    // Clear all tables in correct order (respecting foreign keys)
    console.log("🗑️ Clearing existing data...");
    await AppDataSource.manager.clear(OrderItem);
    await AppDataSource.manager.clear(Order);
    await AppDataSource.manager.clear(Product);
    await AppDataSource.manager.clear(Supplier);
    await AppDataSource.manager.clear(WareHouse);
    await AppDataSource.manager.clear(User);
    console.log("✅ Existing data cleared");
  } catch (error) {
    console.log("⚠️ Fallback: Using CASCADE...");
    try {
      await AppDataSource.manager.query(
        'TRUNCATE TABLE "order_items", "orders", "products", "suppliers", "warehouses", "users" CASCADE'
      );
    } catch (truncateError) {
      console.log("⚠️ Manual deletion...");
      await AppDataSource.manager.query('DELETE FROM "order_items"');
      await AppDataSource.manager.query('DELETE FROM "orders"');
      await AppDataSource.manager.query('DELETE FROM "products"');
      await AppDataSource.manager.query('DELETE FROM "suppliers"');
      await AppDataSource.manager.query('DELETE FROM "warehouses"');
      await AppDataSource.manager.query('DELETE FROM "users"');
    }
  }

  // ===== SEED USERS =====
  console.log("👥 Seeding users...");
  const users = await Promise.all([
    // Admin User
    AppDataSource.manager.save(User, {
      name: "Ahmad Hassan",
      email: "admin@warehousepk.com",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: "dark",
        language: "en",
        notifications: true,
      },
    }),

    // Manager Users
    AppDataSource.manager.save(User, {
      name: "Fatima Khan",
      email: "fatima.manager@warehousepk.com",
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      preferences: {
        theme: "light",
        language: "ur",
        notifications: true,
        dashboardLayout: "compact",
      },
    }),

    AppDataSource.manager.save(User, {
      name: "Ali Raza",
      email: "ali.manager@warehousepk.com",
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      preferences: {
        theme: "light",
        language: "en",
        notifications: false,
      },
    }),

    // Staff Users
    AppDataSource.manager.save(User, {
      name: "Sana Malik",
      email: "sana.staff@warehousepk.com",
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      preferences: {
        theme: "light",
        language: "en",
      },
    }),

    AppDataSource.manager.save(User, {
      name: "Muhammad Tariq",
      email: "tariq.staff@warehousepk.com",
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    }),

    AppDataSource.manager.save(User, {
      name: "Ayesha Iqbal",
      email: "ayesha.staff@warehousepk.com",
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    }),

    // Viewer User
    AppDataSource.manager.save(User, {
      name: "Hassan Ahmed",
      email: "hassan.viewer@warehousepk.com",
      role: UserRole.VIEWER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    }),

    // Inactive User (for testing)
    AppDataSource.manager.save(User, {
      name: "Zain Ali",
      email: "zain.inactive@warehousepk.com",
      role: UserRole.STAFF,
      status: UserStatus.INACTIVE,
      isVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Extract user references for easier access
  const [
    admin,
    managerFatima,
    managerAli,
    staffSana,
    staffTariq,
    staffAyesha,
    viewer,
    inactiveUser,
  ] = users;

  // ===== SEED WAREHOUSES =====
  console.log("🏢 Seeding warehouses...");
  const warehouses = await Promise.all([
    AppDataSource.manager.save(WareHouse, {
      name: "Karachi Central Warehouse",
      location: "Korangi Industrial Area, Karachi, Sindh",
      description: "Main distribution center for Karachi and surrounding areas",
      capacity: 2500,
      currentOccupancy: 1800,
      status: WarehouseStatus.ACTIVE,
      contactPhone: "021-35123456",
      contactEmail: "karachi@warehousepk.com",
      latitude: 24.8607,
      longitude: 67.0011,
      operatingHours: {
        monday: { open: "08:00", close: "18:00" },
        tuesday: { open: "08:00", close: "18:00" },
        wednesday: { open: "08:00", close: "18:00" },
        thursday: { open: "08:00", close: "18:00" },
        friday: { open: "08:00", close: "17:00" },
        saturday: { open: "09:00", close: "15:00" },
      },
      createdById: admin.id,
    }),

    AppDataSource.manager.save(WareHouse, {
      name: "Lahore Distribution Hub",
      location: "Sundar Industrial Estate, Lahore, Punjab",
      description: "Regional hub serving Punjab and KPK",
      capacity: 2000,
      currentOccupancy: 1200,
      status: WarehouseStatus.ACTIVE,
      contactPhone: "042-36789123",
      contactEmail: "lahore@warehousepk.com",
      latitude: 31.5204,
      longitude: 74.3587,
      operatingHours: {
        monday: { open: "07:30", close: "19:00" },
        tuesday: { open: "07:30", close: "19:00" },
        wednesday: { open: "07:30", close: "19:00" },
        thursday: { open: "07:30", close: "19:00" },
        friday: { open: "07:30", close: "18:00" },
        saturday: { open: "08:00", close: "16:00" },
      },
      createdById: managerFatima.id,
    }),

    AppDataSource.manager.save(WareHouse, {
      name: "Islamabad Logistics Center",
      location: "I-9 Industrial Area, Islamabad",
      description: "Specialized center for government and corporate orders",
      capacity: 1500,
      currentOccupancy: 800,
      status: WarehouseStatus.ACTIVE,
      contactPhone: "051-4567890",
      contactEmail: "islamabad@warehousepk.com",
      latitude: 33.6844,
      longitude: 73.0479,
      createdById: managerAli.id,
    }),

    AppDataSource.manager.save(WareHouse, {
      name: "Faisalabad Textile Storage",
      location: "Sargodha Road, Faisalabad, Punjab",
      description: "Specialized storage for textile and fabric products",
      capacity: 1800,
      currentOccupancy: 1600,
      status: WarehouseStatus.ACTIVE,
      contactPhone: "041-8765432",
      contactEmail: "faisalabad@warehousepk.com",
      createdById: staffSana.id,
    }),

    AppDataSource.manager.save(WareHouse, {
      name: "Quetta Cold Storage",
      location: "Brewery Road, Quetta, Balochistan",
      description: "Cold storage facility for perishable goods",
      capacity: 1000,
      currentOccupancy: 650,
      status: WarehouseStatus.MAINTENANCE,
      contactPhone: "081-2876543",
      contactEmail: "quetta@warehousepk.com",
      createdById: staffTariq.id,
    }),
  ]);

  console.log(`✅ Created ${warehouses.length} warehouses`);

  // ===== SEED SUPPLIERS =====
  console.log("🏭 Seeding suppliers...");
  const suppliers = await Promise.all([
    AppDataSource.manager.save(Supplier, {
      name: "PakTech Electronics Ltd",
      email: "procurement@paktech.com.pk",
      phone: "03001234567",
      address: "Plot 45-B, SITE Area, Karachi, Sindh",
      contactPerson: "Mr. Kamran Sheikh",
      website: "https://www.paktech.com.pk",
      notes: "Premium electronics supplier with 15+ years experience",
      status: SupplierStatus.ACTIVE,
      tier: SupplierTier.PREMIUM,
      creditLimit: 5000000.0,
      currentBalance: 850000.0,
      rating: 4.8,
      totalOrders: 142,
      totalOrderValue: 12500000.0,
      paymentTerms: 45,
      taxId: "NTN-8765432",
      contractStartDate: new Date("2023-01-01"),
      contractEndDate: new Date("2025-12-31"),
      createdById: admin.id,
    }),

    AppDataSource.manager.save(Supplier, {
      name: "Lahore Furniture House",
      email: "orders@lahorefurniture.pk",
      phone: "03012345678",
      address: "Gulberg III, Main Boulevard, Lahore, Punjab",
      contactPerson: "Ms. Zara Khan",
      website: "https://www.lahorefurniture.pk",
      notes: "Quality furniture manufacturer and supplier",
      status: SupplierStatus.ACTIVE,
      tier: SupplierTier.STANDARD,
      creditLimit: 2000000.0,
      currentBalance: 350000.0,
      rating: 4.2,
      totalOrders: 87,
      totalOrderValue: 6800000.0,
      paymentTerms: 30,
      taxId: "NTN-1234567",
      contractStartDate: new Date("2023-06-01"),
      contractEndDate: new Date("2024-12-31"),
      createdById: managerFatima.id,
    }),

    AppDataSource.manager.save(Supplier, {
      name: "Sindh Textile Mills",
      email: "sales@sindhtextile.com",
      phone: "03023456789",
      address: "Textile City, Karachi, Sindh",
      contactPerson: "Mr. Abdul Rahman",
      website: "https://www.sindhtextile.com",
      notes: "Large-scale textile manufacturer",
      status: SupplierStatus.ACTIVE,
      tier: SupplierTier.PREMIUM,
      creditLimit: 8000000.0,
      currentBalance: 1200000.0,
      rating: 4.6,
      totalOrders: 203,
      totalOrderValue: 18500000.0,
      paymentTerms: 60,
      taxId: "NTN-2468135",
      contractStartDate: new Date("2022-03-01"),
      contractEndDate: new Date("2025-02-28"),
      createdById: managerAli.id,
    }),

    AppDataSource.manager.save(Supplier, {
      name: "Islamabad Office Solutions",
      email: "info@islamabadoffice.pk",
      phone: "03034567890",
      address: "Blue Area, Islamabad",
      contactPerson: "Dr. Sarah Ahmed",
      website: "https://www.islamabadoffice.pk",
      notes: "Office equipment and supplies specialist",
      status: SupplierStatus.ACTIVE,
      tier: SupplierTier.STANDARD,
      creditLimit: 1500000.0,
      currentBalance: 245000.0,
      rating: 4.0,
      totalOrders: 56,
      totalOrderValue: 3200000.0,
      paymentTerms: 30,
      taxId: "NTN-9876543",
      createdById: staffSana.id,
    }),

    AppDataSource.manager.save(Supplier, {
      name: "Punjab Agricultural Supplies",
      email: "contact@punjabagsupply.com",
      phone: "03045678901",
      address: "Canal Road, Faisalabad, Punjab",
      contactPerson: "Malik Usman Ali",
      notes: "Agricultural tools and equipment supplier",
      status: SupplierStatus.ACTIVE,
      tier: SupplierTier.BASIC,
      creditLimit: 800000.0,
      currentBalance: 125000.0,
      rating: 3.8,
      totalOrders: 34,
      totalOrderValue: 1650000.0,
      paymentTerms: 30,
      taxId: "NTN-5432167",
      createdById: staffTariq.id,
    }),

    AppDataSource.manager.save(Supplier, {
      name: "Quetta Traders Co.",
      email: "admin@quettatraders.pk",
      phone: "03056789012",
      address: "Jinnah Road, Quetta, Balochistan",
      contactPerson: "Mr. Hassan Baloch",
      notes: "General trading company",
      status: SupplierStatus.PENDING_APPROVAL,
      tier: SupplierTier.BASIC,
      creditLimit: 500000.0,
      currentBalance: 0.0,
      rating: 0.0,
      totalOrders: 0,
      totalOrderValue: 0.0,
      paymentTerms: 15,
      taxId: "NTN-7654321",
      createdById: staffAyesha.id,
    }),
  ]);

  console.log(`✅ Created ${suppliers.length} suppliers`);

  // ===== SEED PRODUCTS =====
  console.log("📦 Seeding products...");
  const products = await Promise.all([
    // Electronics from PakTech
    AppDataSource.manager.save(Product, {
      name: 'Samsung 55" 4K Smart LED TV',
      description: "Ultra HD Smart TV with HDR support and built-in WiFi",
      sku: "TV-SAM-55-001",
      barcode: "8801643721835",
      quantity: 45,
      category: "Electronics",
      subCategory: "Television",
      brand: "Samsung",
      model: "UA55AU7000",
      price: 125000.0,
      costPrice: 98000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 10,
      maxStockLevel: 100,
      reorderPoint: 15,
      weight: 13.4,
      dimensions: { length: 123.1, width: 70.7, height: 7.8, unit: "cm" },
      totalSold: 128,
      totalRevenue: 16000000.0,
      supplierId: suppliers[0].id,
      warehouseId: warehouses[0].id,
      createdById: admin.id,
    }),

    AppDataSource.manager.save(Product, {
      name: "iPhone 14 Pro Max 256GB",
      description: "Latest iPhone with A16 Bionic chip and Pro camera system",
      sku: "PHN-APL-14PM-256",
      barcode: "194253405894",
      quantity: 22,
      category: "Electronics",
      subCategory: "Mobile Phone",
      brand: "Apple",
      model: "iPhone 14 Pro Max",
      price: 485000.0,
      costPrice: 420000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 5,
      maxStockLevel: 50,
      reorderPoint: 8,
      weight: 0.24,
      dimensions: { length: 16.07, width: 7.85, height: 0.78, unit: "cm" },
      totalSold: 89,
      totalRevenue: 43165000.0,
      supplierId: suppliers[0].id,
      warehouseId: warehouses[0].id,
      createdById: managerFatima.id,
    }),

    // Furniture from Lahore Furniture House
    AppDataSource.manager.save(Product, {
      name: "Executive Office Chair Premium",
      description:
        "High-back executive chair with lumbar support and leather upholstery",
      sku: "CHR-EXE-001",
      quantity: 35,
      category: "Furniture",
      subCategory: "Office Chair",
      brand: "ComfortMax",
      model: "EX-2024",
      price: 28500.0,
      costPrice: 20000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 8,
      maxStockLevel: 60,
      reorderPoint: 12,
      weight: 18.5,
      dimensions: { length: 70, width: 68, height: 118, unit: "cm" },
      totalSold: 234,
      totalRevenue: 6669000.0,
      supplierId: suppliers[1].id,
      warehouseId: warehouses[1].id,
      createdById: managerAli.id,
    }),

    AppDataSource.manager.save(Product, {
      name: "6-Seater Dining Set Walnut",
      description: "Solid wood dining table with 6 matching chairs",
      sku: "DIN-SET-6W-001",
      quantity: 12,
      category: "Furniture",
      subCategory: "Dining Set",
      brand: "WoodCraft",
      model: "WC-DS-6W",
      price: 85000.0,
      costPrice: 62000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 3,
      maxStockLevel: 20,
      reorderPoint: 5,
      weight: 95.0,
      dimensions: { length: 180, width: 90, height: 75, unit: "cm" },
      totalSold: 67,
      totalRevenue: 5695000.0,
      supplierId: suppliers[1].id,
      warehouseId: warehouses[3].id,
      createdById: staffSana.id,
    }),

    // Textiles from Sindh Textile Mills
    AppDataSource.manager.save(Product, {
      name: "Premium Cotton Bed Sheet Set",
      description: "300 thread count cotton bed sheet set with 2 pillow covers",
      sku: "BED-COT-PRM-001",
      quantity: 150,
      category: "Textiles",
      subCategory: "Bed Linen",
      brand: "SindhCotton",
      model: "SC-BS-300",
      price: 4500.0,
      costPrice: 2800.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 30,
      maxStockLevel: 300,
      reorderPoint: 50,
      weight: 1.2,
      dimensions: { length: 30, width: 25, height: 8, unit: "cm" },
      totalSold: 456,
      totalRevenue: 2052000.0,
      supplierId: suppliers[2].id,
      warehouseId: warehouses[3].id,
      createdById: staffTariq.id,
    }),

    // Office Supplies from Islamabad Office Solutions
    AppDataSource.manager.save(Product, {
      name: "HP LaserJet Pro M404dn Printer",
      description: "Monochrome laser printer with duplex printing",
      sku: "PRT-HP-M404DN",
      barcode: "194441171895",
      quantity: 18,
      category: "Office Equipment",
      subCategory: "Printer",
      brand: "HP",
      model: "LaserJet Pro M404dn",
      price: 42000.0,
      costPrice: 35000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 5,
      maxStockLevel: 30,
      reorderPoint: 8,
      weight: 8.9,
      dimensions: { length: 35.7, width: 21.6, height: 36, unit: "cm" },
      totalSold: 95,
      totalRevenue: 3990000.0,
      supplierId: suppliers[3].id,
      warehouseId: warehouses[2].id,
      createdById: staffAyesha.id,
    }),

    AppDataSource.manager.save(Product, {
      name: "Dell Inspiron 15 3000 Laptop",
      description: '15.6" laptop with Intel Core i5, 8GB RAM, 256GB SSD',
      sku: "LAP-DEL-I15-3000",
      barcode: "884116363583",
      quantity: 8,
      category: "Electronics",
      subCategory: "Laptop",
      brand: "Dell",
      model: "Inspiron 15 3000",
      price: 95000.0,
      costPrice: 78000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 3,
      maxStockLevel: 25,
      reorderPoint: 5,
      weight: 1.83,
      dimensions: { length: 35.8, width: 24.7, height: 1.99, unit: "cm" },
      totalSold: 156,
      totalRevenue: 14820000.0,
      supplierId: suppliers[3].id,
      warehouseId: warehouses[2].id,
      createdById: viewer.id,
    }),

    // Agricultural supplies
    AppDataSource.manager.save(Product, {
      name: "Agricultural Tractor Tyres 18.4-34",
      description: "Heavy-duty agricultural tractor rear tyres",
      sku: "TYR-AGR-1834",
      quantity: 24,
      category: "Agricultural",
      subCategory: "Tyres",
      brand: "FarmMax",
      model: "FM-AG-1834",
      price: 35000.0,
      costPrice: 26000.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 6,
      maxStockLevel: 40,
      reorderPoint: 10,
      weight: 86.5,
      dimensions: { length: 120, width: 120, height: 50, unit: "cm" },
      totalSold: 78,
      totalRevenue: 2730000.0,
      supplierId: suppliers[4].id,
      warehouseId: warehouses[3].id,
      createdById: admin.id,
    }),

    // Low stock item for testing
    AppDataSource.manager.save(Product, {
      name: "Wireless Bluetooth Headphones",
      description: "Premium wireless headphones with noise cancellation",
      sku: "HDP-WRL-BT-001",
      barcode: "889842123456",
      quantity: 3, // Low stock for testing
      category: "Electronics",
      subCategory: "Headphones",
      brand: "SoundMax",
      model: "SM-BT-2024",
      price: 12500.0,
      costPrice: 8500.0,
      status: ProductStatus.ACTIVE,
      condition: ProductCondition.NEW,
      minStockLevel: 15,
      maxStockLevel: 80,
      reorderPoint: 20,
      weight: 0.28,
      dimensions: { length: 18, width: 15, height: 7, unit: "cm" },
      totalSold: 267,
      totalRevenue: 3337500.0,
      supplierId: suppliers[0].id,
      warehouseId: warehouses[0].id,
      createdById: managerFatima.id,
    }),

    // Out of stock item
    AppDataSource.manager.save(Product, {
      name: "Gaming Mouse RGB",
      description: "High-precision gaming mouse with RGB lighting",
      sku: "MSE-GAM-RGB-001",
      quantity: 0, // Out of stock
      category: "Electronics",
      subCategory: "Computer Accessories",
      brand: "GamePro",
      model: "GP-M-RGB",
      price: 8500.0,
      costPrice: 5200.0,
      status: ProductStatus.OUT_OF_STOCK,
      condition: ProductCondition.NEW,
      minStockLevel: 20,
      maxStockLevel: 100,
      reorderPoint: 25,
      weight: 0.12,
      totalSold: 189,
      totalRevenue: 1606500.0,
      supplierId: suppliers[0].id,
      warehouseId: warehouses[1].id,
      createdById: staffSana.id,
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // ===== SEED ORDERS =====
  console.log("📋 Seeding orders...");
  const orders = await Promise.all([
    // Recent active order
    AppDataSource.manager.save(Order, {
      orderNumber: "PO-2024-001",
      status: OrderStatus.PENDING,
      type: OrderType.PURCHASE,
      paymentStatus: PaymentStatus.PENDING,
      orderDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      subtotal: 250000.0,
      taxAmount: 40000.0,
      shippingCost: 5000.0,
      totalAmount: 295000.0,
      notes: "Urgent order for electronics",
      priority: "high",
      isRushOrder: true,
      shippingAddress: {
        street: "Main Warehouse, Korangi Industrial Area",
        city: "Karachi",
        state: "Sindh",
        postalCode: "74900",
        country: "Pakistan",
      },
      supplierId: suppliers[0].id,
      warehouseId: warehouses[0].id,
      createdById: admin.id,
      assignedToId: managerFatima.id,
    }),

    // Confirmed order ready for processing
    AppDataSource.manager.save(Order, {
      orderNumber: "PO-2024-002",
      status: OrderStatus.CONFIRMED,
      type: OrderType.PURCHASE,
      paymentStatus: PaymentStatus.PARTIAL,
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      subtotal: 113500.0,
      taxAmount: 18160.0,
      shippingCost: 3000.0,
      totalAmount: 134660.0,
      paidAmount: 67330.0, // 50% paid
      notes: "Furniture order for office setup",
      priority: "normal",
      shippingAddress: {
        street: "Sundar Industrial Estate",
        city: "Lahore",
        state: "Punjab",
        postalCode: "54000",
        country: "Pakistan",
      },
      supplierId: suppliers[1].id,
      warehouseId: warehouses[1].id,
      createdById: managerFatima.id,
      assignedToId: staffSana.id,
    }),

    // Shipped order
    AppDataSource.manager.save(Order, {
      orderNumber: "PO-2024-003",
      status: OrderStatus.SHIPPED,
      type: OrderType.PURCHASE,
      paymentStatus: PaymentStatus.PAID,
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      shippedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      deliveredDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      subtotal: 95000.0,
      taxAmount: 15200.0,
      shippingCost: 2000.0,
      discountAmount: 0,
      totalAmount: 112200.0,
      paidAmount: 112200.0,
      notes: "Delivered ahead of schedule",
      priority: "normal",
      shippingAddress: {
        street: "I-9 Industrial Area",
        city: "Islamabad",
        state: "ICT",
        postalCode: "44000",
        country: "Pakistan",
      },
      supplierId: suppliers[3].id,
      warehouseId: warehouses[2].id,
      createdById: managerAli.id,
      assignedToId: staffAyesha.id,
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  // ===== SEED ORDER ITEMS =====
  console.log("📦 Seeding order items...");
  const orderItems = await Promise.all([
    // For Order 1 - Electronics
    AppDataSource.manager.save(OrderItem, {
      orderId: orders[0].id,
      productId: products[0].id,
      productName: products[0].name,
      productSku: products[0].sku,
      productCategory: products[0].category,
      quantity: 5,
      unitPrice: products[0].price,
      unitCost: products[0].costPrice,
      totalPrice: products[0].price * 5,
      discountPercentage: 0,
      discountAmount: 0,
      status: OrderItemStatus.PENDING,
      notes: "Priority electronics shipment",
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    }),

    // For Order 2 - Furniture
    AppDataSource.manager.save(OrderItem, {
      orderId: orders[1].id,
      productId: products[2].id,
      productName: products[2].name,
      productSku: products[2].sku,
      productCategory: products[2].category,
      quantity: 10,
      unitPrice: products[2].price,
      unitCost: products[2].costPrice,
      totalPrice: products[2].price * 10,
      discountPercentage: 5,
      discountAmount: products[2].price * 10 * 0.05,
      status: OrderItemStatus.CONFIRMED,
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }),

    // For Order 3 - Printers
    AppDataSource.manager.save(OrderItem, {
      orderId: orders[2].id,
      productId: products[5].id,
      productName: products[5].name,
      productSku: products[5].sku,
      productCategory: products[5].category,
      quantity: 3,
      quantityFulfilled: 3,
      unitPrice: products[5].price,
      unitCost: products[5].costPrice,
      totalPrice: products[5].price * 3,
      discountPercentage: 0,
      discountAmount: 0,
      status: OrderItemStatus.DELIVERED,
      actualDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: "Delivered in full",
    }),
  ]);

  console.log(`✅ Created ${orderItems.length} order items`);

  console.log("🎯 Database seeding completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
