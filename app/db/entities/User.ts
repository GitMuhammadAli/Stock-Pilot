import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Product } from "./products";

export enum UserRole {
    ADMIN = "admin",
    STAFF = "staff",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!:string

    @Column({ unique: true })
    email!: string;
    
    @Column({ nullable: true })
    verificationToken?: string;

    @Column({ type: "timestamptz", nullable: true })
    verificationTokenExpiresAt?: Date;

    @Column({ type: "enum", enum: UserRole, default: UserRole.STAFF })
    role!: UserRole;

    // @ManyToMany(()=> Product , (product)=>product.user)
    // products!:Product[];

    @ManyToMany(() => Product,            (product: { user: any; }) => product.user)
products!: any[];

    @Column({ default: false })
    isVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
    

    @UpdateDateColumn()
    updatedAt!: Date;
}