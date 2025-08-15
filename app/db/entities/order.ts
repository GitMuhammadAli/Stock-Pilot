// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
// import { User } from "./User";
// import { Supplier } from "./supplier";
// import { WareHouse } from "./wareHouse";

// export enum OrderStatus {
//     PENDING = "pending",
//     SHIPPED = "shipped",
//     DELIVERED = "delivered",
//     CANCELLED = "cancelled"
// }

// @Entity()
// export class Order {
//     @PrimaryGeneratedColumn("uuid")
//     id!: string;

//     @Column()
//     orderNumber!: string;

//     @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
//     status!: OrderStatus;

//     @ManyToOne(() => Supplier)
//     @JoinColumn({ name: 'supplierId' })
//     supplier!: Supplier;
//     @Column()
//     supplierId!: string;

//     @ManyToOne(() => WareHouse)
//     @JoinColumn({ name: 'warehouseId' })
//     warehouse!: WareHouse;
//     @Column()
//     warehouseId!: string;

//     @ManyToOne(() => User)
//     @JoinColumn({ name: 'createdById' })
//     createdBy!: User;
//     @Column()
//     createdById!: string;

//     @CreateDateColumn()
//     createdAt!: Date;
//     @UpdateDateColumn()
//     updatedAt!: Date;
// }


import { Entity, Column, ManyToOne, JoinColumn, Index, BeforeInsert } from "typeorm";
import { BaseEntity } from "./../base/baseEntity";
import { Supplier } from "./supplier";
import { WareHouse } from "./wareHouse";
import { User } from "./User";


export enum OrderStatus {
    DRAFT = "draft",
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}

export enum OrderType {
    PURCHASE = "purchase", // Buying from supplier
    SALES = "sales", // Selling to customer
    TRANSFER = "transfer", // Internal transfer
    ADJUSTMENT = "adjustment" // Inventory adjustment
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    PARTIAL = "partial",
    OVERDUE = "overdue",
    REFUNDED = "refunded"
}

@Entity("orders")
@Index(["orderNumber"], { unique: true })
@Index(["status"])
@Index(["type"])
@Index(["paymentStatus"])
@Index(["supplierId"])
@Index(["warehouseId"])
@Index(["createdById"])
@Index(["orderDate"])
@Index(["dueDate"])
export class Order extends BaseEntity {
    @Column({ length: 50, unique: true })
    orderNumber!: string;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.DRAFT })
    status!: OrderStatus;

    @Column({ type: "enum", enum: OrderType, default: OrderType.PURCHASE })
    type!: OrderType;

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus!: PaymentStatus;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    orderDate!: Date;

    @Column({ type: "timestamp", nullable: true })
    dueDate?: Date;

    @Column({ type: "timestamp", nullable: true })
    shippedDate?: Date;

    @Column({ type: "timestamp", nullable: true })
    deliveredDate?: Date;

    // Financial information
    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    subtotal!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    taxAmount!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    shippingCost!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    discountAmount!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    totalAmount!: number;

    @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
    paidAmount!: number;

    // Order details
    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ type: "text", nullable: true })
    internalNotes?: string; // Not visible to supplier/customer

    @Column({ length: 100, nullable: true })
    referenceNumber?: string; // External reference

    @Column({ length: 100, nullable: true })
    purchaseOrderNumber?: string; // For linking to external PO

    // Shipping information
    @Column({ type: "json", nullable: true })
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    @Column({ type: "json", nullable: true })
    billingAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    @Column({ length: 100, nullable: true })
    trackingNumber?: string;

    @Column({ length: 100, nullable: true })
    shippingCarrier?: string;

    // Priority and urgency
    @Column({ type: "enum", enum: ["low", "normal", "high", "urgent"], default: "normal" })
    priority!: "low" | "normal" | "high" | "urgent";

    @Column({ default: false })
    isRushOrder!: boolean;

    // Foreign key relationships
    @ManyToOne("Supplier", { lazy: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'supplierId' })
    supplier?: Promise<Supplier> | Supplier;

    @Column({ nullable: true })
    supplierId?: string;

    @ManyToOne("WareHouse", { lazy: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'warehouseId' })
    warehouse?: Promise<WareHouse> | WareHouse;

    @Column({ nullable: true })
    warehouseId?: string;

    @ManyToOne("User", { lazy: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'createdById' })
    createdBy?: Promise<User> | User;

    @Column({ nullable: true })
    createdById?: string;

    // Assigned user for processing
    @ManyToOne("User", { lazy: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'assignedToId' })
    assignedTo?: Promise<User> | User;

    @Column({ nullable: true })
    assignedToId?: string;

    // ✅ NO @OneToMany relationship to avoid circular dependency
    // Use OrderService.getOrderItems(orderId) instead

    @BeforeInsert()
    generateOrderNumber() {
        if (!this.orderNumber) {
            const prefix = this.type === OrderType.PURCHASE ? 'PO' : 
                          this.type === OrderType.SALES ? 'SO' : 
                          this.type === OrderType.TRANSFER ? 'TO' : 'AO';
            const timestamp = Date.now().toString().slice(-8);
            this.orderNumber = `${prefix}-${timestamp}`;
        }
    }

    // Business logic methods
    canBeCancelled(): boolean {
        return [OrderStatus.DRAFT, OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
    }

    canBeModified(): boolean {
        return [OrderStatus.DRAFT, OrderStatus.PENDING].includes(this.status);
    }

    isOverdue(): boolean {
        return this.dueDate ? this.dueDate < new Date() && this.status !== OrderStatus.DELIVERED : false;
    }

    getRemainingBalance(): number {
        return Math.max(0, this.totalAmount - this.paidAmount);
    }

    isFullyPaid(): boolean {
        return this.paidAmount >= this.totalAmount;
    }

    getPaymentProgress(): number {
        return this.totalAmount > 0 ? (this.paidAmount / this.totalAmount) * 100 : 0;
    }

    updatePaymentStatus(): void {
        if (this.paidAmount >= this.totalAmount) {
            this.paymentStatus = PaymentStatus.PAID;
        } else if (this.paidAmount > 0) {
            this.paymentStatus = PaymentStatus.PARTIAL;
        } else if (this.isOverdue()) {
            this.paymentStatus = PaymentStatus.OVERDUE;
        }
    }

    calculateTotals(): void {
        this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
        this.updatePaymentStatus();
    }
}
