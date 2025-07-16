import { logger } from "@/utils/logger";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Log request
  logger.info(`Incoming request: ${req.method} ${req.url}`, {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    headers: req.headers,
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const duration = Date.now() - req.startTime;

    logger.info(`Response sent: ${req.method} ${req.url}`, {
      requestId: req.requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get("Content-Length"),
    });

    return originalEnd.call(this, chunk, encoding);
  };

  next();
};
