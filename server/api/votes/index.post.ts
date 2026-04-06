import { db } from '~~/server/utils/db';
import { votes, voteOptions } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  // Read data from client request
  const body = await readBody(event);

  try {
    // Start Transaction: All operations inside must succeed for any to be committed to the DB
    const result = await db.transaction(async (tx) => {
      // Insert the main vote data and get the newly created vote record back
      const [newVote] = await tx
        .insert(votes)
        .values({
          creatorId: body.creatorId, // 나중엔 인증 토큰에서 빼오는 걸로 수정해야 함
          title: body.title,
          description: body.description,
          isAnonymous: body.isAnonymous,
          isMultipleChoice: body.isMultipleChoice,
          allowCustomOptions: body.allowCustomOptions,
          optionType: body.optionType,
        })
        .returning();

      if (!newVote) {
        throw new Error('투표 생성 실패');
      }

      // 투표 항목 인서트 (옵션이 배열로 들어왔을 경우)
      if (body.options && body.options.length > 0) {
        const optionsToInsert = body.options.map((opt: string) => ({
          voteId: newVote.id,
          value: opt,
        }));
        await tx.insert(voteOptions).values(optionsToInsert);
      }

      return newVote;
    });

    return { success: true, vote: result };
  } catch {
    throw createError({ statusCode: 500, statusMessage: '투표 생성 실패' });
  }
});
