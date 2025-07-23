// app/db/entities/supplier.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./products"; // <-- ❌ REMOVE THIS LINE

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  // Add the new fields you had in your UI/types if they are now part of the backend
  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: "text", nullable: true }) // Assuming longer text
  notes?: string;

  @Column({
    type: "enum",
    enum: ["Active", "Inactive"],
    default: "Active",
  })
  status!: "Active" | "Inactive";


  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;
  @Column()
  createdById!: string;

  // The arrow function `() => Product` correctly lazy-loads it.
  // The TypeORM decorator doesn't need the explicit top-level import to work.
 @OneToMany(() => Product, product => product.supplier)
  products!: Product[]; // Use interface to avoid direct import

  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
export interface IProduct {
  id: number;
  supplier: Supplier;
}
