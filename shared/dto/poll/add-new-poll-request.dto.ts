import { z } from 'zod';

export const AddNewPollRequestSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.'),
  description: z.string().optional(),
  isAnonymous: z.boolean(),
  isMultipleChoice: z.boolean(),
  allowCustomOptions: z.boolean(),
  type: z.enum(['VOTE', 'APPLICATION', 'OPINION']),
  status: z.enum(['ACTIVE', 'CLOSED']).optional(),
  closedAt: z.coerce.date().optional(),
  optionType: z.enum(['TEXT', 'DATE']).default('TEXT'),
  options: z.array(z.object({ content: z.string() })),
});

export type AddNewPollRequestDto = z.infer<typeof AddNewPollRequestSchema>;
