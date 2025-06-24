import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order";
import { Product } from "./products";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    @ManyToOne(() => Order)
    @JoinColumn({ name: "orderId" })
    orderId!: string;

    @Column()
    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    productId!: string;

    @Column()
    quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unitPrice!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}