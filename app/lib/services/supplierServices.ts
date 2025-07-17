// src/lib/services/SupplierService.ts
import { Supplier } from "@/db/entities/supplier";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";

// Interface for creating a new supplier
interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdById: string; // Foreign key for the creating user
}

// Interface for updating an existing supplier
interface UpdateSupplierData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Standardized response interface for service methods
interface SupplierResponse {
  success: boolean;
  message: string;
  data?: Supplier | Supplier[] | null; // Added null for cases where data might not be found
  error?: any; // Keeping 'any' for general error catching as requested
}

export class SupplierService {
  private supplierRepo: Repository<Supplier>;
  private userRepo: Repository<User>;

  constructor() {
    // Ensure AppDataSource is initialized before getting repositories
    // In a Next.js app, AppDataSource.initialize() should be called once at app startup (e.g., in layout.tsx or a global setup file).
    // If not initialized, getRepository will throw an error.
    if (!AppDataSource.isInitialized) {
      console.warn("AppDataSource is not initialized. Ensure connectDB() is called before using SupplierService.");
      // In a real application, you might want to throw an error here or handle this more robustly.
    }
    this.supplierRepo = AppDataSource.getRepository(Supplier);
    this.userRepo = AppDataSource.getRepository(User);
  }

  /**
   * Creates a new supplier entry in the database.
   * @param data - The data for the new supplier, including the ID of the creating user.
   * @returns A SupplierResponse indicating success or failure, with the created supplier data.
   */
  async createSupplier(data: CreateSupplierData): Promise<SupplierResponse> {
    try {
      // Find the user who is creating the supplier
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: `User with ID ${data.createdById} not found.`,
        };
      }

      // Create a new supplier instance
      const supplier = this.supplierRepo.create({
        ...data,
        createdBy: user, // Assign the found User entity to the relation
      });

      // Save the new supplier to the database
      await this.supplierRepo.save(supplier);

      return {
        success: true,
        message: "Supplier created successfully.",
        data: supplier,
      };
    } catch (error) {
      console.error("Error creating supplier:", error);
      return {
        success: false,
        message: "An error occurred while creating the supplier.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all suppliers from the database.
   * @returns A SupplierResponse containing a list of all suppliers.
   */
  async getAllSuppliers(): Promise<SupplierResponse> {
    try {
      // Find all suppliers and eager load the 'createdBy' user relation
      const suppliers = await this.supplierRepo.find({
        relations: ['createdBy'],
        order: { createdAt: "DESC" }, // Order by creation date descending
      });

      return {
        success: true,
        message: "Suppliers retrieved successfully.",
        data: suppliers,
      };
    } catch (error) {
      console.error("Error retrieving all suppliers:", error);
      return {
        success: false,
        message: "An error occurred while retrieving suppliers.",
        error: error,
      };
    }
  }

  /**
   * Retrieves a single supplier by its ID.
   * @param id - The ID of the supplier to retrieve.
   * @returns A SupplierResponse containing the found supplier data, or a not found message.
   */
  async getSupplierById(id: string): Promise<SupplierResponse> {
    try {
      console.log(`Attempting to retrieve supplier with ID: ${id}`);
      // Find one supplier by ID and eager load the 'createdBy' user relation and 'products'
      const supplier = await this.supplierRepo.findOne({
        where: { id },
        relations: ['createdBy', 'products'], // Keep 'products' relation if you want to load them
      });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found.`,
          data: null, // Explicitly set data to null when not found
        };
      }

      return {
        success: true,
        message: "Supplier retrieved successfully.",
        data: supplier,
      };
    } catch (error) {
      console.error(`Error retrieving supplier with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving the supplier.",
        error: error,
      };
    }
  }

  /**
   * Updates an existing supplier by its ID.
   * @param id - The ID of the supplier to update.
   * @param data - The partial data to update the supplier with.
   * @returns A SupplierResponse indicating success or failure, with the updated supplier data.
   */
  async updateSupplier(id: string, data: UpdateSupplierData): Promise<SupplierResponse> {
    try {
      // Find the supplier to update
      const supplier = await this.supplierRepo.findOne({ where: { id } });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found.`,
        };
      }

      // Apply partial updates to the found supplier entity
      Object.assign(supplier, data);
      // Save the updated supplier
      await this.supplierRepo.save(supplier);

      return {
        success: true,
        message: "Supplier updated successfully.",
        data: supplier,
      };
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while updating the supplier.",
        error: error,
      };
    }
  }

  /**
   * Deletes a supplier by its ID.
   * @param id - The ID of the supplier to delete.
   * @returns A SupplierResponse indicating success or failure.
   */
  async deleteSupplier(id: string): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id } });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found.`,
        };
      }

      // Remove the supplier from the database
      await this.supplierRepo.remove(supplier);

      return {
        success: true,
        message: "Supplier deleted successfully.",
      };
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      return {
        success: false,
        message: "An error occurred while deleting the supplier.",
        error: error,
      };
    }
  }

  /**
   * Retrieves all suppliers created by a specific user.
   * @param userId - The ID of the user whose suppliers are to be retrieved.
   * @returns A SupplierResponse containing a list of suppliers created by the user.
   */
  async getSuppliersByUser(userId: string): Promise<SupplierResponse> {
    try {
      // Find suppliers where createdBy relation's ID matches the provided userId
      const suppliers = await this.supplierRepo.find({
        where: { createdBy: { id: userId } }, // Use nested object for relation filtering
        relations: ['createdBy'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: `Suppliers for user ID ${userId} retrieved successfully.`,
        data: suppliers,
      };
    } catch (error) {
      console.error(`Error retrieving suppliers for user ID ${userId}:`, error);
      return {
        success: false,
        message: "An error occurred while retrieving user suppliers.",
        error: error,
      };
    }
  }
}

// Export a singleton instance of the service
export const supplierService = new SupplierService();