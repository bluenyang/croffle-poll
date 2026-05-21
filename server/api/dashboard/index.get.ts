import { count, sql } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { polls, users } from '~~/server/utils/schema';

export default defineEventHandler(async (_) => {
  // 최신 투표가 위로 오도록 desc ordering
  const [pollData] = await db
    .select({
      activePollsCount: sql<number>`count(*) FILTER (WHERE ${polls.status} = 'ACTIVE')`,
      closedPollsCount: sql<number>`count(*) FILTER (WHERE ${polls.status} = 'CLOSED')`,
      totalVotesCount: count(),
    })
    .from(polls);
  if (!pollData) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch poll data',
    });
  }

  const [teamMembers] = await db
    .select({
      userCount: count(),
    })
    .from(users);
  if (!teamMembers) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch team members count',
    });
  }

  return {
    ...pollData,
    ...teamMembers,
  };
});
