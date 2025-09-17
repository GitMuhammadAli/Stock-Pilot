// src/lib/services/supplierServices.ts
import { Supplier } from "@/db/entities/supplier";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";
import { SupplierStatus, SupplierTier } from "@/db/entities/supplier";

// Interface for creating a new supplier
export interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
  notes?: string;
  status?: SupplierStatus;
  tier?: SupplierTier;
  creditLimit?: number;
    currentBalance?: number;
  rating?: number;
  totalOrders?: number;
  totalOrderValue?: number;
  paymentTerms?: number | string;
  taxId?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
  createdById: string;
}

// Interface for updating an existing supplier (expanded to include all fields)
interface UpdateSupplierData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
  notes?: string;
  status?: SupplierStatus;
  tier?: SupplierTier;
  creditLimit?: number;
  currentBalance?: number;
  rating?: number;
  totalOrders?: number;
  totalOrderValue?: number;
  paymentTerms?: number | string;
  taxId?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
}

// Standardized response interface for service methods
interface SupplierResponse {
  success: boolean;
  message: string;
  data?: Supplier | Supplier[] | null;
  error?: any;
}

export class SupplierService {
  private supplierRepo: Repository<Supplier>;
  private userRepo: Repository<User>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      console.warn("AppDataSource is not initialized. Ensure connectDB() is called before using SupplierService.");
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
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: `User with ID ${data.createdById} not found.`,
        };
      }

      // Pre-process the incoming data to ensure it matches the database schema.
      let paymentTermsAsNumber = 30;
      if (data.paymentTerms) {
        const numericMatch = String(data.paymentTerms).match(/\d+/);
        if (numericMatch && numericMatch[0]) {
          const parsedValue = parseInt(numericMatch[0], 10);
          if (!isNaN(parsedValue)) {
            paymentTermsAsNumber = parsedValue;
          }
        }
      }

      const supplier = this.supplierRepo.create({
        ...data,
        paymentTerms: paymentTermsAsNumber,
        createdBy: user,
      });

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
   * Retrieves all suppliers for the requesting user.
   * @param userId - The ID of the user whose suppliers are to be retrieved.
   * @returns A SupplierResponse containing a list of suppliers created by the user.
   */
  async getSuppliersByUser(userId: string): Promise<SupplierResponse> {
    try {
      const suppliers = await this.supplierRepo.find({
        where: { createdById: userId },
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

  /**
   * Retrieves a single supplier by its ID, ensuring it belongs to the user.
   * @param id - The ID of the supplier to retrieve.
   * @param userId - The ID of the authenticated user.
   * @returns A SupplierResponse containing the found supplier data, or a not found/unauthorized message.
   */
  async getSupplierByIdAndUser(id: string, userId: string): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({
        where: { id, createdById: userId },
        relations: ['createdBy'],
      });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found or you are not authorized to view it.`,
          data: null,
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
   * Updates an existing supplier by its ID, ensuring it belongs to the user.
   * @param id - The ID of the supplier to update.
   * @param userId - The ID of the authenticated user.
   * @param data - The partial data to update the supplier with.
   * @returns A SupplierResponse indicating success or failure, with the updated supplier data.
   */
  async updateSupplierAndUser(id: string, userId: string, data: UpdateSupplierData): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id, createdById: userId } });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found or you are not authorized to update it.`,
        };
      }

      // Pre-process paymentTerms if it exists in the data
      if (data.paymentTerms) {
        const numericMatch = String(data.paymentTerms).match(/\d+/);
        if (numericMatch && numericMatch[0]) {
          data.paymentTerms = parseInt(numericMatch[0], 10);
        } else {
          // If the string is invalid, you might want to return an error or skip the update
          return {
            success: false,
            message: "Invalid format for paymentTerms. Please provide a number or a string like 'Net 30'.",
          };
        }
      }

      Object.assign(supplier, data);
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
   * Deletes a supplier by its ID, ensuring it belongs to the user.
   * @param id - The ID of the supplier to delete.
   * @param userId - The ID of the authenticated user.
   * @returns A SupplierResponse indicating success or failure.
   */
  async deleteSupplierAndUser(id: string, userId: string): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id, createdById: userId } });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found or you are not authorized to delete it.`,
        };
      }

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

  // Deprecated methods that should not be used in production for security reasons
  // They are kept here for historical context, but should be replaced by their "AndUser" counterparts.
  
  /**
   * @deprecated Use `getSupplierByIdAndUser` for secure, user-specific access.
   */
  async getSupplierById(id: string): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({
        where: { id },
        relations: ['createdBy'],
      });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found.`,
          data: null,
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
   * @deprecated Use `updateSupplierAndUser` for secure, user-specific updates.
   */
  async updateSupplier(id: string, data: UpdateSupplierData): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id } });

      if (!supplier) {
        return {
          success: false,
          message: `Supplier with ID ${id} not found.`,
        };
      }
      
      Object.assign(supplier, data);
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
   * @deprecated Use `deleteSupplierAndUser` for secure, user-specific deletion.
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
}

export const supplierService = new SupplierService();