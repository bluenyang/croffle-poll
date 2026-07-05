import { z } from 'zod';

export const PollOptionResponseSchema = z.object({
  id: z.uuidv7(),
  pollId: z.uuidv7(),
  creatorName: z.string(),
  content: z.string(),
});
export type PollOptionResponse = z.infer<typeof PollOptionResponseSchema>;

export const PollDataResponseSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  creatorName: z.string(),
  isAnonymous: z.boolean(),
  isMultipleChoice: z.boolean(),
  allowCustomOptions: z.boolean(),
  type: z.string(),
  status: z.string(),
  optionType: z.string(),
  closedAt: z.coerce.date().nullable(),
  options: z.array(PollOptionResponseSchema),
});
export type PollDataResponse = z.infer<typeof PollDataResponseSchema>;
