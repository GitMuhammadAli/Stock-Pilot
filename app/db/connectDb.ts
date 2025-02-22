import { AppDataSource } from "./data-source";

export const connectDB = async()=>{
    if(!AppDataSource.isInitialized){
        await AppDataSource.initialize();
        console.log("✅ Database connected successfully!");
    }
}