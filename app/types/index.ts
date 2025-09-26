import { WarehouseStatus } from "@/db/entities/wareHouse";

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
    id: string
    name: string
    location: string
    description?: string
    isActive: boolean
    capacity: number
    currentOccupancy: number
    contactPhone?: string
    contactEmail?: string
    createdById: string
    createdBy: User
    createdAt: Date
    updatedAt: Date
}

export interface CreateWarehouseData {
  supplier: string;
  manager: string;
  name: string
  location: string
  description?: string
  capacity: number
  currentOccupancy?: number
  contactPhone?: string
  contactEmail?: string
  isActive?: boolean
  status?: WarehouseStatus
  latitude?: number
  longitude?: number
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
  creditLimit: any;
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
  ordersCount: number;   // These are derived/aggregated, backend should provide
  totalValue: number;    // These are derived/aggregated, backend should provide
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
  status?:string
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

// Product Interface
export interface Product {
    id: string;
    name: string;
    description?: string;
    sku: string; // Stock Keeping Unit - should be unique
    price: number;
    quantity: number;
    supplierId: string;
    supplier?: Supplier; // Embedded supplier object
    warehouseId: string;
    warehouse?: Warehouse; // Embedded warehouse object
    createdById: string;
    createdBy?: User; // Embedded user object
    createdAt: string; // ISO 8601 string
    updatedAt: string; // ISO 8601 string
}

// Data shape for creating a new Product
export interface CreateProductData {
    name: string;
    description?: string;
    sku: string;
    price: number;
    quantity: number;
    supplierId: string; // UUID of the supplier
    warehouseId: string; // UUID of the warehouse
    // createdById is handled by the backend from the auth token
}

// Data shape for updating an existing Product (all fields optional)
export interface UpdateProductData {
    name?: string;
    description?: string;
    sku?: string;
    price?: number;
    quantity?: number;
    supplierId?: string; // UUID of the supplier
    warehouseId?: string; // UUID of the warehouse
}

// Interface for the value exposed by the ProductContext
export interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
    createProduct: (data: CreateProductData) => Promise<boolean>;
    updateProduct: (id: string, data: UpdateProductData) => Promise<boolean>;
    deleteProduct: (id: string) => Promise<boolean>;
    getProduct: (id: string) => Promise<Product | null>;
    getAllProducts: () => Promise<void>;
    getAllProductsForUser: (userId: string) => Promise<void>;
    getAllProductsForSupplier: (supplierId: string) => Promise<void>;
    getAllProductsForWarehouse: (warehouseId: string) => Promise<void>;
    selectProduct: (product: Product) => void;
}

// src/types/index.ts (additions)

// Order Status Enum (must match your backend's enum)
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

// Order Interface
export interface Order {
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
export interface CreateOrderData {
    orderNumber: string;
    status?: OrderStatus; // Optional, defaults to PENDING on backend
    supplierId: string;
    warehouseId: string;
}

// Data shape for updating an existing Order (all fields optional)
export interface UpdateOrderData {
    orderNumber?: string;
    status?: OrderStatus;
    supplierId?: string;
    warehouseId?: string;
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
