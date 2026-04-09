import { db } from '~~/server/utils/db';
import { pollResponses, users } from '~~/server/utils/schema';
import { count, eq, sql } from 'drizzle-orm';

type PollResponse = {
  value: string;
  count: number;
  voters: string[];
  rank: number;
}[];

export default defineEventHandler(async (event) => {
  const pollId = Number(event.context.params?.id);

  // 투표 기본 정보 조회
  const [poll] = await db
    .select()
    .from(polls)
    .innerJoin(users, eq(polls.creatorId, users.id))
    .where(eq(polls.id, pollId));
  if (!poll) {
    throw createError({ statusCode: 404, statusMessage: '투표를 찾을 수 없습니다.' });
  }

  const formattedPoll = {
    id: poll.polls.id,
    title: poll.polls.title,
    description: poll.polls.description,
    createdAt: poll.polls.createdAt,
    creatorName: poll.users.name,
    isAnonymous: poll.polls.isAnonymous,
    isMultipleChoice: poll.polls.isMultipleChoice,
    allowCustomOptions: poll.polls.allowCustomOptions,
    optionType: poll.polls.optionType,
    isClosed: poll.polls.isClosed,
  };

  const resps = await db
    .select({
      value: pollOptions.value,
      count: count(pollResponses.id),
      voters: sql<string[]>`array_agg(${users.name})`,
    })
    .from(pollResponses)
    .innerJoin(users, eq(pollResponses.userId, users.id))
    .innerJoin(pollOptions, eq(pollResponses.optionId, pollOptions.id))
    .where(eq(pollResponses.pollId, pollId))
    .groupBy(pollOptions.value);

  // 무기명 투표 데이터 마스킹
  if (poll.polls.isAnonymous) {
    resps.forEach((response) => {
      response.voters = Array(response.count).fill('Anonymous');
    });
  }

  const totalVotes = resps.reduce((acc, response) => acc + response.count, 0);
  const sortedResponses: PollResponse = resps
    .sort((a, b) => b.count - a.count)
    .map((r) => {
      return {
        ...r,
        rank: 0,
      };
    });

  let currentRank = 1;
  sortedResponses.forEach((resp, index) => {
    if (index > 0) {
      const prevResp = sortedResponses[index - 1];
      if (!prevResp) throw new Error('이전 응답을 찾을 수 없습니다.');
      if (prevResp.count > resp.count) {
        currentRank = index + 1;
      }
    }
    resp.rank = currentRank;
  });

  return {
    ...formattedPoll,
    totalVotes,
    votes: sortedResponses,
  };
});
