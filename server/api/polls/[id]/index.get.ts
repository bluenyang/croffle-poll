import { eq } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { polls, pollOptions, users } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  // URL에서 파라미터 [id] 가져오기
  const pollId = event.context.params?.id || null;

  if (!pollId) {
    throw createError({ statusCode: 404, statusMessage: '투표를 찾을 수 없습니다.' });
  }

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
    creatorName: poll.users.nickname,
    isAnonymous: poll.polls.isAnonymous,
    isMultipleChoice: poll.polls.isMultipleChoice,
    allowCustomOptions: poll.polls.allowCustomOptions,
    type: poll.polls.type,
    status: poll.polls.status,
    closedAt: poll.polls.closedAt,
  };

  if (poll.polls.type !== 'VOTE') {
    // vote가 아니다 -> 설문이나 의견 제출
    // 즉, 옵션이 없음.
    return {
      ...formattedPoll,
      options: [],
    };
  }

  // 투표 항목
  const options = await db
    .select()
    .from(pollOptions)
    .innerJoin(users, eq(pollOptions.addedBy, users.id))
    .where(eq(pollOptions.pollId, pollId));

  const formattedOptions = options.map((option) => ({
    id: option.poll_options.id,
    pollId: option.poll_options.pollId,
    creatorName: option.users.nickname,
    content: option.poll_options.content,
  }));

  return {
    ...formattedPoll,
    options: formattedOptions,
  };
});
