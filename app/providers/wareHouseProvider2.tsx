"use client"


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { Result } from 'postcss';

interface User {
    userId: string;
    email: string;
    role: string;
    name: string;
    isVerified: boolean;
}


interface Warehouse {
    id: string
    name: string
    location: string
    description?: string
    isActive: boolean
    capacity: number
    currentOccupancy: number
    contactPhone?: string
    contactEmail?: string
    createdById: string
    createdBy: User
    createdAt: Date
    updatedAt: Date
}


interface CreateWarehouseData {
    name: string;
    location: string;
    description?: string;
    capacity: number;
    contactPhone?: string;
    contactEmail?: string;
}

interface UpdateWarehouseData {
    name?: string;
    location?: string;
    description?: string;
    isActive?: boolean;
    capacity?: number;
    currentOccupancy?: number;
    contactPhone?: string;
    contactEmail?: string;
}
interface wareHouseContextType {
    warehouses: Warehouse[];
    loading: boolean;
    error: string | null;
    // selectedWarehouse: Warehouse | null;
    // createWarehouse: (data: CreateWarehouseData) => Promise<boolean>;
    // updateWarehouse: (id: string, data: UpdateWarehouseData) => Promise<boolean>;
    // deleteWarehouse: (id: string) => Promise<boolean>;
    // getWarehouse: (id: string) => Promise<Warehouse | null>;
    getAllWarehousesForUser: () => Promise<void>;
    // selectWarehouse: (warehouse: Warehouse) => void;
}


const wareHouseContext = createContext<wareHouseContextType | undefined>(undefined)


export function WarehouseProvider({ children }: { children: ReactNode }) {
    const [warehouses, setwarehouses] = useState<Warehouse[]>([])
    const [loading, setloading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const router = useRouter();


    const getAllWarehousesForUser = async () => {
        setloading(true);
        setError(null);
        try {
            const response = await fetch('/api/warehouse/getByUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                setwarehouses(result.data.data);
            } else {
                setError(result.message || 'Failed to fetch warehouses');
            }
        } catch (err) {
            setError('An error occurred while fetching warehouses');
            console.error(err);
        } finally {
            setloading(false);
        }
    };

    const getWarehouse = async (id: string): Promise<Warehouse | null> => {
        setloading(true);
        setError(null);
        try {
            const response = await fetch(`/api/warehouse/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                return result.data;
            } else {
                setError(result.message || 'Failed to fetch warehouse');
                return null;
            }
        } catch (err) {
            setError('An error occurred while fetching the warehouse');
            console.error(err);
            return null;
        } finally {
            setloading(false);
        }
    };

    // const createWarehouse = async ():Promise<CreateWarehouseData| null>=>{

    // }

    useEffect(() => {
        getAllWarehousesForUser();
        // getWarehouse
    }, []);


    const value = {
        warehouses,
        loading,
        error,
        getAllWarehousesForUser,
        getWarehouse,
        // createWarehouse,
    }
    return (
        <wareHouseContext.Provider value={value}>
            {children}
        </wareHouseContext.Provider>
    )
}


export function useWarehouse () {
    const context = useContext(wareHouseContext)
    if (context === undefined) {
        throw new Error('wareHouseContext must be used within an AuthProvider');
    }
    return context;
};