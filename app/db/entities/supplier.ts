

import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from "typeorm";
import { BaseEntity } from "./../base/baseEntity";
import { User } from "./User";

export enum SupplierStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_APPROVAL = "pending_approval"
}

export enum SupplierTier {
    PREMIUM = "premium",
    STANDARD = "standard",
    BASIC = "basic"
}

@Entity("suppliers")
@Index(["status"])
@Index(["tier"])
@Index(["name"])
@Index(["email"])
@Index(["createdById"])
@Check(`"creditLimit" >= 0`) // Ensure credit limit is non-negative
export class Supplier extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ length: 255, nullable: true })
  contactPerson?: string;

  @Column({ length: 500, nullable: true })
  website?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "enum", enum: SupplierStatus, default: SupplierStatus.PENDING_APPROVAL })
  status!: SupplierStatus;

  @Column({ type: "enum", enum: SupplierTier, default: SupplierTier.STANDARD })
  tier!: SupplierTier;

  // Financial information
  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  creditLimit!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  currentBalance!: number;

  // Performance metrics
  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  rating?: number; // 0-5 stars

  @Column({ type: "int", default: 0 })
  totalOrders!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  totalOrderValue!: number;

  // Payment terms in days
  @Column({ type: "int", default: 30 })
  paymentTerms!: number;

  // Tax information
  @Column({ length: 50, nullable: true })
  taxId?: string;

  // Contract information
  @Column({ type: "timestamp", nullable: true })
  contractStartDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  contractEndDate?: Date;

  @ManyToOne("User", { lazy: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: Promise<User> | User;

  @Column({ nullable: true })
  createdById?: string;

  // ✅ NO @OneToMany relationship to avoid circular dependency
  // Use SupplierService.getProducts(supplierId) instead

  // Business logic methods
  isActive(): boolean {
    return this.status === SupplierStatus.ACTIVE && !this.isDeleted();
  }

  canTakeOrder(orderValue: number): boolean {
    return this.isActive() && (this.currentBalance + orderValue <= this.creditLimit);
  }

  getAverageOrderValue(): number {
    return this.totalOrders > 0 ? this.totalOrderValue / this.totalOrders : 0;
  }

  isContractActive(): boolean {
    const now = new Date();
    return this.contractStartDate ? 
      this.contractStartDate <= now && (!this.contractEndDate || this.contractEndDate >= now) : 
      false;
  }
}