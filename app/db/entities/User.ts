import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    STAFF = "staff",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;
    
    @Column({ nullable: true })
    verificationToken?: string;

    @Column({ type: "timestamptz", nullable: true })
    verificationTokenExpiresAt?: Date;

    @Column({ type: "enum", enum: UserRole, default: UserRole.STAFF })
    role!: UserRole;

    @Column({ default: false })
    isVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
}