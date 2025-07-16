import { config } from "@/config/config";
import { logger } from "@/utils/logger";
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _: NextFunction,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  // Log error
  logger.error(`Error ${statusCode}: ${message}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    stack: err.stack,
  });

  // Don't leak error details in production
  const response = {
    error: {
      message:
        statusCode === 500 && config.nodeEnv === "production"
          ? "Internal Server Error"
          : message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ...(config.nodeEnv === "development" && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};

// Standard middleware with 3 arguments
export const notFoundHandler = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  // Pass the error to the final error handler
  next(error);
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
