// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// export enum UserRole {
//     ADMIN = "admin",
//     STAFF = "staff",
// }

// @Entity()
// export class User {
//     @PrimaryGeneratedColumn("uuid")
//     id!: string;

//     @Column()
//     name!: string;

//     @Column({ unique: true })
//     email!: string;
    
//     @Column({ nullable: true })
//     verificationToken?: string;

//     @Column({ type: "timestamptz", nullable: true })
//     verificationTokenExpiresAt?: Date;

//     @Column({ type: "enum", enum: UserRole, default: UserRole.STAFF })
//     role!: UserRole;

//     @Column({ default: false })
//     isVerified!: boolean;

//     @CreateDateColumn()
//     createdAt!: Date;
    
//     @UpdateDateColumn()
//     updatedAt!: Date;
// }


import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./../base/baseEntity";

export enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    STAFF = "staff",
    VIEWER = "viewer"
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_VERIFICATION = "pending_verification"
}

@Entity("users")
@Index(["email"], { unique: true })
@Index(["role"])
@Index(["status"])
@Index(["isVerified"])
export class User extends BaseEntity {
    @Column({ length: 100 })
    name!: string;

    @Column({ length: 255, unique: true })
    email!: string;

    @Column({ length: 500, nullable: true, select: false }) // Don't select by default for security
    verificationToken?: string;

    @Column({ type: "timestamp", nullable: true })
    verificationTokenExpiresAt?: Date;

    @Column({ type: "enum", enum: UserRole, default: UserRole.STAFF })
    role!: UserRole;

    @Column({ type: "enum", enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
    status!: UserStatus;

    @Column({ default: false })
    isVerified!: boolean;

    @Column({ type: "timestamp", nullable: true })
    lastLoginAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    emailVerifiedAt?: Date;

    // JSON field for storing user preferences and settings
    @Column({ type: "json", nullable: true })
    preferences?: Record<string, any>;

    // Audit fields
    @Column({ length: 45, nullable: true }) // IPv4/IPv6 address length
    lastLoginIp?: string;

    @Column({ type: "int", default: 0 })
    loginAttempts!: number;

    @Column({ type: "timestamp", nullable: true })
    lockedUntil?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    normalizeEmail() {
        if (this.email) {
            this.email = this.email.toLowerCase().trim();
        }
    }

    // Business logic methods
    isActive(): boolean {
        return this.status === UserStatus.ACTIVE && this.isVerified && !this.isDeleted();
    }

    canPerform(action: string): boolean {
        if (!this.isActive()) return false;
        
        const permissions = {
            [UserRole.ADMIN]: ['*'],
            [UserRole.MANAGER]: ['create', 'read', 'update', 'manage_inventory'],
            [UserRole.STAFF]: ['read', 'update'],
            [UserRole.VIEWER]: ['read']
        };
        
        return permissions[this.role]?.includes('*') || permissions[this.role]?.includes(action) || false;
    }

    isLocked(): boolean {
        return this.lockedUntil ? this.lockedUntil > new Date() : false;
    }
}