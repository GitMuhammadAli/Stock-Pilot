import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import { WareHouse } from "../entities/wareHouse";
import { Supplier } from "../entities/supplier";
import { Product } from "../entities/products";
import { Order, OrderStatus } from "../entities/order";
import { OrderItem } from "../entities/orderItem";


async function seed() {
  await AppDataSource.initialize();
  console.log("📦 Database connected for seeding");

  // Clear tables in correct order to avoid foreign key constraint issues
  console.log("🗑️ Clearing existing data...");
  
  try {
    // Clear child tables first
    await AppDataSource.manager.clear(OrderItem);
    await AppDataSource.manager.clear(Order);
    await AppDataSource.manager.clear(Product);
    await AppDataSource.manager.clear(Supplier);
    await AppDataSource.manager.clear(WareHouse);
    await AppDataSource.manager.clear(User);
  } catch (error) {
    console.log("⚠️ Using CASCADE to clear tables...");
    // Use raw SQL with CASCADE as fallback - check actual table names
    await AppDataSource.manager.query("TRUNCATE TABLE order_item, \"order\", product, supplier, ware_house, \"user\" CASCADE");
  }
  
  console.log("✅ Existing data cleared");

  // Seed Users
  console.log("👥 Creating users...");
  const users = [];
  
  const admin = await AppDataSource.manager.save(
    AppDataSource.manager.create(User, {
      name: "Admin User",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      isVerified: true,
    })
  );
  users.push(admin);

  const userNames = ["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis", "Robert Brown"];
  for (let i = 0; i < userNames.length; i++) {
    const user = await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        name: userNames[i],
        email: `user${i + 1}@example.com`,
        role: UserRole.STAFF,
        isVerified: true,
      })
    );
    users.push(user);
  }

  // Warehouses
  console.log("🏢 Creating warehouses...");
  const warehouses = [];
  const warehouseData = [
    { name: "Main Warehouse", location: "Karachi", capacity: 1000 },
    { name: "North Warehouse", location: "Lahore", capacity: 800 },
    { name: "South Warehouse", location: "Islamabad", capacity: 1200 },
    { name: "East Warehouse", location: "Faisalabad", capacity: 600 },
    { name: "West Warehouse", location: "Peshawar", capacity: 900 },
    { name: "Central Warehouse", location: "Multan", capacity: 700 },
    { name: "Metro Warehouse", location: "Hyderabad", capacity: 500 },
    { name: "City Warehouse", location: "Quetta", capacity: 400 },
    { name: "Industrial Warehouse", location: "Gujranwala", capacity: 1100 },
    { name: "Commercial Warehouse", location: "Sialkot", capacity: 650 },
    { name: "Storage Hub A", location: "Rawalpindi", capacity: 750 },
    { name: "Storage Hub B", location: "Sargodha", capacity: 550 },
    { name: "Distribution Center", location: "Bahawalpur", capacity: 850 },
    { name: "Logistics Center", location: "Sukkur", capacity: 450 },
    { name: "Fulfillment Center", location: "Larkana", capacity: 800 },
    { name: "Regional Warehouse", location: "Mardan", capacity: 600 },
    { name: "Express Warehouse", location: "Kasur", capacity: 700 },
    { name: "Smart Warehouse", location: "Chiniot", capacity: 500 },
    { name: "Modern Warehouse", location: "Okara", capacity: 900 },
    { name: "Premium Warehouse", location: "Sahiwal", capacity: 1000 }
  ];

  for (let i = 0; i < warehouseData.length; i++) {
    const warehouse = await AppDataSource.manager.save(
      AppDataSource.manager.create(WareHouse, {
        name: warehouseData[i].name,
        location: warehouseData[i].location,
        capacity: warehouseData[i].capacity,
        currentOccupancy: Math.floor(Math.random() * warehouseData[i].capacity * 0.7),
        createdById: users[Math.floor(Math.random() * users.length)].id,
      })
    );
    warehouses.push(warehouse);
  }

  // Suppliers
  console.log("🏭 Creating suppliers...");
  const suppliers = [];
  const supplierData = [
    { name: "Alpha Supplier", email: "alpha@supply.com", phone: "03001234567", address: "Street 12, Lahore" },
    { name: "Beta Electronics", email: "beta@electronics.com", phone: "03012345678", address: "Plaza 5, Karachi" },
    { name: "Gamma Industries", email: "gamma@industries.com", phone: "03023456789", address: "Block A, Islamabad" },
    { name: "Delta Components", email: "delta@components.com", phone: "03034567890", address: "Sector 7, Faisalabad" },
    { name: "Epsilon Trading", email: "epsilon@trading.com", phone: "03045678901", address: "Mall Road, Peshawar" },
    { name: "Zeta Solutions", email: "zeta@solutions.com", phone: "03056789012", address: "Garden Town, Multan" },
    { name: "Eta Enterprises", email: "eta@enterprises.com", phone: "03067890123", address: "City Center, Hyderabad" },
    { name: "Theta Corporation", email: "theta@corp.com", phone: "03078901234", address: "Industrial Area, Quetta" },
    { name: "Iota Manufacturing", email: "iota@manufacturing.com", phone: "03089012345", address: "Factory Street, Gujranwala" },
    { name: "Kappa Distribution", email: "kappa@distribution.com", phone: "03090123456", address: "Business District, Sialkot" },
    { name: "Lambda Logistics", email: "lambda@logistics.com", phone: "03001234568", address: "Transport Hub, Rawalpindi" },
    { name: "Mu Materials", email: "mu@materials.com", phone: "03012345679", address: "Warehouse Zone, Sargodha" },
    { name: "Nu Networks", email: "nu@networks.com", phone: "03023456780", address: "Tech Park, Bahawalpur" },
    { name: "Xi Xperts", email: "xi@xperts.com", phone: "03034567891", address: "Commercial Avenue, Sukkur" },
    { name: "Omicron Operations", email: "omicron@operations.com", phone: "03045678902", address: "Service Road, Larkana" },
    { name: "Pi Products", email: "pi@products.com", phone: "03056789013", address: "Market Square, Mardan" },
    { name: "Rho Resources", email: "rho@resources.com", phone: "03067890124", address: "Supply Chain St, Kasur" },
    { name: "Sigma Systems", email: "sigma@systems.com", phone: "03078901235", address: "Innovation Hub, Chiniot" },
    { name: "Tau Technologies", email: "tau@technologies.com", phone: "03089012346", address: "Digital Plaza, Okara" },
    { name: "Upsilon United", email: "upsilon@united.com", phone: "03090123457", address: "Unity Center, Sahiwal" }
  ];

  for (let i = 0; i < supplierData.length; i++) {
    const supplier = await AppDataSource.manager.save(
      AppDataSource.manager.create(Supplier, {
        name: supplierData[i].name,
        email: supplierData[i].email,
        phone: supplierData[i].phone,
        address: supplierData[i].address,
        createdBy: users[Math.floor(Math.random() * users.length)],
      })
    );
    suppliers.push(supplier);
  }

  // Products
  console.log("📦 Creating products...");
  const products = [];
  const productData = [
    { name: "Laptop Computer", sku: "LPT001", price: 75000, quantity: 50, category: "Electronics" },
    { name: "Desktop Monitor", sku: "MON002", price: 25000, quantity: 75, category: "Electronics" },
    { name: "Wireless Mouse", sku: "MOU003", price: 1500, quantity: 200, category: "Electronics" },
    { name: "Mechanical Keyboard", sku: "KEY004", price: 8000, quantity: 100, category: "Electronics" },
    { name: "Office Chair", sku: "CHR005", price: 15000, quantity: 30, category: "Furniture" },
    { name: "Desk Lamp", sku: "LMP006", price: 3500, quantity: 80, category: "Furniture" },
    { name: "Printer Paper", sku: "PPR007", price: 500, quantity: 500, category: "Office Supplies" },
    { name: "Ink Cartridge", sku: "INK008", price: 2000, quantity: 150, category: "Office Supplies" },
    { name: "USB Flash Drive", sku: "USB009", price: 1200, quantity: 300, category: "Electronics" },
    { name: "External Hard Drive", sku: "HDD010", price: 12000, quantity: 40, category: "Electronics" },
    { name: "Webcam", sku: "CAM011", price: 6000, quantity: 60, category: "Electronics" },
    { name: "Headphones", sku: "HPH012", price: 4500, quantity: 90, category: "Electronics" },
    { name: "Smartphone", sku: "PHN013", price: 45000, quantity: 25, category: "Electronics" },
    { name: "Tablet", sku: "TAB014", price: 35000, quantity: 35, category: "Electronics" },
    { name: "Power Bank", sku: "PWR015", price: 2500, quantity: 120, category: "Electronics" },
    { name: "Cable Organizer", sku: "ORG016", price: 800, quantity: 250, category: "Office Supplies" },
    { name: "Whiteboard", sku: "WHB017", price: 5000, quantity: 45, category: "Office Supplies" },
    { name: "Projector", sku: "PRJ018", price: 85000, quantity: 15, category: "Electronics" },
    { name: "Conference Table", sku: "TBL019", price: 35000, quantity: 20, category: "Furniture" },
    { name: "Filing Cabinet", sku: "FIL020", price: 18000, quantity: 25, category: "Furniture" }
  ];

  for (let i = 0; i < productData.length; i++) {
    const product = await AppDataSource.manager.save(
      AppDataSource.manager.create(Product, {
        name: productData[i].name,
        sku: productData[i].sku,
        price: productData[i].price,
        quantity: productData[i].quantity,
        category: productData[i].category,
        createdBy: users[Math.floor(Math.random() * users.length)],
        supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
        warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
        warehouseId: warehouses[Math.floor(Math.random() * warehouses.length)].id,
      })
    );
    products.push(product);
  }

  // Orders
  console.log("📋 Creating orders...");
  const orders = [];
  const orderStatuses = [OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
  
  for (let i = 1; i <= 20; i++) {
    const order = await AppDataSource.manager.save(
      AppDataSource.manager.create(Order, {
        orderNumber: `ORD${i.toString().padStart(3, '0')}`,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
        supplierId: suppliers[Math.floor(Math.random() * suppliers.length)].id,
        warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
        warehouseId: warehouses[Math.floor(Math.random() * warehouses.length)].id,
        createdBy: users[Math.floor(Math.random() * users.length)],
        createdById: users[Math.floor(Math.random() * users.length)].id,
      })
    );
    orders.push(order);
  }

  // OrderItems
  console.log("📝 Creating order items...");
  for (let i = 0; i < orders.length; i++) {
    // Create 1-5 order items per order
    const itemCount = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      
      await AppDataSource.manager.save(
        AppDataSource.manager.create(OrderItem, {
          orderId: orders[i].id,
          productId: product.id,
          quantity: quantity,
          unitPrice: product.price,
        })
      );
    }
  }

  console.log("✅ Seeding completed");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed", error);
  process.exit(1);
});
