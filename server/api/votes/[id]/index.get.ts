import { db } from '~~/server/utils/db';
import { votes, voteOptions, voteResponses } from '~~/server/utils/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // URL에서 파라미터 [id] 가져오기
  const voteId = Number(event.context.params?.id);

  // 투표 기본 정보 조회
  const [vote] = await db.select().from(votes).where(eq(votes.id, voteId));
  if (!vote) {
    throw createError({ statusCode: 404, statusMessage: '투표를 찾을 수 없습니다.' });
  }

  // 투표 항목 및 결과
  const options = await db.select().from(voteOptions).where(eq(voteOptions.voteId, voteId));
  const responses = await db.select().from(voteResponses).where(eq(voteResponses.voteId, voteId));

  // 무기명 투표 데이터 마스킹
  const safeResponses = responses.map((res) => {
    if (vote.isAnonymous) {
      // 무기명일 경우 userId를 강제로 없애서 프론트로
      const { userId, ...rest } = res;
      return rest;
    }
    return res;
  });

  return {
    ...vote,
    options,
    responses: safeResponses,
  };
});
