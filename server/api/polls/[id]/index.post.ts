import { and, eq } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { SubmitPollRequestSchema } from '~~/shared/dto/poll';

export default defineEventHandler(async (event) => {
  const pollId = event.context.params?.id;
  if (!pollId) throw createError({ statusCode: 400, statusMessage: '투표를 찾을 수 없습니다.' });

  const { optionIds, content, customOptionValues } = await readValidatedBody(event, SubmitPollRequestSchema.parse);

  return await db.transaction(async (tx) => {
    const session = await getUserSession(event);
    if (!session.user) throw createError({ statusCode: 401 });

    const { id: userId } = session.user;

    const [poll] = await tx.select().from(polls).where(eq(polls.id, pollId));
    if (!poll) {
      throw createError({ statusCode: 404 });
    }

    if (poll.type !== 'VOTE') {
      // VOTE => 투표. Option을 선택하는 방식임.
      // Option이 추가될 가능성이 있음.
      // VOTE가 아닌 설문조사라면, 그냥 응답을 poll_submissions에 추가해버리면 끝임.

      if (!content) {
        throw createError({ statusCode: 400, statusMessage: '설문조사에 대한 응답이 없습니다.' });
      }

      await tx
        .insert(pollSubmissions)
        .values({
          pollId,
          userId,
          content,
        })
        .returning();
    } else {
      // VOTE
      const selectedOptionIds = optionIds || [];
      const customOptions = customOptionValues || [];

      // allowCustomOption이 false이고, custom을 입력했다면?
      if (poll.allowCustomOptions === false && customOptions.length > 0) {
        throw createError({ statusCode: 400, statusMessage: '커스텀 옵션이 허용되지 않습니다.' });
      }

      // 다중처리에 대한 처리
      if (poll.isMultipleChoice === false && selectedOptionIds.length + customOptions.length > 1) {
        throw createError({ statusCode: 400, statusMessage: '다중선택이 불가능합니다.' });
      }

      // 만약 이미 투표를 했다? -> 그럼 응답을 수정하는 방식으로.
      // 다중 투표일수 있음  -> 응답을 삭제한 다음 새로 추가.
      // 결론적으로 응답을 삭제한 다음 새로 추가하는 방식으로 처리함.
      // poll_submission_options에는 submission(투표 제출 기록)이 삭제되면 cascading으로 삭제됨.
      // 즉, 그냥 submission을 삭제하고 새로 넣으면 됨.

      // 삭제
      await tx
        .delete(pollSubmissions)
        .where(and(eq(pollSubmissions.userId, userId), eq(pollSubmissions.pollId, pollId)));

      // 이제 새로운 투표기록을 생성.

      // 우선 추가 option이 있는지부터 체크
      if (customOptions.length > 0) {
        // 추가 option 생성.
        const createdOptions = await Promise.all(
          customOptions.map(async (value) => {
            // content(값)을 기준으로 existing pollOption을 조회.
            // existing pollOption이 존재한다면 -> 해당 옵션의 ID를 반환.
            // existing pollOption이 존재하지 않는다면 -> 새로운 옵션을 생성하고 해당 옵션의 ID를 반환.
            const [existingOption] = await tx
              .select()
              .from(pollOptions)
              .where(and(eq(pollOptions.pollId, pollId), eq(pollOptions.content, value)));

            // existing pollOption이 존재한다면 -> 해당 옵션 ID 반환.
            if (existingOption) {
              return existingOption.id;
            }

            // existing pollOption이 존재하지 않는다면 -> 새로운 옵션을 생성하고 해당 옵션의 ID를 반환.
            const [createdOption] = await tx
              .insert(pollOptions)
              .values({
                pollId,
                content: value,
                addedBy: userId,
              })
              .returning();

            return createdOption?.id;
          })
        );

        // 추가된 option을 선택값으로 추가.
        selectedOptionIds.push(...createdOptions.filter((v) => v !== undefined));
      }

      // 투표 기록 생성.
      const [submission] = await tx
        .insert(pollSubmissions)
        .values({
          pollId,
          userId,
          content: null,
        })
        .returning();
      if (!submission) {
        throw createError({ statusCode: 500 });
      }

      // 해당 투표 기록에 선택한 옵션들을 추가.
      await tx.insert(pollSubmissionOptions).values(
        selectedOptionIds.map((optionId) => ({
          submissionId: submission.id,
          optionId,
        }))
      );
    }
  });
});
