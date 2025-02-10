import express from "express";
import { AppDataSource } from "./data-source";

const app = express();
const port = 3001;
import { register, login } from "./controllers/auth";

// Add these routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

// Middleware
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("Inventory Tracker Backend");
});