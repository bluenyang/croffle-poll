import { desc, eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { votes, users } from '~~/server/utils/schema';

export default defineEventHandler(async (_) => {
  // 최신 투표가 위로 오도록 desc ordering
  const allPolls = await db
    .select()
    .from(votes)
    .innerJoin(users, eq(votes.creatorId, users.id))
    .where(eq(votes.isClosed, true))
    .orderBy(desc(votes.createdAt));

  const formattedPolls = allPolls.map((poll) => ({
    id: poll.votes.id,
    title: poll.votes.title,
    description: poll.votes.description,
    creatorName: poll.users.name,
    isAnonymous: poll.votes.isAnonymous,
    isMultipleChoice: poll.votes.isMultipleChoice,
    allowCustomOptions: poll.votes.allowCustomOptions,
    optionType: poll.votes.optionType,
    isClosed: poll.votes.isClosed,
    createdAt: poll.votes.createdAt,
  }));

  return formattedPolls;
});
