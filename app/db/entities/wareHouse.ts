// // src/entities/wareHouse.ts
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
// import { User } from "./User";

// @Entity()
// export class WareHouse {
//     @PrimaryGeneratedColumn("uuid")
//     id!: string;

//     @Column()
//     name!: string;

//     @Column()
//     location!: string;

//     @Column({ nullable: true })
//     description?: string;

//     @Column({ default: true })
//     isActive!: boolean;

//     @Column()
//     capacity!: number;

//     @Column({ default: 0 })
//     currentOccupancy!: number;

//     @Column({ nullable: true })
//     contactPhone?: string;

//     @Column({ nullable: true })
//     contactEmail?: string;

//     @ManyToOne(() => User, { onDelete: 'SET NULL' })
//     @JoinColumn({ name: 'createdById' })
//     createdBy!: User;

//     @Column({ nullable: true })
//     createdById!: string;

//     @CreateDateColumn()
//     createdAt!: Date;
//     @UpdateDateColumn()
//     updatedAt!: Date;
// }


import { Entity, Column, ManyToOne, JoinColumn, Index, Check } from "typeorm";
import { BaseEntity } from "./../base/baseEntity";
import { User } from "./User";

export enum WarehouseStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    MAINTENANCE = "maintenance",
    FULL = "full"
}

@Entity("warehouses")
@Index(["status"])
@Index(["isActive"])
@Index(["createdById"])
@Check(`"currentOccupancy" <= "capacity"`) // Database constraint
export class WareHouse extends BaseEntity {
    @Column({ length: 255 })
    name!: string;

    @Column({ length: 500 })
    location!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ type: "enum", enum: WarehouseStatus, default: WarehouseStatus.ACTIVE })
    status!: WarehouseStatus;

    @Column({ type: "int" })
    capacity!: number;

    @Column({ type: "int", default: 0 })
    currentOccupancy!: number;

    @Column({ length: 20, nullable: true })
    contactPhone?: string;

    @Column({ length: 255, nullable: true })
    contactEmail?: string;

    // Geographic coordinates for location-based queries
    @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
    latitude?: number;

    @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
    longitude?: number;

    // Operating hours
    @Column({ type: "json", nullable: true })
    operatingHours?: {
        monday?: { open: string; close: string };
        tuesday?: { open: string; close: string };
        wednesday?: { open: string; close: string };
        thursday?: { open: string; close: string };
        friday?: { open: string; close: string };
        saturday?: { open: string; close: string };
        sunday?: { open: string; close: string };
    };

    // Foreign key with proper cascade handling
    @ManyToOne("User", { lazy: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'createdById' })
    createdBy?: Promise<User> | User;

    @Column({ nullable: true })
    createdById?: string;

    // Business logic methods
    getOccupancyRate(): number {
        return this.capacity > 0 ? (this.currentOccupancy / this.capacity) * 100 : 0;
    }

    getAvailableCapacity(): number {
        return Math.max(0, this.capacity - this.currentOccupancy);
    }

    isFull(): boolean {
        return this.currentOccupancy >= this.capacity;
    }

    canAccommodate(quantity: number): boolean {
        return this.getAvailableCapacity() >= quantity && this.status === WarehouseStatus.ACTIVE;
    }
}
