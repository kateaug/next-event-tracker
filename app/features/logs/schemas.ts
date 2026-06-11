import { z } from 'zod';

export const LogLevelSchema = z.enum(['info', 'warn', 'error', 'debug']);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const SERVICES = ['auth-service', 'payment-gateway', 'user-api', 'inventory-db', 'frontend-edge'];
export type LogService = typeof SERVICES[number];


export const LogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  level: LogLevelSchema,
  service: z.string(),
  message: z.string(),
  statusCode: z.number().optional(),
  latencyMs: z.number().optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;
