import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  CORS_ORIGINS: Joi.string().default("*"),
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "debug")
    .default("info"),
  API_VERSION: Joi.string().default("v1"),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  nodeEnv: envVars.NODE_ENV as string,
  port: envVars.PORT as number,
  corsOrigins:
    envVars.CORS_ORIGINS === "*" ? "*" : envVars.CORS_ORIGINS.split(","),
  logLevel: envVars.LOG_LEVEL as string,
  apiVersion: envVars.API_VERSION as string,

  // Database configuration (if needed)
  database: {
    // Add database configuration here
  },

  // Redis configuration (if needed)
  redis: {
    // Add Redis configuration here
  },

  // JWT configuration (if needed)
  jwt: {
    // Add JWT configuration here
  },

  // External services configuration
  services: {
    // Add external service configurations here
  },
} as const;

export type Config = typeof config;
