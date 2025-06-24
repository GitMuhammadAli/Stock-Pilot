// lib/services/supplierService.ts
import { AppDataSource } from "@/db/data-source";
import { Supplier } from "@/db/entities/supplier";
import { User } from "@/db/entities/User";

export class SupplierService {
  private supplierRepo = AppDataSource.getRepository(Supplier);

  async create(data: Partial<Supplier>, userId: string) {
    const supplier = this.supplierRepo.create({
      ...data,
      createdBy: { id: userId } as User,
    });
    return this.supplierRepo.save(supplier);
  }

  async getAll() {
    return this.supplierRepo.find({
      relations: ["createdBy"],
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: string) {
    return this.supplierRepo.findOne({
      where: { id },
      relations: ["createdBy", "products"],
    });
  }

  async update(id: string, data: Partial<Supplier>) {
    await this.supplierRepo.update(id, data);
    return this.getById(id);
  }

  async delete(id: string) {
    return this.supplierRepo.delete(id);
  }
}
