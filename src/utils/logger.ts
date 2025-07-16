import { config } from "@/config/config";

export type LogLevel = "error" | "warn" | "info" | "debug";

class Logger {
  private logLevel: LogLevel;
  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  constructor(logLevel: LogLevel = "info") {
    this.logLevel = logLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const levelString = level.toUpperCase().padEnd(5);
    const metaString = meta ? ` ${JSON.stringify(meta)}` : "";

    return `[${timestamp}] ${levelString} ${message}${metaString}`;
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}

export const logger = new Logger(config.logLevel as LogLevel);
