// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
// import { Order } from "./order";
// import { Product } from "./products";

// @Entity()
// export class OrderItem {
//     @PrimaryGeneratedColumn("uuid")
//     id!: string;

//     @ManyToOne(() => Order, order => order.id, { onDelete: "CASCADE" }) // Added inverse side if exists and onDelete options
//     @JoinColumn({ name: "orderId" })
//     order!: Order;

//     @Column()
//     orderId!: string; // Added explicit foreign key

//     @ManyToOne(() => Product)
//     @JoinColumn({ name: "productId" })
//     product!: Product;

//     @Column()
//     productId!: string; // Added explicit foreign key

//     @Column()
//     quantity!: number;

//     @Column({ type: "decimal", precision: 10, scale: 2 })
//     unitPrice!: number;

//     @CreateDateColumn()
//     createdAt!: Date;

//     @UpdateDateColumn()
//     updatedAt!: Date;
// }


// =============================================================================
// lib/entities/OrderItem.ts - Enhanced order item with detailed tracking
// =============================================================================
import { Entity, Column, ManyToOne, JoinColumn, Index, Check } from "typeorm";
import { BaseEntity } from "./../base/baseEntity";
import { Product } from "./products";
import { Order } from "./order";

export enum OrderItemStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    BACKORDERED = "backordered",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    RETURNED = "returned"
}

@Entity("order_items")
@Index(["orderId"])
@Index(["productId"])
@Index(["status"])
@Check(`"quantity" > 0`) // Ensure quantity is positive
@Check(`"unitPrice" >= 0`) // Ensure unit price is non-negative
@Check(`"quantityFulfilled" <= "quantity"`) // Fulfilled cannot exceed ordered
export class OrderItem extends BaseEntity {
    @Column({ type: "int" })
    quantity!: number;

    @Column({ type: "int", default: 0 })
    quantityFulfilled!: number;

    @Column({ type: "int", default: 0 })
    quantityReturned!: number;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    unitPrice!: number;

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
    unitCost?: number; // Cost price for profit calculation

    @Column({ type: "decimal", precision: 12, scale: 2 })
    totalPrice!: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    discountPercentage!: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    discountAmount!: number;

    @Column({ type: "enum", enum: OrderItemStatus, default: OrderItemStatus.PENDING })
    status!: OrderItemStatus;

    @Column({ type: "text", nullable: true })
    notes?: string;

    // Tracking information
    @Column({ length: 100, nullable: true })
    serialNumbers?: string; // JSON string or comma-separated

    @Column({ length: 100, nullable: true })
    batchNumber?: string;

    @Column({ type: "timestamp", nullable: true })
    expectedDeliveryDate?: Date;

    @Column({ type: "timestamp", nullable: true })
    actualDeliveryDate?: Date;

    // Foreign key relationships
    @ManyToOne("Order", { onDelete: "CASCADE" })
    @JoinColumn({ name: "orderId" })
    order!: Promise<Order> | Order;

    @Column()
    orderId!: string;

    @ManyToOne("Product", { lazy: true, onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "productId" })
    product?: Promise<Product> | Product;

    @Column({ nullable: true })
    productId?: string;

    // Snapshot of product information at time of order (for historical accuracy)
    @Column({ length: 255, nullable: true })
    productName?: string;

    @Column({ length: 100, nullable: true })
    productSku?: string;

    @Column({ length: 100, nullable: true })
    productCategory?: string;

    // Business logic methods
    getRemainingQuantity(): number {
        return Math.max(0, this.quantity - this.quantityFulfilled);
    }

    isFullyFulfilled(): boolean {
        return this.quantityFulfilled >= this.quantity;
    }

    canBeFulfilled(): boolean {
        return [OrderItemStatus.PENDING, OrderItemStatus.CONFIRMED, OrderItemStatus.BACKORDERED].includes(this.status);
    }

    getNetPrice(): number {
        return this.totalPrice - this.discountAmount;
    }

    getProfitMargin(): number {
        if (this.unitCost && this.unitCost > 0) {
            return ((this.unitPrice - this.unitCost) / this.unitCost) * 100;
        }
        return 0;
    }

    getTotalProfit(): number {
        if (this.unitCost) {
            return (this.unitPrice - this.unitCost) * this.quantityFulfilled;
        }
        return 0;
    }

    fulfill(quantity: number): boolean {
        if (quantity <= 0 || quantity > this.getRemainingQuantity()) {
            return false;
        }

        this.quantityFulfilled += quantity;
        
        if (this.isFullyFulfilled()) {
            this.status = OrderItemStatus.DELIVERED;
            this.actualDeliveryDate = new Date();
        } else {
            this.status = OrderItemStatus.SHIPPED;
        }

        return true;
    }

    returnItem(quantity: number, reason?: string): boolean {
        if (quantity <= 0 || quantity > this.quantityFulfilled) {
            return false;
        }

        this.quantityReturned += quantity;
        this.quantityFulfilled -= quantity;
        
        if (this.notes) {
            this.notes += `\nReturn: ${quantity} items${reason ? ` - ${reason}` : ''}`;
        } else {
            this.notes = `Return: ${quantity} items${reason ? ` - ${reason}` : ''}`;
        }

        // Update status based on fulfillment state
        if (this.quantityFulfilled === 0) {
            this.status = OrderItemStatus.RETURNED;
        } else if (!this.isFullyFulfilled()) {
            this.status = OrderItemStatus.SHIPPED; // Partially fulfilled
        }

        return true;
    }

    cancel(reason?: string): boolean {
        if (!this.canBeCancelled()) {
            return false;
        }

        this.status = OrderItemStatus.CANCELLED;
        
        if (this.notes) {
            this.notes += `\nCancelled${reason ? ` - ${reason}` : ''}`;
        } else {
            this.notes = `Cancelled${reason ? ` - ${reason}` : ''}`;
        }

        return true;
    }

    canBeCancelled(): boolean {
        return [OrderItemStatus.PENDING, OrderItemStatus.CONFIRMED, OrderItemStatus.BACKORDERED].includes(this.status);
    }

    // Calculate total with discount applied
    calculateTotalPrice(): void {
        const subtotal = this.unitPrice * this.quantity;
        this.discountAmount = (subtotal * this.discountPercentage) / 100;
        this.totalPrice = subtotal - this.discountAmount;
    }

    // Check if item is overdue based on expected delivery
    isOverdue(): boolean {
        return this.expectedDeliveryDate ? 
            this.expectedDeliveryDate < new Date() && !this.isFullyFulfilled() : 
            false;
    }

    // Get completion percentage
    getCompletionPercentage(): number {
        return this.quantity > 0 ? (this.quantityFulfilled / this.quantity) * 100 : 0;
    }

    // Check if item needs attention (overdue or backordered)
    needsAttention(): boolean {
        return this.status === OrderItemStatus.BACKORDERED || this.isOverdue();
    }

    // Get effective unit price after discount
    getEffectiveUnitPrice(): number {
        return this.quantity > 0 ? this.getNetPrice() / this.quantity : 0;
    }
}