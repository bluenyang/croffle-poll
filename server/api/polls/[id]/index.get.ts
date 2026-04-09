import { db } from '~~/server/utils/db';
import { polls, pollOptions } from '~~/server/utils/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // URL에서 파라미터 [id] 가져오기
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

  // 투표 항목 및 결과
  const options = await db
    .select()
    .from(pollOptions)
    .innerJoin(users, eq(pollOptions.createdBy, users.id))
    .where(eq(pollOptions.pollId, pollId));

  const formattedOptions = options.map((option) => ({
    id: option.poll_options.id,
    pollId: option.poll_options.pollId,
    creatorName: option.users.name,
    value: option.poll_options.value,
  }));

  return {
    ...formattedPoll,
    options: formattedOptions,
  };
});
