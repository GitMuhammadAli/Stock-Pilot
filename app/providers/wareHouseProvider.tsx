"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from "next/navigation";

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

interface WarehouseContextType {
    warehouses: Warehouse[];
    loading: boolean;
    error: string | null;
    selectedWarehouse: Warehouse | null;
    createWarehouse: (data: CreateWarehouseData) => Promise<boolean>;
    updateWarehouse: (id: string, data: UpdateWarehouseData) => Promise<boolean>;
    deleteWarehouse: (id: string) => Promise<boolean>;
    getWarehouse: (id: string) => Promise<Warehouse | null>;
    getAllWarehouses: () => Promise<void>;
    getAllWarehousesForUser: () => Promise<void>;
    selectWarehouse: (warehouse: Warehouse) => void;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export function WarehouseProvider({ children }: { children: ReactNode }) {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const router = useRouter();

    // Fetch all warehouses (general function)
    const getAllWarehouses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/warehouse', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
console.log("ware" , result.data)
            if (result.success) {
                setWarehouses(result.data);
            } else {
                setError(result.message || 'Failed to fetch warehouses');
            }
        } catch (err) {
            setError('An error occurred while fetching warehouses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch warehouses for the current user
    const getAllWarehousesForUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/warehouse/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            console.log(result)
            if (result.success) {
                setWarehouses(result.data.data);
            } else {
                setError(result.message || 'Failed to fetch user warehouses');
            }
        } catch (err) {
            setError('An error occurred while fetching user warehouses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Get a single warehouse by ID
    const getWarehouse = async (id: string): Promise<Warehouse | null> => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    // Create a new warehouse
    const createWarehouse = async (data: CreateWarehouseData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/warehouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                // Add the new warehouse to the state
                setWarehouses(prev => [...prev, result.data]);
                return true;
            } else {
                setError(result.message || 'Failed to create warehouse');
                return false;
            }
        } catch (err) {
            setError('An error occurred while creating the warehouse');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing warehouse
    const updateWarehouse = async (id: string, data: UpdateWarehouseData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/warehouse/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                // Update the warehouse in the state
                setWarehouses(prev =>
                    prev.map(warehouse =>
                        warehouse.id === id ? { ...warehouse, ...result.data } : warehouse
                    )
                );

                // Update selected warehouse if it's the one being edited
                if (selectedWarehouse && selectedWarehouse.id === id) {
                    setSelectedWarehouse({ ...selectedWarehouse, ...result.data });
                }

                return true;
            } else {
                setError(result.message || 'Failed to update warehouse');
                return false;
            }
        } catch (err) {
            setError('An error occurred while updating the warehouse');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Delete a warehouse
    const deleteWarehouse = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/warehouse/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                // Remove the warehouse from the state
                setWarehouses(prev => prev.filter(warehouse => warehouse.id !== id));

                // Clear selected warehouse if it's the one being deleted
                if (selectedWarehouse && selectedWarehouse.id === id) {
                    setSelectedWarehouse(null);
                }

                return true;
            } else {
                setError(result.message || 'Failed to delete warehouse');
                return false;
            }
        } catch (err) {
            setError('An error occurred while deleting the warehouse');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Select a warehouse for detailed view or editing
    const selectWarehouse = (warehouse: Warehouse) => {
        setSelectedWarehouse(warehouse);
    };

    // Load warehouses on initial mount
    useEffect(() => {
        getAllWarehousesForUser();
    }, []);

    const value = {
        warehouses,
        loading,
        error,
        selectedWarehouse,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
        getWarehouse,
        getAllWarehouses,
        getAllWarehousesForUser,
        selectWarehouse
    };

    return (
        <WarehouseContext.Provider value={value}>
            {children}
        </WarehouseContext.Provider>
    );
}

export function useWarehouse() {
    const context = useContext(WarehouseContext);
    if (context === undefined) {
        throw new Error('useWarehouse must be used within a WarehouseProvider');
    }
    return context;
}
