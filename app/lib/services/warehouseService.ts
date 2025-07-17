import { WareHouse } from "@/db/entities/wareHouse";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";

// Interface for creating a new warehouse
interface CreateWarehouseData {
  name: string;
  location: string;
  description?: string; // Optional as per entity definition
  capacity: number;
  contactPhone?: string; // Optional
  contactEmail?: string; // Optional
  createdById: string; // Foreign key for the creating user
}

// Interface for updating an existing warehouse
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

// Standardized response interface for service methods
interface WarehouseResponse {
  success: boolean;
  message: string;
  data?: WareHouse | WareHouse[] | null; // Added null for cases where data might not be found
  error?: any; // Keeping 'any' for general error catching as requested
}

export class WarehouseService {
  private warehouseRepo: Repository<WareHouse>;
  private userRepo: Repository<User>;

  constructor() {
    // Ensure AppDataSource is initialized before getting repositories
    // In a Next.js app, AppDataSource.initialize() should be called once at app startup (e.g., in layout.tsx or a global setup file).
    // If not initialized, getRepository will throw an error.
    if (!AppDataSource.isInitialized) {
      console.warn("AppDataSource is not initialized. Ensure connectDB() is called before using WarehouseService.");
      // In a real application, you might want to throw an error here or handle this more robustly.
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
      // Find the user who is creating the warehouse
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: `User with ID ${data.createdById} not found.`,
        };
      }

      // Create a new warehouse instance
      const warehouse = this.warehouseRepo.create({
        ...data,
        createdBy: user, // Assign the found User entity to the relation
      });

      // Save the new warehouse to the database
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
      // Find all warehouses and eager load the 'createdBy' user relation
      const warehouses = await this.warehouseRepo.find({
        relations: ['createdBy'],
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
      // Find one warehouse by ID and eager load the 'createdBy' user relation
      const warehouse = await this.warehouseRepo.findOne({
        where: { id },
        relations: ['createdBy'],
      });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
          data: null, // Explicitly set data to null when not found
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
      // Find the warehouse to update
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
        };
      }

      console.log("before" , warehouse)


      // Apply partial updates to the found warehouse entity
      Object.assign(warehouse, data);
      // Save the updated warehouse
      let s = await this.warehouseRepo.save(warehouse);
      console.log("Saved" , s)

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
      // Find the warehouse to delete
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: `Warehouse with ID ${id} not found.`,
        };
      }

      // Remove the warehouse from the database
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
      // Find warehouses where createdById matches the provided userId
      const warehouses = await this.warehouseRepo.find({
        where: { createdById: userId },
        relations: ['createdBy'], // Eager load the user details if needed
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