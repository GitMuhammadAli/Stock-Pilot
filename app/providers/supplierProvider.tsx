    // src/contexts/SupplierContext.tsx
    "use client";

    import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
    useRef,
    } from "react";
    import { useRouter } from "next/navigation";

    import {
    Supplier,
    CreateSupplierData,
    UpdateSupplierData,
    SupplierContextType,
    User,
    } from "../types/index"; // adjust path

    // Context creation
    const SupplierContext = createContext<SupplierContextType | undefined>(
    undefined
    );

    interface SupplierProviderProps {
    children: ReactNode;
    }

    export function SupplierProvider({ children }: SupplierProviderProps) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null
    );
    const router = useRouter();

    const hasFetched = useRef(false); // ✅ prevents duplicate fetches

    // ✅ Helper to build headers with token
    const getAuthHeaders = () => {
        const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
        return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        };
    };

    // ================== API METHODS ==================

    // Fetch all suppliers
    const getAllSuppliers = useCallback(
        async (force = false) => {
        if (suppliers.length > 0 && !force) return; // ✅ use cache
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/supplier", {
            method: "GET",
            headers: getAuthHeaders(),
            });

            const result: {
            success: boolean;
            data?: Supplier[];
            message?: string;
            } = await response.json();

            if (result.success && result.data) {
            setSuppliers(result.data);
            } else {
            setError(result.message || "Failed to fetch all suppliers");
            }
        } catch (err: any) {
            setError("An error occurred while fetching all suppliers");
            console.error(err);
        } finally {
            setLoading(false);
        }
        },
        [suppliers.length]
    );

    // Fetch suppliers for specific user
    const getAllSuppliersForUser = useCallback(
        async (userId: string, force = false) => {
        if (suppliers.length > 0 && !force) return; // ✅ use cache
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/user/${userId}`, {
            method: "GET",
            headers: getAuthHeaders(),
            });

            const result: {
            success: boolean;
            data?: Supplier[];
            message?: string;
            } = await response.json();

            if (result.success && result.data) {
            setSuppliers(result.data);
            } else {
            setError(result.message || "Failed to fetch user suppliers");
            }
        } catch (err: any) {
            setError("An error occurred while fetching user suppliers");
            console.error(err);
        } finally {
            setLoading(false);
        }
        },
        [suppliers.length]
    );

    // Fetch single supplier
    const getSupplier = useCallback(async (id: string): Promise<Supplier | null> => {
        // ✅ check cache first
        const existing = suppliers.find((s) => s.id === id);
        if (existing) {
        setSelectedSupplier(existing);
        return existing;
        }

        setLoading(true);
        setError(null);
        try {
        const response = await fetch(`/api/supplier/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        const result: {
            success: boolean;
            data?: Supplier;
            message?: string;
        } = await response.json();

        if (result.success && result.data) {
            setSelectedSupplier(result.data);
            return result.data;
        } else {
            setError(result.message || "Failed to fetch supplier");
            return null;
        }
        } catch (err: any) {
        setError("An error occurred while fetching supplier");
        console.error(err);
        return null;
        } finally {
        setLoading(false);
        }
    }, [suppliers]);

    // Create supplier
    const createSupplier = useCallback(async (data: CreateSupplierData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
        const response = await fetch("/api/supplier", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result: {
            success: boolean;
            data?: Supplier;
            message?: string;
        } = await response.json();

        if (result.success && result.data) {
            setSuppliers((prev) => [...prev, result.data!]);
            return true;
        } else {
            setError(result.message || "Failed to create supplier");
            return false;
        }
        } catch (err: any) {
        setError("An error occurred while creating supplier");
        console.error(err);
        return false;
        } finally {
        setLoading(false);
        }
    }, []);

    // Update supplier
    const updateSupplier = useCallback(
        async (id: string, data: UpdateSupplierData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
            });

            const result: {
            success: boolean;
            data?: Supplier;
            message?: string;
            } = await response.json();

            if (result.success && result.data) {
            setSuppliers((prev) =>
                prev.map((s) => (s.id === id ? { ...s, ...result.data } : s))
            );
            if (selectedSupplier?.id === id) {
                setSelectedSupplier({ ...selectedSupplier, ...result.data });
            }
            return true;
            } else {
            setError(result.message || "Failed to update supplier");
            return false;
            }
        } catch (err: any) {
            setError("An error occurred while updating supplier");
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
        },
        [selectedSupplier]
    );

    // Delete supplier
    const deleteSupplier = useCallback(
        async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/supplier/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            });

            const result: { success: boolean; message?: string } =
            await response.json();

            if (result.success) {
            setSuppliers((prev) => prev.filter((s) => s.id !== id));
            if (selectedSupplier?.id === id) {
                setSelectedSupplier(null);
            }
            return true;
            } else {
            setError(result.message || "Failed to delete supplier");
            return false;
            }
        } catch (err: any) {
            setError("An error occurred while deleting supplier");
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
        },
        [selectedSupplier]
    );

    // Select supplier
    const selectSupplier = useCallback((supplier: Supplier | null) => {
        setSelectedSupplier(supplier);
    }, []);

    // ================== INITIAL LOAD ==================
    useEffect(() => {
        if (!hasFetched.current) {
        getAllSuppliers(); 
        hasFetched.current = true;
        }
    }, [getAllSuppliers]);

    // ================== CONTEXT VALUE ==================
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

    // Custom hook
    export function useSupplier() {
    const context = useContext(SupplierContext);
    if (!context) {
        throw new Error("useSupplier must be used within a SupplierProvider");
    }
    return context;
    }
