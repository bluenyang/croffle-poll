import { desc, eq } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { polls, users } from '~~/server/utils/schema';

export default defineEventHandler(async (_) => {
  // 최신 투표가 위로 오도록 desc ordering
  return await db
    .select({
      id: polls.id,
      title: polls.title,
      description: polls.description,
      creatorName: users.nickname,
      isAnonymous: polls.isAnonymous,
      isMultipleChoice: polls.isMultipleChoice,
      allowCustomOptions: polls.allowCustomOptions,
      type: polls.type,
      status: polls.status,
      closedAt: polls.closedAt,
      createdAt: polls.createdAt,
    })
    .from(polls)
    .innerJoin(users, eq(polls.creatorId, users.id))
    .orderBy(desc(polls.createdAt));
});
