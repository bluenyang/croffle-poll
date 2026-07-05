import { z } from 'zod';

export const VoteSubmissionSchema = z.object({
  value: z.string(),
  count: z.number(),
  voters: z.array(z.string()),
  rank: z.number(),
});
export type VoteSubmissionDto = z.infer<typeof VoteSubmissionSchema>;

export const ApplicationSubmissionSchema = z.object({
  content: z.string(),
  nickname: z.string(),
});
export type ApplicationSubmissionDto = z.infer<typeof ApplicationSubmissionSchema>;

export const PollResultResponseSchema = z.object({
  id: z.uuidv7(),
  title: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  creatorName: z.string(),
  isAnonymous: z.boolean(),
  isMultipleChoice: z.boolean(),
  allowCustomOptions: z.boolean(),
  type: z.enum(['VOTE', 'APPLICATION', 'OPINION']),
  status: z.enum(['ACTIVE', 'CLOSED']),
  closedAt: z.coerce.date().nullable(),
  totalVotes: z.number(),
  submissions: z.union([z.array(VoteSubmissionSchema), z.array(ApplicationSubmissionSchema)]),
});
export type PollResultResponseDto = z.infer<typeof PollResultResponseSchema>;

export const VoteResultResponseSchema = PollResultResponseSchema.extend({
  type: z.literal('VOTE'),
  submissions: z.array(VoteSubmissionSchema),
});
export type VoteResultResponseDto = z.infer<typeof VoteResultResponseSchema>;

export const ApplicationResultResponseSchema = PollResultResponseSchema.extend({
  type: z.enum(['APPLICATION', 'OPINION']),
  submissions: z.array(ApplicationSubmissionSchema),
});
export type ApplicationResultResponseDto = z.infer<typeof ApplicationResultResponseSchema>;
