import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User"; 
import { Supplier } from "./supplier"; 
import { WareHouse } from "./wareHouse";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string; 

  @Column({ unique: true })
  sku!: string;

  @Column("int")
  quantity!: number;

  @Column({ nullable: true })
  category?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => WareHouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse!: WareHouse;
  @Column()
  warehouseId!: string;


   @ManyToOne(() => Supplier, supplier => supplier.products)
  supplier!: Supplier;

  @Column()
  supplierId!: string;

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