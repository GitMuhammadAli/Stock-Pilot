import { AppDataSource } from "./data-source";

let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

export const connectDB = async () => {
  // If already connected, return immediately
  if (AppDataSource.isInitialized) {
    return;
  }

  // If connection is in progress, wait for it to complete
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // Start connection process
  isConnecting = true;
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      await AppDataSource.initialize();
      console.log("✅ Database connected successfully!");
      resolve();
    } catch (error) {
      console.error("❌ Database connection error:", error);
      isConnecting = false;
      connectionPromise = null;
      reject(error);
    }
  });

  return connectionPromise;
};

// Function to close the connection (useful for tests and graceful shutdown)
export const closeDB = async () => {
  if (AppDataSource.isInitialized) {
     AppDataSource;
  }
};
