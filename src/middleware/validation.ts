import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "./errorHandler";

// Example validation schemas
const userSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
  role: Joi.string().valid("admin", "user", "moderator").default("user"),
});

const schemas: Record<string, Joi.ObjectSchema> = {
  user: userSchema,
};

export const validateRequest = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  const { path, method } = req;

  // Determine which schema to use based on the route
  let schemaName = "";

  if (path.includes("/users") && (method === "POST" || method === "PUT")) {
    schemaName = "user";
  }

  if (!schemaName) {
    return next(); // No validation needed for this route
  }

  const schema = schemas[schemaName];
  if (!schema) {
    return next(); // No schema found
  }

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const validationErrors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    throw new AppError(
      `Validation failed: ${validationErrors.map((e) => e.message).join(", ")}`,
      400,
    );
  }

  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, _: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      throw new AppError(
        `Validation failed: ${validationErrors.map((e) => e.message).join(", ")}`,
        400,
      );
    }

    req.body = value;
    next();
  };
};

export { userSchema };
