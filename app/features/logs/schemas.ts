import { z } from 'zod';

export const SeveritySchema = z.enum(['info', 'notice', 'critical', 'fatal']);
export type SeverityLevel = z.infer<typeof SeveritySchema>;

export const NormalizedEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  readableTime: z.string(),
  source: z.string(),
  category: z.string(),
  severity: SeveritySchema,
  title: z.string(),
  message: z.string(),
  metadata: z.object({
    metricValue: z.number(),
    secondaryLabel: z.string(),
  }),
});

export type NormalizedEvent = z.infer<typeof NormalizedEventSchema>;