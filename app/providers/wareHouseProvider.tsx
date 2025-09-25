"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Warehouse,
  CreateWarehouseData,
  UpdateWarehouseData,
  WarehouseContextType,
} from "../types/index"; // Adjust the import path as per your project structure

const WarehouseContext = createContext<WarehouseContextType | undefined>(
  undefined
);

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const hasFetched = useRef(false); // ✅ track if we already fetched once
  const router = useRouter();

  // Fetch all warehouses (general function)
  const getAllWarehouses = async (force = false) => {
    if (warehouses.length > 0 && !force) return; // ✅ use cache
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/warehouse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setWarehouses(result.data);
      } else {
        setError(result.message || "Failed to fetch warehouses");
      }
    } catch (err) {
      setError("An error occurred while fetching warehouses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouses for the current user
  const getAllWarehousesForUser = async (force = false) => {
    if (warehouses.length > 0 && !force) return; // ✅ use cache
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/warehouse/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setWarehouses(result.data.data);
      } else {
        setError(result.message || "Failed to fetch user warehouses");
      }
    } catch (err) {
      setError("An error occurred while fetching user warehouses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get a single warehouse by ID
  const getWarehouse = async (id: string): Promise<Warehouse | null> => {
    const existing = warehouses.find((w) => w.id === id);
    if (existing) {
      setSelectedWarehouse(existing);
      return existing;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/warehouse/${id}`);
      const result = await response.json();

      if (result.success) {
        setSelectedWarehouse(result.data);
        return result.data;
      } else {
        setError(result.message || "Failed to fetch warehouse");
        return null;
      }
    } catch (err) {
      setError("An error occurred while fetching the warehouse");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new warehouse
  const createWarehouse = async (
    data: CreateWarehouseData
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/warehouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setWarehouses((prev) => [...prev, result.data]); // ✅ update local cache
        return true;
      } else {
        setError(result.message || "Failed to create warehouse");
        return false;
      }
    } catch (err) {
      setError("An error occurred while creating the warehouse");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing warehouse
  const updateWarehouse = async (
    id: string,
    data: UpdateWarehouseData
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/warehouse/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setWarehouses((prev) =>
          prev.map((warehouse) =>
            warehouse.id === id ? { ...warehouse, ...result.data } : warehouse
          )
        );
        if (selectedWarehouse && selectedWarehouse.id === id) {
          setSelectedWarehouse({ ...selectedWarehouse, ...result.data });
        }
        return true;
      } else {
        setError(result.message || "Failed to update warehouse");
        return false;
      }
    } catch (err) {
      setError("An error occurred while updating the warehouse");
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
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setWarehouses((prev) =>
          prev.filter((warehouse) => warehouse.id !== id)
        );
        if (selectedWarehouse && selectedWarehouse.id === id) {
          setSelectedWarehouse(null);
        }
        return true;
      } else {
        setError(result.message || "Failed to delete warehouse");
        return false;
      }
    } catch (err) {
      setError("An error occurred while deleting the warehouse");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const selectWarehouse = (warehouse: Warehouse | null) => {
    setSelectedWarehouse(warehouse);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      getAllWarehousesForUser();
      hasFetched.current = true;
    }
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
    selectWarehouse,
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
    throw new Error("useWarehouse must be used within a WarehouseProvider");
  }
  return context;
}
