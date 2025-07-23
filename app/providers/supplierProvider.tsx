// src/contexts/SupplierContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from "next/navigation"; // useRouter is imported in your example, keeping it here

// Import your defined types
import {
    Supplier,
    CreateSupplierData,
    UpdateSupplierData,
    SupplierContextType,
    User // Assuming User interface is also in types
} from '../types/index'; // Adjust the import path as per your project structure

// Context creation with an initial undefined value
const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

// Props interface for the SupplierProvider
interface SupplierProviderProps {
    children: ReactNode;
    // You might want to pass the current user's ID here if not getting from another context
    // For now, assuming you'll get it where you call getAllSuppliersForUser
}

export function SupplierProvider({ children }: SupplierProviderProps) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const router = useRouter(); // Keeping router for consistency with your example, though not strictly used in all methods here

    // Helper to set headers, including Authorization token if available (assuming you manage it globally)
    // In a real app, you'd get this from an AuthContext or a secure storage
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token'); // Example: get token from localStorage
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    };

    // Fetch all suppliers (GET /api/supplier)
    const getAllSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/supplier', {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const result: { success: boolean; data?: Supplier[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setSuppliers(result.data);
            } else {
                setError(result.message || 'Failed to fetch all suppliers');
            }
        } catch (err: any) {
            setError('An error occurred while fetching all suppliers: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies as it's a general fetch

    // Fetch suppliers for a specific user (GET /api/supplier/user/{userId})
    // Note: The backend route expects a userId in the path.
    // Ensure you pass the current logged-in user's ID to this function from your UI.
    const getAllSuppliersForUser = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/user/${userId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const result: { success: boolean; data?: Supplier[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setSuppliers(result.data);
            } else {
                setError(result.message || 'Failed to fetch user-specific suppliers');
            }
        } catch (err: any) {
            setError('An error occurred while fetching user-specific suppliers: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []); // userId is a parameter, so it's not a dependency here

    // Get a single supplier by ID (GET /api/supplier/{id})
    const getSupplier = useCallback(async (id: string): Promise<Supplier | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const result: { success: boolean; data?: Supplier; message?: string } = await response.json();

            if (result.success && result.data) {
                return result.data;
            } else {
                setError(result.message || 'Failed to fetch supplier');
                return null;
            }
        } catch (err: any) {
            setError('An error occurred while fetching the supplier: ' + err.message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create a new supplier (POST /api/supplier)
    const createSupplier = useCallback(async (data: CreateSupplierData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            // The `createdById` field is expected by your backend service.
            // As per the backend API, it's typically inferred from the auth token
            // by the `withAuth` middleware and service layer.
            // So, you usually don't send it from the frontend explicitly in the body,
            // but ensure your authentication setup is passing the token.
            const response = await fetch('/api/supplier', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            const result: { success: boolean; data?: Supplier; message?: string } = await response.json();

            if (result.success && result.data) {
                setSuppliers(prev => [...prev, result.data!]); // Add new supplier to state
                return true;
            } else {
                setError(result.message || 'Failed to create supplier');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while creating the supplier: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update an existing supplier (PUT /api/supplier/{id})
    const updateSupplier = useCallback(async (id: string, data: UpdateSupplierData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            const result: { success: boolean; data?: Supplier; message?: string } = await response.json();

            if (result.success && result.data) {
                setSuppliers(prev =>
                    prev.map(supplier =>
                        supplier.id === id ? { ...supplier, ...result.data } : supplier
                    )
                );
                // If the selected supplier is updated, update it as well
                if (selectedSupplier && selectedSupplier.id === id) {
                    setSelectedSupplier(result.data);
                }
                return true;
            } else {
                setError(result.message || 'Failed to update supplier');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while updating the supplier: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedSupplier]); // Dependency on selectedSupplier

    // Delete a supplier (DELETE /api/supplier/{id})
    const deleteSupplier = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            const result: { success: boolean; message?: string } = await response.json();

            if (result.success) {
                setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
                // Clear selected supplier if it was the one deleted
                if (selectedSupplier && selectedSupplier.id === id) {
                    setSelectedSupplier(null);
                }
                return true;
            } else {
                setError(result.message || 'Failed to delete supplier');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while deleting the supplier: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedSupplier]); // Dependency on selectedSupplier

    // Select a supplier for detailed view or editing
  const selectSupplier = useCallback((supplier: Supplier | null) => {
    setSelectedSupplier(supplier);
}, []);

    // Initial load: Fetch all suppliers created by the current user
    // You'll need to pass the actual logged-in user ID here.
    // Example: If you have an AuthContext, get the user ID from it.
    // For now, let's assume a placeholder or that `getAllSuppliers()` is preferred initially.
    useEffect(() => {
        // You would typically get the userId from your AuthContext here.
        // For demonstration, let's assume you're calling a generic getAllSuppliers()
        // Or if you have a dummy user ID or are sure the backend handles /user without ID
        getAllSuppliers();
        // If you specifically want to use getAllSuppliersForUser, ensure you have the userId:
        // const currentUserId = "YOUR_LOGGED_IN_USER_ID_HERE"; // Replace with actual user ID from AuthContext
        // if (currentUserId) {
        //   getAllSuppliersForUser(currentUserId);
        // } else {
        //   getAllSuppliers(); // Fallback if no user is logged in or user ID is unavailable
        // }
    }, [getAllSuppliers]); // Only re-run if getAllSuppliers changes (which it won't due to useCallback)

    // The value object to be passed to consumers of the context
    const value: SupplierContextType = {
        suppliers,
        loading,
        error,
        selectedSupplier,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        getSupplier,
        getAllSuppliers,
        getAllSuppliersForUser,
        selectSupplier,
    };

    return (
        <SupplierContext.Provider value={value}>
            {children}
        </SupplierContext.Provider>
    );
}

// Custom hook to consume the WarehouseContext
export function useSupplier() {
    const context = useContext(SupplierContext);
    if (context === undefined) {
        throw new Error('useSupplier must be used within a SupplierProvider');
    }
    return context;
}