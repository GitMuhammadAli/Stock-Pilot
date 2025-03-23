import { WareHouse } from "@/db/entities/wareHouse";
import { AppDataSource } from "@/db/data-source";
import { Repository } from "typeorm";
import { User } from "@/db/entities/User";

interface CreateWarehouseData {
  name: string;
  location: string;
  description?: string;
  capacity: number;
  contactPhone?: string;
  contactEmail?: string;
  createdById: string;
}

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

interface WarehouseResponse {
  success: boolean;
  message: string;
  data?: WareHouse | WareHouse[];
  error?:any;
}

export class WarehouseService {
  private warehouseRepo: Repository<WareHouse>;
  private userRepo: Repository<User>;

  constructor() {
    this.warehouseRepo = AppDataSource.getRepository(WareHouse);
    this.userRepo = AppDataSource.getRepository(User);
  }

  async createWarehouse(data: CreateWarehouseData): Promise<WarehouseResponse> {
    try {
      const user = await this.userRepo.findOne({ where: { id: data.createdById } });
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const warehouse = this.warehouseRepo.create({
        ...data,
        createdBy: user,
      });

      await this.warehouseRepo.save(warehouse);

      return {
        success: true,
        message: "Warehouse created successfully",
        data: warehouse,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while creating the warehouse",
        error:error
      };
    }
  }

  async getAllWarehouses(): Promise<WarehouseResponse> {
    try {
      const warehouses = await this.warehouseRepo.find({
        relations: ['createdBy'],
      });

      return {
        success: true,
        message: "Warehouses retrieved successfully",
        data: warehouses,
      };
    } catch (error) {
      console.error("Error retrieving warehouses:", error);
      return {
        success: false,
        message: "An error occurred while retrieving warehouses",
      };
    }
  }

  async getWarehouseById(id: string): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({
        where: { id },
        relations: ['createdBy'],
      });

      if (!warehouse) {
        return {
          success: false,
          message: "Warehouse not found",
        };
      }

      return {
        success: true,
        message: "Warehouse retrieved successfully",
        data: warehouse,
      };
    } catch (error) {
      console.error("Error retrieving warehouse:", error);
      return {
        success: false,
        message: "An error occurred while retrieving the warehouse",
      };
    }
  }

  async updateWarehouse(id: string, data: UpdateWarehouseData): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: "Warehouse not found",
        };
      }

      Object.assign(warehouse, data);
      await this.warehouseRepo.save(warehouse);

      return {
        success: true,
        message: "Warehouse updated successfully",
        data: warehouse,
      };
    } catch (error) {
      console.error("Error updating warehouse:", error);
      return {
        success: false,
        message: "An error occurred while updating the warehouse",
      };
    }
  }

  async deleteWarehouse(id: string): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: "Warehouse not found",
        };
      }

      await this.warehouseRepo.remove(warehouse);

      return {
        success: true,
        message: "Warehouse deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      return {
        success: false,
        message: "An error occurred while deleting the warehouse",
      };
    }
  }

  async getWarehousesByUser(userId: string): Promise<WarehouseResponse> {
    try {
      const warehouses = await this.warehouseRepo.find({
        where: { createdById: userId },
        relations: ['createdBy'],
      });

      return {
        success: true,
        message: "Warehouses retrieved successfully",
        data: warehouses,
      };
    } catch (error) {
      console.error("Error retrieving user warehouses:", error);
      return {
        success: false,
        message: "An error occurred while retrieving user warehouses",
      };
    }
  }

  async updateWarehouseOccupancy(id: string, newOccupancy: number): Promise<WarehouseResponse> {
    try {
      const warehouse = await this.warehouseRepo.findOne({ where: { id } });

      if (!warehouse) {
        return {
          success: false,
          message: "Warehouse not found",
        };
      }

      if (newOccupancy > warehouse.capacity) {
        return {
          success: false,
          message: "New occupancy exceeds warehouse capacity",
        };
      }

      warehouse.currentOccupancy = newOccupancy;
      await this.warehouseRepo.save(warehouse);

      return {
        success: true,
        message: "Warehouse occupancy updated successfully",
        data: warehouse,
      };
    } catch (error) {
      console.error("Error updating warehouse occupancy:", error);
      return {
        success: false,
        message: "An error occurred while updating warehouse occupancy",
      };
    }
  }
}
