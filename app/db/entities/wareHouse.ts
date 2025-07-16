// src/entities/wareHouse.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class WareHouse {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    location!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: true })
    isActive!: boolean;

    @Column()
    capacity!: number;

    @Column({ default: 0 })
    currentOccupancy!: number;

    @Column({ nullable: true })
    contactPhone?: string;

    @Column({ nullable: true })
    contactEmail?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'createdById' })
    createdBy!: User;

    @Column({ nullable: true })
    createdById!: string;

    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;
}