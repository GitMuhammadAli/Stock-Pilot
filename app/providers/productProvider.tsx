// src/contexts/ProductContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from "next/navigation"; // Keeping consistent with your example

// Import your defined types
import {
    Product,
    CreateProductData,
    UpdateProductData,
    ProductContextType,
    User, // Ensure this is imported if you're using it in Product type
    Supplier, // Ensure this is imported for embedded Supplier in Product type
    Warehouse // Ensure this is imported for embedded Warehouse in Product type
} from '../types/index'; // Adjust the import path as per your project structure

// Context creation with an initial undefined value
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Props interface for the ProductProvider
interface ProductProviderProps {
    children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const router = useRouter();

    // Helper to set headers, including Authorization token if available
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token'); // Example: get token from localStorage
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    };

    // --- Fetch Operations ---

    // Get all products (GET /api/product)
    const getAllProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/product', {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Product[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setProducts(result.data);
            } else {
                setError(result.message || 'Failed to fetch all products');
            }
        } catch (err: any) {
            setError('An error occurred while fetching all products: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get products created by a specific user (GET /api/product/user/{userId})
    const getAllProductsForUser = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/product/user/${userId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Product[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setProducts(result.data);
            } else {
                setError(result.message || `Failed to fetch products for user ${userId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching products for user ${userId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get products from a specific supplier (GET /api/product/supplier/{supplierId})
    const getAllProductsForSupplier = useCallback(async (supplierId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/product/supplier/${supplierId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Product[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setProducts(result.data);
            } else {
                setError(result.message || `Failed to fetch products for supplier ${supplierId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching products for supplier ${supplierId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get products in a specific warehouse (GET /api/product/warehouse/{warehouseId})
    const getAllProductsForWarehouse = useCallback(async (warehouseId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/product/warehouse/${warehouseId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Product[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setProducts(result.data);
            } else {
                setError(result.message || `Failed to fetch products for warehouse ${warehouseId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching products for warehouse ${warehouseId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a single product by ID (GET /api/product/{id})
    const getProduct = useCallback(async (id: string): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Product; message?: string } = await response.json();

            if (result.success && result.data) {
                return result.data;
            } else {
                setError(result.message || 'Failed to fetch product');
                return null;
            }
        } catch (err: any) {
            setError('An error occurred while fetching the product: ' + err.message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Mutation Operations ---

    // Create a new product (POST /api/product)
    const createProduct = useCallback(async (data: CreateProductData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/product', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            const result: { success: boolean; data?: Product; message?: string } = await response.json();

            if (result.success && result.data) {
                setProducts(prev => [...prev, result.data!]); // Add new product to state
                return true;
            } else {
                setError(result.message || 'Failed to create product');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while creating the product: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update an existing product (PUT /api/product/{id})
    const updateProduct = useCallback(async (id: string, data: UpdateProductData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            const result: { success: boolean; data?: Product; message?: string } = await response.json();

            if (result.success && result.data) {
                setProducts(prev =>
                    prev.map(product =>
                        product.id === id ? { ...product, ...result.data } : product
                    )
                );
                if (selectedProduct && selectedProduct.id === id) {
                    setSelectedProduct(result.data);
                }
                return true;
            } else {
                setError(result.message || 'Failed to update product');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while updating the product: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedProduct]);

    // Delete a product (DELETE /api/product/{id})
    const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; message?: string } = await response.json();

            if (result.success) {
                setProducts(prev => prev.filter(product => product.id !== id));
                if (selectedProduct && selectedProduct.id === id) {
                    setSelectedProduct(null);
                }
                return true;
            } else {
                setError(result.message || 'Failed to delete product');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while deleting the product: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedProduct]);

    // Select a product for detailed view or editing
    const selectProduct = useCallback((product: Product) => {
        setSelectedProduct(product);
    }, []);

    // Initial load: Fetch all products
    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]); // Only re-run if getAllProducts changes (won't due to useCallback)

    // The value object to be passed to consumers of the context
    const value: ProductContextType = {
        products,
        loading,
        error,
        selectedProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getAllProducts,
        getAllProductsForUser,
        getAllProductsForSupplier,
        getAllProductsForWarehouse,
        selectProduct,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

// Custom hook to consume the ProductContext
export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
}