import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
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
  description!: string;

  @Column({ unique: true })
  sku!: string;

  @Column("int")
  quantity!: number;

  @Column({ nullable: true })
  category!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;


  @ManyToOne(() => WareHouse)
warehouse!: WareHouse;

@Column()
warehouseId!: string;


  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier!: Supplier;

  @ManyToOne(() => User, (user) => user.id)
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
  
      @UpdateDateColumn()
      updatedAt!: Date;
}
