import { Supplier } from "@/db/entities/supplier";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";

interface CreateSupplierData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdById: string;
}

interface UpdateSupplierData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface SupplierResponse {
  success: boolean;
  message: string;
  data?: Supplier | Supplier[];
  error?: any;
}

export class SupplierService {
  private supplierRepo: Repository<Supplier>;
  private userRepo: Repository<User>;

  constructor() {
    this.supplierRepo = AppDataSource.getRepository(Supplier);
    this.userRepo = AppDataSource.getRepository(User);
  }

  async createSupplier(data: CreateSupplierData): Promise<SupplierResponse> {
    try {
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const supplier = this.supplierRepo.create({
        ...data,
        createdBy: user,
      });

      await this.supplierRepo.save(supplier);

      return {
        success: true,
        message: "Supplier created successfully",
        data: supplier,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while creating the supplier",
        error: error
      };
    }
  }

  async getAllSuppliers(): Promise<SupplierResponse> {
    try {
      const suppliers = await this.supplierRepo.find({
        relations: ['createdBy'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Suppliers retrieved successfully",
        data: suppliers,
      };
    } catch (error) {
      console.error("Error retrieving suppliers:", error);
      return {
        success: false,
        message: "An error occurred while retrieving suppliers",
      };
    }
  }

  async getSupplierById(id: string): Promise<SupplierResponse> {
    try {
      console.log("supplier id is ", id)
      const supplier = await this.supplierRepo.findOne({
        where: { id },
        relations: ['createdBy', 'products'],
      });

      if (!supplier) {
        return {
          success: false,
          message: "Supplier not found",
        };
      }

      return {
        success: true,
        message: "Supplier retrieved successfully",
        data: supplier,
      };
    } catch (error) {
      console.error("Error retrieving supplier:", error);
      return {
        success: false,
        message: "An error occurred while retrieving the supplier",
      };
    }
  }

  async updateSupplier(id: string, data: UpdateSupplierData): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id } });

      if (!supplier) {
        return {
          success: false,
          message: "Supplier not found",
        };
      }

      Object.assign(supplier, data);
      await this.supplierRepo.save(supplier);

      return {
        success: true,
        message: "Supplier updated successfully",
        data: supplier,
      };
    } catch (error) {
      console.error("Error updating supplier:", error);
      return {
        success: false,
        message: "An error occurred while updating the supplier",
      };
    }
  }

  async deleteSupplier(id: string): Promise<SupplierResponse> {
    try {
      const supplier = await this.supplierRepo.findOne({ where: { id } });

      if (!supplier) {
        return {
          success: false,
          message: "Supplier not found",
        };
      }

      await this.supplierRepo.remove(supplier);

      return {
        success: true,
        message: "Supplier deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting supplier:", error);
      return {
        success: false,
        message: "An error occurred while deleting the supplier",
      };
    }
  }

  async getSuppliersByUser(userId: string): Promise<SupplierResponse> {
    try {
      const suppliers = await this.supplierRepo.find({
        where: { createdBy: { id: userId } },
        relations: ['createdBy'],
        order: { createdAt: "DESC" },
      });

      return {
        success: true,
        message: "Suppliers retrieved successfully",
        data: suppliers,
      };
    } catch (error) {
      console.error("Error retrieving user suppliers:", error);
      return {
        success: false,
        message: "An error occurred while retrieving user suppliers",
      };
    }
  }
}
