import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/database";
import { handleDemo } from "./routes/demo";

// Import route handlers
import tourRoutes from "./routes/tours";
import customizeRoutes from "./routes/customize";
import contactRoutes from "./routes/contact";
import adminRoutes from "./routes/admin";

// Load environment variables
dotenv.config();

export function createServer() {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.FRONTEND_PROD_URL || "https://www.orbittrails.com",
      "http://localhost:3000",
      "http://localhost:8080"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Connect to database
  connectDB();

  // Health check endpoint for production monitoring
  app.get("/health", (_req, res) => {
    res.json({ 
      status: "OK",
      service: "Orbit Trails API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    });
  });

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "OK", 
      message: "Orbit Trails API is running",
      timestamp: new Date().toISOString()
    });
  });

  // Legacy routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Orbit Trails Express server!" });
  });

  app.get("/api/demo", handleDemo);

  // API Routes
  app.use("/api/tours", tourRoutes);
  app.use("/api/customize-tour", customizeRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/admin", adminRoutes);

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  return app;
}
