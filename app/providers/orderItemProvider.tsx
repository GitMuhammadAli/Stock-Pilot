// src/contexts/OrderItemContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from "next/navigation";

// Import your defined types
import {
    OrderItem,
    CreateOrderItemData,
    UpdateOrderItemData,
    OrderItemContextType,
    Order, // Ensure these are imported if embedded
    Product
} from '../types/index'; // Adjust the import path

const OrderItemContext = createContext<OrderItemContextType | undefined>(undefined);

interface OrderItemProviderProps {
    children: ReactNode;
}

export function OrderItemProvider({ children }: OrderItemProviderProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null);
    const [orderTotal, setOrderTotal] = useState<number>(0); // For the total of the currently fetched order's items
    const router = useRouter();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    };

    // --- Fetch Operations ---

    // Get all order items (GET /api/order-item)
    const getAllOrderItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/order-item', {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: OrderItem[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrderItems(result.data);
            } else {
                setError(result.message || 'Failed to fetch all order items');
            }
        } catch (err: any) {
            setError('An error occurred while fetching all order items: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get order items for a specific order (GET /api/order-item/order/{orderId})
    const getAllOrderItemsForOrder = useCallback(async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order-item/order/${orderId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: OrderItem[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrderItems(result.data);
                // Optionally fetch total for this order here too, or let component call getOrderItemsTotal
            } else {
                setError(result.message || `Failed to fetch order items for order ${orderId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching order items for order ${orderId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get order items for a specific product (GET /api/order-item/product/{productId})
    const getAllOrderItemsForProduct = useCallback(async (productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order-item/product/${productId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: OrderItem[]; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrderItems(result.data);
            } else {
                setError(result.message || `Failed to fetch order items for product ${productId}`);
            }
        } catch (err: any) {
            setError(`An error occurred while fetching order items for product ${productId}: ` + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a single order item by ID (GET /api/order-item/{id})
    const getOrderItem = useCallback(async (id: string): Promise<OrderItem | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order-item/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; data?: OrderItem; message?: string } = await response.json();

            if (result.success && result.data) {
                return result.data;
            } else {
                setError(result.message || 'Failed to fetch order item');
                return null;
            }
        } catch (err: any) {
            setError('An error occurred while fetching the order item: ' + err.message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get total for a specific order (GET /api/order-item/order/{orderId}/total)
    const getOrderItemsTotal = useCallback(async (orderId: string): Promise<number | null> => {
        setLoading(true); // This loading might be too broad if fetching other things simultaneously
        setError(null);
        try {
            const response = await fetch(`/api/order-item/order/${orderId}/total`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; total?: number; message?: string } = await response.json();

            if (result.success && typeof result.total === 'number') {
                setOrderTotal(result.total); // Update the overall order total state
                return result.total;
            } else {
                setError(result.message || `Failed to fetch total for order ${orderId}`);
                setOrderTotal(0); // Reset total on error
                return null;
            }
        } catch (err: any) {
            setError(`An error occurred while fetching order total for order ${orderId}: ` + err.message);
            console.error(err);
            setOrderTotal(0);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);


    // --- Mutation Operations ---

    // Create a new order item (POST /api/order-item)
    const createOrderItem = useCallback(async (data: CreateOrderItemData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/order-item', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            const result: { success: boolean; data?: OrderItem; message?: string } = await response.json();

            if (result.success && result.data) {
                // To keep orderItems list consistent, might refetch all or add the item
                setOrderItems(prev => [...prev, result.data!]);
                // If this item is for the selectedOrder, update its total
                if (data.orderId === selectedOrderItem?.orderId) { // Check if new item is for the same order
                    getOrderItemsTotal(data.orderId);
                }
                return true;
            } else {
                setError(result.message || 'Failed to create order item');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while creating the order item: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedOrderItem, getOrderItemsTotal]);

    // Update an existing order item (PUT /api/order-item/{id})
    const updateOrderItem = useCallback(async (id: string, data: UpdateOrderItemData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order-item/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            const result: { success: boolean; data?: OrderItem; message?: string } = await response.json();

            if (result.success && result.data) {
                setOrderItems(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, ...result.data } : item
                    )
                );
                if (selectedOrderItem && selectedOrderItem.id === id) {
                    setSelectedOrderItem(result.data);
                }
                // Recalculate total if the quantity or price of an item in the current order changes
                if (result.data.orderId) { // Assuming orderId is returned in updated data
                    getOrderItemsTotal(result.data.orderId);
                }
                return true;
            } else {
                setError(result.message || 'Failed to update order item');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while updating the order item: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedOrderItem, getOrderItemsTotal]);

    // Delete an order item (DELETE /api/order-item/{id})
    const deleteOrderItem = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/order-item/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const result: { success: boolean; message?: string; data?: OrderItem } = await response.json(); // Backend might return deleted item

            if (result.success) {
                setOrderItems(prev => prev.filter(item => item.id !== id));
                if (selectedOrderItem && selectedOrderItem.id === id) {
                    setSelectedOrderItem(null);
                }
                // If this item belonged to a currently active order, update its total
                if (result.data?.orderId) { // Check if backend returned the deleted item data
                    getOrderItemsTotal(result.data.orderId);
                } else if (orderItems.find(item => item.id === id)?.orderId) { // Fallback if backend doesn't return deleted item
                    getOrderItemsTotal(orderItems.find(item => item.id === id)?.orderId as string);
                }
                return true;
            } else {
                setError(result.message || 'Failed to delete order item');
                return false;
            }
        } catch (err: any) {
            setError('An error occurred while deleting the order item: ' + err.message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedOrderItem, orderItems, getOrderItemsTotal]); // Add orderItems as dependency if using find on it


    // Select an order item for detailed view or editing
    const selectOrderItem = useCallback((orderItem: OrderItem) => {
        setSelectedOrderItem(orderItem);
    }, []);

    // Initial load: Fetch all order items (can be adjusted to fetch for a specific order if context is for a single order)
    useEffect(() => {
        getAllOrderItems();
    }, [getAllOrderItems]);

    const value: OrderItemContextType = {
        orderItems,
        loading,
        error,
        selectedOrderItem,
        orderTotal,
        createOrderItem,
        updateOrderItem,
        deleteOrderItem,
        getOrderItem,
        getAllOrderItems,
        getAllOrderItemsForOrder,
        getAllOrderItemsForProduct,
        getOrderItemsTotal,
        selectOrderItem,
    };

    return (
        <OrderItemContext.Provider value={value}>
            {children}
        </OrderItemContext.Provider>
    );
}

export function useOrderItem() {
    const context = useContext(OrderItemContext);
    if (context === undefined) {
        throw new Error('useOrderItem must be used within an OrderItemProvider');
    }
    return context;
}