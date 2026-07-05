import { db } from '~~/server/utils/db';
import { polls, pollOptions } from '~~/server/utils/schema';
import { AddNewPollRequestSchema } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: '로그인이 필요합니다.' });
  }

  const userId = session.user.id;

  // Read data from client request
  const {
    title,
    description,
    isAnonymous,
    isMultipleChoice,
    allowCustomOptions,
    type,
    status,
    optionType,
    closedAt,
    options,
  } = await readValidatedBody(event, AddNewPollRequestSchema.parse);

  try {
    // Start Transaction: All operations inside must succeed for any to be committed to the DB
    const result = await db.transaction(async (tx) => {
      // Insert the main poll data and get the newly created poll record back
      const [newPoll] = await tx
        .insert(polls)
        .values({
          creatorId: userId,
          title,
          description,
          isAnonymous,
          isMultipleChoice,
          allowCustomOptions,
          type,
          status,
          optionType,
          closedAt,
        })
        .returning();

      if (!newPoll) {
        throw new Error('투표 생성 실패');
      }

      // 투표 항목 인서트 (옵션이 배열로 들어왔을 경우)
      if (options && options.length > 0) {
        const optionsToInsert = options.map(({ content }) => ({
          pollId: newPoll.id,
          content,
          addedBy: userId,
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
