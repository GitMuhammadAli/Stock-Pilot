import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
  BeforeUpdate,
} from "typeorm";
import { BaseEntity } from "./../base/baseEntity";
import { WareHouse } from "./wareHouse";
import { User } from "./User";
import { Supplier } from "./supplier";

export enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued",
    OUT_OF_STOCK = "out_of_stock"
}

export enum ProductCondition {
    NEW = "new",
    REFURBISHED = "refurbished",
    USED = "used",
    DAMAGED = "damaged"
}

@Entity("products")
@Index(["sku"], { unique: true })
@Index(["status"])
@Index(["category"])
@Index(["supplierId"])
@Index(["warehouseId"])
@Index(["createdById"])
@Index(["barcode"], { unique: true, where: "barcode IS NOT NULL" })
@Check(`"quantity" >= 0`) // Ensure quantity is non-negative
@Check(`"price" >= 0`) // Ensure price is non-negative
@Check(`"minStockLevel" >= 0`) // Ensure minimum stock level is non-negative
export class Product extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ length: 100, unique: true })
  sku!: string;

  @Column({ length: 100, nullable: true, unique: true })
  barcode?: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ length: 100, nullable: true })
  subCategory?: string;

  @Column({ length: 100, nullable: true })
  brand?: string;

  @Column({ length: 100, nullable: true })
  model?: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  costPrice?: number;

  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @Column({ type: "enum", enum: ProductCondition, default: ProductCondition.NEW })
  condition!: ProductCondition;

  // Inventory management
  @Column({ type: "int", default: 10 })
  minStockLevel!: number;

  @Column({ type: "int", default: 100 })
  maxStockLevel!: number;

  @Column({ type: "int", default: 0 })
  reorderPoint!: number;

  @Column({ type: "int", default: 0 })
  reservedQuantity!: number; // Quantity reserved for pending orders

  // Physical properties
  @Column({ type: "decimal", precision: 8, scale: 3, nullable: true })
  weight?: number; // in kg

  @Column({ type: "json", nullable: true })
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string; // cm, inches, etc.
  };

  // Tracking information
  @Column({ type: "timestamp", nullable: true })
  lastStockUpdate?: Date;

  @Column({ type: "int", default: 0 })
  totalSold!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  totalRevenue!: number;

  // Product images and documents
  @Column({ type: "json", nullable: true })
  images?: string[]; // Array of image URLs

  @Column({ type: "json", nullable: true })
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;

  // SEO and metadata
  @Column({ type: "json", nullable: true })
  metadata?: Record<string, any>;

  // Foreign key relationships
  @ManyToOne("WareHouse", { lazy: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'warehouseId' })
  warehouse?: Promise<WareHouse> | WareHouse;

  @Column({ nullable: true })
  warehouseId?: string;

  @ManyToOne("Supplier", { lazy: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'supplierId' })
  supplier?: Promise<Supplier> | Supplier;

  @Column({ nullable: true })
  supplierId?: string;

  @ManyToOne("User", { lazy: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: Promise<User> | User;

  @Column({ nullable: true })
  createdById?: string;

  @BeforeUpdate()
  updateStockTimestamp() {
    this.lastStockUpdate = new Date();
  }

  // Business logic methods
  getAvailableQuantity(): number {
    return Math.max(0, this.quantity - this.reservedQuantity);
  }

  isInStock(): boolean {
    return this.getAvailableQuantity() > 0 && this.status === ProductStatus.ACTIVE;
  }

  needsReorder(): boolean {
    return this.quantity <= this.reorderPoint;
  }

  isLowStock(): boolean {
    return this.quantity <= this.minStockLevel;
  }

  canFulfillOrder(requestedQuantity: number): boolean {
    return this.isInStock() && this.getAvailableQuantity() >= requestedQuantity;
  }

  reserveStock(quantity: number): boolean {
    if (this.canFulfillOrder(quantity)) {
      this.reservedQuantity += quantity;
      return true;
    }
    return false;
  }

  releaseReservedStock(quantity: number): void {
    this.reservedQuantity = Math.max(0, this.reservedQuantity - quantity);
  }

  updateStock(quantityChange: number, reason: string): void {
    const newQuantity = this.quantity + quantityChange;
    if (newQuantity >= 0) {
      this.quantity = newQuantity;
      this.lastStockUpdate = new Date();
      
      // Update status based on quantity
      if (this.quantity === 0) {
        this.status = ProductStatus.OUT_OF_STOCK;
      } else if (this.status === ProductStatus.OUT_OF_STOCK) {
        this.status = ProductStatus.ACTIVE;
      }
    }
  }

  getProfitMargin(): number {
    if (this.costPrice && this.costPrice > 0) {
      return ((this.price - this.costPrice) / this.costPrice) * 100;
    }
    return 0;
  }
}
