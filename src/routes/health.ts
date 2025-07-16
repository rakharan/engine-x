import { asyncHandler } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";
import { Router, Request, Response } from "express";

const router = Router();

interface HealthCheck {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  version: string;
  environment: string;
  services?: Record<string, "ok" | "error">;
}

// Mock database health check function
async function checkDatabaseHealth(): Promise<"ok" | "error"> {
  try {
    // Simulate database connectivity check
    // Replace with actual database connection logic
    return "ok";
  } catch (error: any) {
    logger.error("Database health check failed", { error: error.message });
    return "error";
  }
}

// Mock Redis health check function
async function checkRedisHealth(): Promise<"ok" | "error"> {
  try {
    // Simulate Redis connectivity check
    // Replace with actual Redis connection logic
    return "ok";
  } catch (error: any) {
    logger.error("Redis health check failed", { error: error.message });
    return "error";
  }
}

// Mock external API health check function
async function checkExternalAPIHealth(): Promise<"ok" | "error"> {
  try {
    // Simulate external API health check
    // Replace with actual API call logic
    return "ok";
  } catch (error: any) {
    logger.error("External API health check failed", { error: error.message });
    return "error";
  }
}

// Basic health check
router.get(
  "/",
  asyncHandler(async (_: Request, res: Response) => {
    const healthCheck: HealthCheck = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env["NODE_ENV"] || "development",
    };

    res.status(200).json(healthCheck);
  }),
);

// Detailed health check with dependency checks
router.get(
  "/detailed",
  asyncHandler(async (_: Request, res: Response) => {
    const services: Record<string, "ok" | "error"> = {};

    services["database"] = await checkDatabaseHealth();
    services["redis"] = await checkRedisHealth();
    services["externalAPI"] = await checkExternalAPIHealth();

    const allServicesHealthy = Object.values(services).every(
      (status) => status === "ok",
    );

    const healthCheck: HealthCheck = {
      status: allServicesHealthy ? "ok" : "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env["NODE_ENV"] || "development",
      services,
    };

    const statusCode = allServicesHealthy ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  }),
);

// Readiness probe (for Kubernetes)
router.get(
  "/ready",
  asyncHandler(async (_: Request, res: Response) => {
    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  }),
);

// Liveness probe (for Kubernetes)
router.get(
  "/live",
  asyncHandler(async (_: Request, res: Response) => {
    res.status(200).json({
      status: "alive",
      timestamp: new Date().toISOString(),
    });
  }),
);

export { router as healthRouter };
