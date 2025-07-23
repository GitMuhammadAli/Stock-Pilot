// src/contexts/OrderContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from "next/navigation";

// Import your defined types
import {
    Order,
    OrderStatus,
    CreateOrderData,
    UpdateOrderData,
    OrderContextType,
    User, // Ensure these are imported if embedded
    Supplier,
    Warehouse
} from '../types/index'; // Adjust the import path

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
    children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const router = useRouter();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    };

    // --- Fetch Operations ---

    // Get all orders (GET /api/order)
    const getAllOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/order', {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Order[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(result.data);
            } else {
                setError(result.message || 'Failed to fetch all orders');
            }
        } catch (err: any) {
            setError('An error occurred while fetching all orders: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get orders by user (GET /api/order/user/{userId})
    const getAllOrdersForUser = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/user/${userId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Order[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(result.data);
            } else {
                setError(result.message || `Failed to fetch orders for user ${userId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching orders for user ${userId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get orders by supplier (GET /api/order/supplier/{supplierId})
    const getAllOrdersForSupplier = useCallback(async (supplierId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/supplier/${supplierId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Order[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(result.data);
            } else {
                setError(result.message || `Failed to fetch orders for supplier ${supplierId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching orders for supplier ${supplierId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get orders by warehouse (GET /api/order/warehouse/{warehouseId})
    const getAllOrdersForWarehouse = useCallback(async (warehouseId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/warehouse/${warehouseId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Order[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(result.data);
            } else {
                setError(result.message || `Failed to fetch orders for warehouse ${warehouseId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching orders for warehouse ${warehouseId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get orders by status (GET /api/order/status/{status})
    const getAllOrdersByStatus = useCallback(async (status: OrderStatus) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/status/${status}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Order[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(result.data);
            } else {
                setError(result.message || `Failed to fetch orders with status ${status}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching orders with status ${status}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a single order by ID (GET /api/order/{id})
    const getOrder = useCallback(async (id: string): Promise<Order | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: Order; message?: string } = await response.json();

            if (result.success && result.data) {
                return result.data;
            } else {
                setError(result.message || 'Failed to fetch order');
                return null;
            }
        } catch (err: any) {
            setError('An error occurred while fetching the order: ' + err.message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Mutation Operations ---

    // Create a new order (POST /api/order)
    const createOrder = useCallback(async (data: CreateOrderData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            const result: { success: boolean; data?: Order; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(prev => [...prev, result.data!]); // Add new order to state
                return true;
            } else {
                setError(result.message || 'Failed to create order');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while creating the order: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update an existing order (PUT /api/order/{id})
    const updateOrder = useCallback(async (id: string, data: UpdateOrderData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            const result: { success: boolean; data?: Order; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(prev =>
                    prev.map(order =>
                        order.id === id ? { ...order, ...result.data } : order
                    )
                );
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(result.data);
                }
                return true;
            } else {
                setError(result.message || 'Failed to update order');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while updating the order: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedOrder]);

    // Update an order's status (PUT /api/order/{id}/status)
    const updateOrderStatus = useCallback(async (id: string, status: OrderStatus): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/${id}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status }),
            });
            const result: { success: boolean; data?: Order; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrders(prev =>
                    prev.map(order =>
                        order.id === id ? { ...order, status: result.data!.status } : order
                    )
                );
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(prev => (prev ? { ...prev, status: result.data!.status } : null));
                }
                return true;
            } else {
                setError(result.message || 'Failed to update order status');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while updating the order status: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedOrder]);


    // Delete an order (DELETE /api/order/{id})
    const deleteOrder = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; message?: string } = await response.json();

            if (result.success) {
                setOrders(prev => prev.filter(order => order.id !== id));
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(null);
                }
                return true;
            } else {
                setError(result.message || 'Failed to delete order');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while deleting the order: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedOrder]);

    // Select an order for detailed view or editing
    const selectOrder = useCallback((order: Order) => {
        setSelectedOrder(order);
    }, []);

    // Initial load: Fetch all orders
    useEffect(() => {
        getAllOrders();
    }, [getAllOrders]);

    const value: OrderContextType = {
        orders,
        loading,
        error,
        selectedOrder,
        createOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        getOrder,
        getAllOrders,
        getAllOrdersForUser,
        getAllOrdersForSupplier,
        getAllOrdersForWarehouse,
        getAllOrdersByStatus,
        selectOrder,
    };

return (
  <OrderContext.Provider value={value}>
    {children}
  </OrderContext.Provider>
);
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}

