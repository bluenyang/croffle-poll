import { eq } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { polls, pollOptions, users } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const pollId = event.context.params?.id;

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

  // VOTE가 아닌 설문이나 의견 취합의 경우, 생성자 또는 관리자만 설문 결과를 볼 수 있음.
  if (poll.polls.type !== 'VOTE') {
    const session = await getUserSession(event);
    if (!session.user) {
      throw createError({ statusCode: 401 });
    }
    // 관리자 확인
    if (session.user.role !== 'ADMIN' && poll.polls.creatorId !== session.user.id) {
      throw createError({ statusCode: 403, statusMessage: '설문조사의 결과를 볼 수 없습니다.' });
    }
  }

  // poll 기본 정보 포매팅
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

  // VOTE이면 투표 결과를 조회해야 함
  // 근데 type이나 설정에 따라 응답을 다르게 반환해야 할 수도 있음.
  if (poll.polls.type === 'VOTE') {
    // 일단 투표 기록 조회
    const rawResps = await db
      .select({
        optionId: pollOptions.id,
        optionValue: pollOptions.content,
        nickname: users.nickname,
      })
      .from(pollSubmissionOptions)
      .leftJoin(pollOptions, eq(pollSubmissionOptions.optionId, pollOptions.id))
      .leftJoin(users, eq(pollOptions.addedBy, users.id))
      .where(eq(pollOptions.pollId, pollId));

    // 조회 결과 없으면 그냥 0 반환
    if (!rawResps || rawResps.length === 0) {
      return {
        ...formattedPoll,
        totalVotes: 0,
        submissions: [],
      };
    }

    const optionStats = new Map<string, { value: string; count: number; voters: string[] }>();

    rawResps.forEach((row) => {
      if (!row.optionId || !row.optionValue) return;

      if (!optionStats.has(row.optionId)) {
        optionStats.set(row.optionId, {
          value: row.optionValue,
          count: 0,
          voters: [],
        });
      }

      const stat = optionStats.get(row.optionId)!;
      stat.count++;

      if (poll.polls.isAnonymous) {
        stat.voters.push('익명');
      } else {
        stat.voters.push(row.nickname || '알 수 없는 유저');
      }
    });

    const sortedResps = Array.from(optionStats.values())
      .sort((a, b) => b.count - a.count)
      .map((i) => ({ ...i, rank: 0 }));

    // 순위 매기기
    let currentRank = 1;
    let prevCount = -1;
    sortedResps.forEach((resp, idx) => {
      if (idx > 0 && resp.count < prevCount) {
        currentRank = idx + 1;
      }
      resp.rank = currentRank;
      prevCount = resp.count;
    });

    // 총 투표 수
    const totalVotes = rawResps.length;

    return {
      ...formattedPoll,
      totalVotes,
      submissions: sortedResps,
    };
  } else {
    // APPLICATION, OPINION의 경우, 누가, 어떤 내용을 답했는지만 보여주면 됨.
    const submissions = await db
      .select({
        content: pollSubmissions.content,
        nickname: users.nickname,
      })
      .from(pollSubmissions)
      .leftJoin(users, eq(pollSubmissions.userId, users.id))
      .where(eq(pollSubmissions.pollId, pollId));

    return {
      ...formattedPoll,
      totalVotes: submissions.length,
      submissions,
    };
  }
});
