import "reflect-metadata";
import { DataSource } from "typeorm";
import { User  } from "./entities/User";
import { WareHouse } from "./entities/wareHouse";
import path from "path";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "inventoryDb",
  // entities: [path.join(__dirname, "entities", "*.{ts,js}")], 
  synchronize: true,
  entities: [User , WareHouse], 
  migrations: [path.join(__dirname, "migrations", "*.{ts,js}")], 
  logging: process.env.NODE_ENV === "development",
});

