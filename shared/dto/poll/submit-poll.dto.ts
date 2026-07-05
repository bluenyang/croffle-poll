import { z } from 'zod';

export const SubmitPollRequestSchema = z.object({
  optionIds: z.array(z.uuidv7()).optional(),
  customOptionValues: z.array(z.string()).optional(),
  content: z.string().optional(),
});

export type SubmitPollRequest = z.infer<typeof SubmitPollRequestSchema>;
