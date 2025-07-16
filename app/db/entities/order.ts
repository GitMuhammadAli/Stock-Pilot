import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Supplier } from "./supplier";
import { WareHouse } from "./wareHouse";

export enum OrderStatus {
    PENDING = "pending",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    orderNumber!: string;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplierId' })
    supplier!: Supplier;
    @Column()
    supplierId!: string;

    @ManyToOne(() => WareHouse)
    @JoinColumn({ name: 'warehouseId' })
    warehouse!: WareHouse;
    @Column()
    warehouseId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdById' })
    createdBy!: User;
    @Column()
    createdById!: string;

    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;
}