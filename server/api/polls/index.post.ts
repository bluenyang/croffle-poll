import { db } from '~~/server/utils/db';
import { polls, pollOptions } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: '로그인이 필요합니다.' });
  }
  const user = session.user as {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
  };

  // Read data from client request
  const body = await readBody(event);

  try {
    // Start Transaction: All operations inside must succeed for any to be committed to the DB
    const result = await db.transaction(async (tx) => {
      // Insert the main poll data and get the newly created poll record back
      const [newPoll] = await tx
        .insert(polls)
        .values({
          creatorId: user.id,
          title: body.title,
          description: body.description,
          isAnonymous: body.isAnonymous,
          isMultipleChoice: body.isMultipleChoice,
          allowCustomOptions: body.allowCustomOptions,
          optionType: body.optionType,
        })
        .returning();

      if (!newPoll) {
        throw new Error('투표 생성 실패');
      }

      // 투표 항목 인서트 (옵션이 배열로 들어왔을 경우)
      if (body.options && body.options.length > 0) {
        const optionsToInsert = body.options.map(({ value }: { value: string }) => ({
          pollId: newPoll.id,
          value,
          createdBy: user.id,
        }));
        await tx.insert(pollOptions).values(optionsToInsert);
      }

      return newPoll;
    });

    return { success: true, poll: result };
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '투표 생성 실패',
    });
  }
});
