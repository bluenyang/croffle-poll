import { eq, and } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { polls } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const pollId = event.context.params?.id;
  const session = await getUserSession(event);

  if (!pollId) {
    throw createError({ statusCode: 404, message: '투표를 찾을 수 없습니다.' });
  }

  if (!session.user) {
    throw createError({ statusCode: 401, message: '로그인이 필요한 서비스입니다.' });
  }

  const isAdmin = session.user.role === 'ADMIN';

  // 작성자 본인인지 확인하기 위해 조건에 creatorId 추가
  const whereClause = isAdmin
    ? eq(polls.id, pollId)
    : and(eq(polls.id, pollId), eq(polls.creatorId, session.user.id));

  const result = await db
    .update(polls)
    .set({ status: 'CLOSED', closedAt: new Date() })
    .where(whereClause)
    .returning();

  if (result.length === 0) {
    throw createError({ statusCode: 403, message: '권한이 없거나 존재하지 않는 투표입니다.' });
  }

  return { success: true };
});
