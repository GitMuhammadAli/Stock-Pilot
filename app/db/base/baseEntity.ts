import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Index } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    @Index() // Index for soft delete queries
    deletedAt?: Date;

    // Soft delete method
    softDelete(): void {
        this.deletedAt = new Date();
    }

    // Restore method
    restore(): void {
        this.deletedAt = undefined;
    }

    // Check if entity is deleted
    isDeleted(): boolean {
        return this.deletedAt !== undefined && this.deletedAt !== null;
    }
}