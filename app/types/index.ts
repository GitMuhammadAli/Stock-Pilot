import { WarehouseStatus } from "@/db/entities/wareHouse";
import { ReactNode } from "react";

export interface User {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified: boolean;
}

export interface User {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified: boolean;
}

export interface Warehouse {
  status: any;
  supplier: string;
  manager: string;
  id: string;
  name: string;
  location: string;
  description?: string;
  isActive: boolean;
  capacity: number;
  currentOccupancy: number;
  contactPhone?: string;
  contactEmail?: string;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWarehouseData {
  supplier: string;
  manager: string;
  name: string;
  location: string;
  description?: string;
  capacity: number;
  currentOccupancy?: number;
  contactPhone?: string;
  contactEmail?: string;
  isActive?: boolean;
  status?: WarehouseStatus;
  latitude?: number;
  longitude?: number;
}

export interface UpdateWarehouseData {
  name?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
  capacity?: number;
  currentOccupancy?: number;
  contactPhone?: string;
  contactEmail?: string;
}

export interface WarehouseContextType {
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
  selectedWarehouse: Warehouse | null;

  // CRUD
  createWarehouse: (data: CreateWarehouseData) => Promise<boolean>;
  updateWarehouse: (id: string, data: UpdateWarehouseData) => Promise<boolean>;
  deleteWarehouse: (id: string) => Promise<boolean>;

  // Fetch
  getWarehouse: (id: string) => Promise<Warehouse | null>;
  getAllWarehouses: () => Promise<void>;
  getAllWarehousesForUser: () => Promise<void>;

  // State helpers
  selectWarehouse: (warehouse: Warehouse | null) => void;
}

// src/types/supplier.ts

export type SupplierStatus = "Active" | "Inactive"; // Assuming this enum is supported by backend

export interface Supplier {
  creditLimit: ReactNode;
  totalOrders: number;
  totalOrderValue: string;
  tier: string;
  paymentTerms: ReactNode;
  currentBalance: ReactNode;
  taxId: ReactNode;
  contractStartDate: any;
  contractEndDate: string;
  id: string; // Backend typically uses UUIDs for IDs
  name: string;
  email: string;
  phone?: string; // Optional
  address?: string; // Optional
  contactPerson?: string; // Added to match UI
  website?: string; // Added to match UI
  notes?: string; // Added to match UI
  status: SupplierStatus; // Added to match UI
  productsCount: number; // These are derived/aggregated, backend should provide
  ordersCount: number; // These are derived/aggregated, backend should provide
  totalValue: number; // These are derived/aggregated, backend should provide
  lastOrder?: string; // ISO date string e.g., "2023-12-14T12:00:00Z" (derived/aggregated)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  rating?: number; // Optional (derived/aggregated)
  createdById: string; // Foreign Key to User
  createdBy?: any; // Optional: Embedded user object if backend relations are loaded
}

// Data shape for creating a new supplier (matches backend CreateSupplierData)
export interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string; // Added to match UI
  website?: string; // Added to match UI
  notes?: string; // Added to match UI
  status?: string;
  // createdById is handled by the backend from the auth token, not sent in body
}

// Data shape for updating an existing supplier (all fields optional)
export interface UpdateSupplierData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string; // Added to match UI
  website?: string; // Added to match UI
  notes?: string; // Added to match UI
  status?: SupplierStatus; // Added to match UI
}

// Interface for the value exposed by the SupplierContext
export interface SupplierContextType {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
  getAllSuppliers: () => Promise<void>;
  getSupplier: (id: string) => Promise<Supplier | null>;
  createSupplier: (data: CreateSupplierData) => Promise<boolean>;
  updateSupplier: (id: string, data: UpdateSupplierData) => Promise<boolean>;
  deleteSupplier: (id: string) => Promise<boolean>;
  selectSupplier: (supplier: Supplier | null) => void;
  getAllSuppliersForUser: (userId: string) => Promise<void>;
}

// // Product Interface
// export interface Product {
//     weight: string;
//     brand: string;
//     brand: string;
//     weight: string;
//     dimensions: string;
//     color: string;
//     status: string;
//     totalValue: any;
//     lastUpdated: string | number | Date;
//     minStock: number;
//     category: string;
//     category: string;
//     minStock: number;
//     id: string;
//     name: string;
//     description?: string;
//     sku: string; // Stock Keeping Unit - should be unique
//     price: number;
//     quantity: number;
//     supplierId: string;
//     supplier?: Supplier; // Embedded supplier object
//     warehouseId: string;
//     warehouse?: Warehouse; // Embedded warehouse object
//     createdById: string;
//     createdBy?: User; // Embedded user object
//     createdAt: string; // ISO 8601 string
//     updatedAt: string; // ISO 8601 string
// }

// // Data shape for creating a new Product
// export interface CreateProductData {
//     name: string;
//     description?: string;
//     sku: string;
//     price: number;
//     quantity: number;
//     supplierId: string; // UUID of the supplier
//     warehouseId: string; // UUID of the warehouse
//     // createdById is handled by the backend from the auth token
// }

// // Data shape for updating an existing Product (all fields optional)
// export interface UpdateProductData {
//     name?: string;
//     description?: string;
//     sku?: string;
//     price?: number;
//     quantity?: number;
//     supplierId?: string; // UUID of the supplier
//     warehouseId?: string; // UUID of the warehouse
// }

// // Interface for the value exposed by the ProductContext
// export interface ProductContextType {
//     products: Product[];
//     loading: boolean;
//     error: string | null;
//     selectedProduct: Product | null;
//     createProduct: (data: CreateProductData) => Promise<boolean>;
//     updateProduct: (id: string, data: UpdateProductData) => Promise<boolean>;
//     deleteProduct: (id: string) => Promise<boolean>;
//     getProduct: (id: string) => Promise<Product | null>;
//     getAllProducts: () => Promise<void>;
//     getAllProductsForUser: (userId: string) => Promise<void>;
//     getAllProductsForSupplier: (supplierId: string) => Promise<void>;
//     getAllProductsForWarehouse: (warehouseId: string) => Promise<void>;
//     selectProduct: (product: Product) => void;
// }

// Product Status Enum
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
  OUT_OF_STOCK = "out_of_stock",
}

// Product Condition Enum
export enum ProductCondition {
  NEW = "new",
  REFURBISHED = "refurbished",
  USED = "used",
  DAMAGED = "damaged",
}

// -----------------------------
// Product Interface (Entity Shape)
// -----------------------------
export interface Product {
  lastUpdated: string | number | Date;
  totalValue: any;
  minStock: number;
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  quantity: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  price: number;
  costPrice?: number;
  status: ProductStatus;
  condition: ProductCondition;

  // Inventory Management
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  reservedQuantity: number;

  // Physical Properties
  weight?: number; // in kg
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };

  // Tracking
  lastStockUpdate?: string; // ISO 8601 string
  totalSold: number;
  totalRevenue: number;

  // Media
  images?: string[];
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;

  // SEO / Metadata
  metadata?: Record<string, any>;

  // Relations
  warehouseId?: string;
  warehouse?: Warehouse; // Embedded Warehouse
  supplierId?: string;
  supplier?: Supplier; // Embedded Supplier
  createdById?: string;
  createdBy?: User; // Embedded User

  // BaseEntity fields
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

// -----------------------------
// Data Shape for Creating a Product
// -----------------------------
export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  quantity: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  price: number;
  costPrice?: number;
  status?: ProductStatus;
  condition?: ProductCondition;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  reservedQuantity?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  images?: string[];
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  metadata?: Record<string, any>;
  supplierId?: string;
  warehouseId?: string;
}

// -----------------------------
// Data Shape for Updating a Product
// -----------------------------
export interface UpdateProductData extends Partial<CreateProductData> {}

// -----------------------------
// Context Interface
// -----------------------------
export interface ProductContextType {
  products: Product[];
  productMap: Record<string, Product>;
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  createProduct: (data: CreateProductData) => Promise<boolean>;
  updateProduct: (id: string, data: UpdateProductData) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProduct: (id: string) => Promise<Product | null>;
  getAllProducts: (force?: boolean) => Promise<Product[] | null>;
  getAllProductsForUser: (userId: string) => Promise<Product[] | null>;
  getAllProductsForSupplier: (supplierId: string) => Promise<Product[] | null>;
  getAllProductsForWarehouse: (
    warehouseId: string
  ) => Promise<Product[] | null>;

  selectProduct: (product: Product) => void;
}

// Order Interface
export interface Order {
  priority: string;
  isRushOrder: boolean;
  internalNotes: string;
  notes: string;
  referenceNumber: string;
  deliveredDate: any;
  shippedDate: any;
  dueDate: any;
  orderDate: any;
  type: string;
  supplierName: any;
  warehouseName: any;
  itemCount: ReactNode;
  customer: any;
  totalAmount: number;
  paymentStatus: string;
  id: string;
  orderNumber: string; // Must be unique
  status: OrderStatus;
  supplierId: string;
  supplier?: Supplier; // Embedded supplier object
  warehouseId: string;
  warehouse?: Warehouse; // Embedded warehouse object
  createdById: string;
  createdBy?: User; // Embedded user object
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  // Potentially totalPrice field if backend calculates it directly on Order
}


// Data shape for creating a new Order
// src/types/index.ts
export enum OrderStatus {
  DRAFT = "draft",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  COMPLETED = "completed"
}

export enum OrderType {
  PURCHASE = "purchase",
  SALES = "sales",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
  RETURN = "return"
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIAL = "partial",
  OVERDUE = "overdue",
  REFUNDED = "refunded"
}

export type Priority = "low" | "normal" | "high" | "urgent";

export interface CreateOrderData {
  orderNumber: string;
  createdById: string;
  status: OrderStatus;
  supplierId: string;
  warehouseId: string;
  type: OrderType;
  paymentStatus: PaymentStatus;
  priority: Priority;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  referenceNumber: string;
  dueDate: string;
  notes: string;
}

// Data shape for updating an existing Order (all fields optional)
export interface UpdateOrderData {
  orderNumber?: string;
  status: OrderStatus;
  supplierId?: string;
  warehouseId?: string;
  orderDate?: string;
}

// Interface for the value exposed by the OrderContext
export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  createOrder: (data: CreateOrderData) => Promise<boolean>;
  updateOrder: (id: string, data: UpdateOrderData) => Promise<boolean>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  getOrder: (id: string) => Promise<Order | null>;
  getAllOrders: () => Promise<void>;
  getAllOrdersForUser: (userId: string) => Promise<void>;
  getAllOrdersForSupplier: (supplierId: string) => Promise<void>;
  getAllOrdersForWarehouse: (warehouseId: string) => Promise<void>;
  getAllOrdersByStatus: (status: OrderStatus) => Promise<void>;
  selectOrder: (order: Order) => void;
}

// src/types/index.ts (additions)

// OrderItem Interface
export interface OrderItem {
  id: string;
  orderId: string;
  order?: Order; // Embedded order object (optional, depends on backend eager loading)
  productId: string;
  product?: Product; // Embedded product object (optional, depends on backend eager loading)
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Data shape for creating a new OrderItem
export interface CreateOrderItemData {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

// Data shape for updating an existing OrderItem (all fields optional)
export interface UpdateOrderItemData {
  orderId?: string;
  productId?: string;
  quantity?: number;
  unitPrice?: number;
}

// Interface for the value exposed by the OrderItemContext
export interface OrderItemContextType {
  orderItems: OrderItem[];
  loading: boolean;
  error: string | null;
  selectedOrderItem: OrderItem | null;
  orderTotal: number; // For the total of the currently selected order's items
  createOrderItem: (data: CreateOrderItemData) => Promise<boolean>;
  updateOrderItem: (id: string, data: UpdateOrderItemData) => Promise<boolean>;
  deleteOrderItem: (id: string) => Promise<boolean>;
  getOrderItem: (id: string) => Promise<OrderItem | null>;
  getAllOrderItems: () => Promise<void>;
  getAllOrderItemsForOrder: (orderId: string) => Promise<void>;
  getAllOrderItemsForProduct: (productId: string) => Promise<void>;
  getOrderItemsTotal: (orderId: string) => Promise<number | null>; // Fetches total for a specific order
  selectOrderItem: (orderItem: OrderItem) => void;
}

export { WarehouseStatus };
