import { and, eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { pollOptions, pollResponses } from '~~/server/utils/schema';

interface RequestBody {
  optionIds: number[];
  customOptionValue?: string[];
}

export default defineEventHandler(async (event) => {
  const pollId = Number(event.context.params?.id);
  const body = await readBody<RequestBody>(event);

  return await db.transaction(async (tx) => {
    const session = await getUserSession(event);
    if (!session.user) throw createError({ statusCode: 401 });
    const user = session.user as {
      id: number;
      email: string;
      name: string;
      role: 'ADMIN' | 'MEMBER';
    };
    const userId = user.id;

    // 커스텀 항목(직접 작성)이 넘어왔다면 먼저 option을 INSERT
    const customOptionIds: number[] = [];

    if (body.customOptionValue && body.customOptionValue.length > 0) {
      body.customOptionValue.map(async (v) => {
        const [existingOption] = await tx
          .select()
          .from(pollOptions)
          .where(and(eq(pollOptions.pollId, pollId), eq(pollOptions.value, v)));

        if (existingOption) {
          customOptionIds.push(existingOption.id); // 이미 존재하는 항목이면 그걸 사용
        } else {
          const [newOption] = await tx
            .insert(pollOptions)
            .values({
              pollId,
              value: v,
              createdBy: userId, // 누가 추가한 항목인지 기록
            })
            .returning();

          if (!newOption) {
            throw new Error('커스텀 옵션 생성 실패');
          }

          customOptionIds.push(newOption.id);
        }
      });
    }

    // 선택한 optionId 리스트 취합
    const targetOptionIds = body.optionIds || [];
    if (customOptionIds.length > 0) targetOptionIds.push(...customOptionIds);

    // 투표 응답 인서트
    // TODO: 중복 투표 방지 로직 (이미 이 pollId와 userId로 기록이 있는지 체크) 추가 필요
    if (targetOptionIds.length > 0) {
      const existingPolls = await tx
        .select()
        .from(pollResponses)
        .where(and(eq(pollResponses.pollId, pollId), eq(pollResponses.userId, userId)));

      const polldOptionIds = existingPolls.map((v) => v.optionId);

      const newResponsesToInsert = targetOptionIds
        .filter((optId: number) => !polldOptionIds.includes(optId))
        .map((optId: number) => ({
          pollId,
          optionId: optId,
          userId: userId,
        }));

      if (newResponsesToInsert.length > 0) {
        await tx.insert(pollResponses).values(newResponsesToInsert);
      }
    }

    return { success: true };
  });
});
