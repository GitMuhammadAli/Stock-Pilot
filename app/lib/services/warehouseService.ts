// src/lib/services/warehouseServices.ts
import { WareHouse, WarehouseStatus } from "@/db/entities/wareHouse";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";

// Interface for creating a new warehouse
interface CreateWarehouseData {
  name: string;
  location: string;
  description?: string;
  capacity: number;
  contactPhone?: string;
  contactEmail?: string;
  createdById: string; // Foreign key for the creating user
}

// Interface for updating an existing warehouse
interface UpdateWarehouseData {
  name?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
  status?: WarehouseStatus; // Use the enum for type safety
  capacity?: number;
  currentOccupancy?: number;
  contactPhone?: string;
  contactEmail?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: object; // Use object or a more specific type if needed
}

// Standardized response interface for service methods
interface WarehouseResponse {
  success: boolean;
  message: string;
  data?: WareHouse | WareHouse[] | null;
  error?: any;
}

export class WarehouseService {
  private warehouseRepo: Repository<WareHouse>;
  private userRepo: Repository<User>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      console.warn("AppDataSource is not initialized. Ensure connectDB() is called before using WarehouseService.");
    }
    this.warehouseRepo = AppDataSource.getRepository(WareHouse);
    this.userRepo = AppDataSource.getRepository(User);
  }

  /**
   * Creates a new warehouse entry in the database.
   * @param data - The data for the new warehouse, including the ID of the creating user.
   * @returns A WarehouseResponse indicating success or failure, with the created warehouse data.
   */
  async createWarehouse(data: CreateWarehouseData): Promise<WarehouseResponse> {
    try {
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: `User with ID ${data.createdById} not found.`,
        };
      }

      const warehouse = this.warehouseRepo.create({
        ...data,
        createdBy: user,
      });

      await this.warehouseRepo.save(warehouse);

      return {
        success: true,
        message: "Warehouse created successfully.",
        data: warehouse,
      };
    } catch (error) {
      console.error("Error creating warehouse:", error);
      return {
        success: false,
        message: "An error occurred while creating the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all warehouses from the database.
   * @returns A WarehouseResponse containing a list of all warehouses.
   */
  async getAllWarehouses(): Promise<WarehouseResponse> {
    try {
      const warehouses = await this.warehouseRepo.find({
        relations: ['createdBy'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Warehouses retrieved successfully.",
        data: warehouses,
      };
    } catch (error) {
      console.error("Error retrieving all warehouses:", error);
      return {
        success: false,
        message: "An error occurred while retrieving warehouses.",
        error: error,
      };
    }
  }

  /**
   * Retrieves a single warehouse by its ID.
   * @param id - The ID of the warehouse to retrieve.
   * @returns A WarehouseResponse containing the found warehouse data, or a not found message.
   */
  async getWarehouseById(id: string): Promise<WarehouseResponse> {
    try {
      console.log(`Attempting to retrieve warehouse with ID: ${id}`);
      const warehouse = await this.warehouseRepo.findOne({
        where: { id },
        relations: ['createdBy'],
      });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
          data: null,
        };
      }

      return {
        success: true,
        message: "Warehouse retrieved successfully.",
        data: warehouse,
      };
    } catch (error) {
      console.error(`Error retrieving warehouse with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Updates an existing warehouse by its ID.
   * @param id - The ID of the warehouse to update.
   * @param data - The partial data to update the warehouse with.
   * @returns A WarehouseResponse indicating success or failure, with the updated warehouse data.
   */
  async updateWarehouse(id: string, data: UpdateWarehouseData): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
        };
      }

      console.log("before", warehouse);
      Object.assign(warehouse, data);

      let s = await this.warehouseRepo.save(warehouse);
      console.log("Saved", s);

      return {
        success: true,
        message: "Warehouse updated successfully.",
        data: warehouse,
      };
    } catch (error) {
      console.error(`Error updating warehouse with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Deletes a warehouse by its ID.
   * @param id - The ID of the warehouse to delete.
   * @returns A WarehouseResponse indicating success or failure.
   */
  async deleteWarehouse(id: string): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
        };
      }

      await this.warehouseRepo.remove(warehouse);

      return {
        success: true,
        message: "Warehouse deleted successfully.",
      };
    } catch (error) {
      console.error(`Error deleting warehouse with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while deleting the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all warehouses created by a specific user.
   * @param userId - The ID of the user whose warehouses are to be retrieved.
   * @returns A WarehouseResponse containing a list of warehouses created by the user.
   */
  async getWarehousesByUser(userId: string): Promise<WarehouseResponse> {
    try {
      const warehouses = await this.warehouseRepo.find({
        where: { createdById: userId },
        relations: ['createdBy'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Warehouses for user ID ${userId} retrieved successfully.`,
        data: warehouses,
      };
    } catch (error) {
      console.error(`Error retrieving warehouses for user ID ${userId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving user warehouses.",
        error: error,
      };
    }
  }

  /**
   * Retrieves a single warehouse by its ID, ensuring it belongs to the user.
   * @param id - The ID of the warehouse to retrieve.
   * @param userId - The ID of the authenticated user.
   * @returns A WarehouseResponse containing the found warehouse data, or a not found/unauthorized message.
   */
  async getWarehouseByIdAndUser(id: string, userId: string): Promise<WarehouseResponse> {
    try {
      console.log(`Attempting to retrieve warehouse with ID: ${id}`);
      const warehouse = await this.warehouseRepo.findOne({
        where: { id, createdById: userId },
        relations: ['createdBy'],
      });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found or you are not authorized to view it.`,
          data: null,
        };
      }

      return {
        success: true,
        message: "Warehouse retrieved successfully.",
        data: warehouse,
      };
    } catch (error) {
      console.error(`Error retrieving warehouse with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Updates an existing warehouse by its ID, ensuring it belongs to the user.
   * @param id - The ID of the warehouse to update.
   * @param userId - The ID of the authenticated user.
   * @param data - The partial data to update the warehouse with.
   * @returns A WarehouseResponse indicating success or failure, with the updated warehouse data.
   */
  async updateWarehouseAndUser(id: string, userId: string, data: UpdateWarehouseData): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id, createdById: userId } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found or you are not authorized to update it.`,
        };
      }

      Object.assign(warehouse, data);
      await this.warehouseRepo.save(warehouse);

      return {
        success: true,
        message: "Warehouse updated successfully.",
        data: warehouse,
      };
    } catch (error) {
      console.error(`Error updating warehouse with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Deletes a warehouse by its ID, ensuring it belongs to the user.
   * @param id - The ID of the warehouse to delete.
   * @param userId - The ID of the authenticated user.
   * @returns A WarehouseResponse indicating success or failure.
   */
  async deleteWarehouseAndUser(id: string, userId: string): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id, createdById: userId } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found or you are not authorized to delete it.`,
        };
      }

      await this.warehouseRepo.remove(warehouse);

      return {
        success: true,
        message: "Warehouse deleted successfully.",
      };
    } catch (error) {
      console.error(`Error deleting warehouse with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while deleting the warehouse.",
        error: error,
      };
    }
  }

  /**
   * Updates the current occupancy of a specific warehouse.
   * @param id - The ID of the warehouse to update.
   * @param newOccupancy - The new occupancy value.
   * @returns A WarehouseResponse indicating success or failure, with the updated warehouse data.
   */
  async updateWarehouseOccupancy(id: string, newOccupancy: number): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
        };
      }

      if (newOccupancy < 0) {
        return {
          success: false,
          message: "New occupancy cannot be negative.",
        };
      }
      if (newOccupancy > warehouse.capacity) {
        return {
          success: false,
          message: `New occupancy (${newOccupancy}) exceeds warehouse capacity (${warehouse.capacity}).`,
        };
      }

      warehouse.currentOccupancy = newOccupancy;
      await this.warehouseRepo.save(warehouse);

      return {
        success: true,
        message: "Warehouse occupancy updated successfully.",
        data: warehouse,
      };
    } catch (error) {
      console.error(`Error updating warehouse occupancy for ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating warehouse occupancy.",
        error: error,
      };
    }
  }
}

export const warehouseService = new WarehouseService();