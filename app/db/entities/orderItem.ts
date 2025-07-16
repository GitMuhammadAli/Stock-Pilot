import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order";
import { Product } from "./products";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Order, order => order.id, { onDelete: "CASCADE" }) // Added inverse side if exists and onDelete options
    @JoinColumn({ name: "orderId" })
    order!: Order;

    @Column()
    orderId!: string; // Added explicit foreign key

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    product!: Product;

    @Column()
    productId!: string; // Added explicit foreign key

    @Column()
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unitPrice!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}