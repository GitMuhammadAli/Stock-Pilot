import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./products";

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
name!: string;

  @Column({ nullable: true })
email!: string;

  @Column({ nullable: true })
phone!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @ManyToOne(() => User, (user) => user.id)
  createdBy!: User;

  @OneToMany(() => Product, (product) => product.supplier)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
        updatedAt!: Date;
}
