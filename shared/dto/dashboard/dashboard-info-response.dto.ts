import { z } from 'zod';

export const DashboardInfoResponseSchema = z.object({
  activePollsCount: z.number(),
  closedPollsCount: z.number(),
  totalVotesCount: z.number(),
  userCount: z.number(),
});

export type DashboardInfoResponseDto = z.infer<typeof DashboardInfoResponseSchema>;
