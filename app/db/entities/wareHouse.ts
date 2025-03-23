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

    // Relation to User - Many warehouses can be created by one user
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'createdById' })
    createdBy!: User;

    @Column()
    createdById!: string;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
}