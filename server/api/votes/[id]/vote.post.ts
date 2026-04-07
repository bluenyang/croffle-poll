import { and, eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { voteOptions, voteResponses } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const voteId = Number(event.context.params?.id);
  const body = await readBody(event);

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
    let customOptionId = null;

    if (body.customOptionValue) {
      const [existingOption] = await tx
        .select()
        .from(voteOptions)
        .where(and(eq(voteOptions.voteId, voteId), eq(voteOptions.value, body.customOptionValue)));

      if (existingOption) {
        customOptionId = existingOption.id; // 이미 존재하는 항목이면 그걸 사용
      } else {
        const [newOption] = await tx
          .insert(voteOptions)
          .values({
            voteId,
            value: body.customOptionValue,
            createdBy: body.userId, // 누가 추가한 항목인지 기록
          })
          .returning();

        if (!newOption) {
          throw new Error('커스텀 옵션 생성 실패');
        }

        customOptionId = newOption.id;
      }
    }

    // 선택한 optionId 리스트 취합
    const targetOptionIds = body.optionIds || [];
    if (customOptionId) targetOptionIds.push(customOptionId);

    // 투표 응답 인서트
    // TODO: 중복 투표 방지 로직 (이미 이 voteId와 userId로 기록이 있는지 체크) 추가 필요
    if (targetOptionIds.length > 0) {
      const existingVotes = await tx
        .select()
        .from(voteResponses)
        .where(and(eq(voteResponses.voteId, voteId), eq(voteResponses.userId, userId)));

      const votedOptionIds = existingVotes.map((v) => v.optionId);

      const newResponsesToInsert = targetOptionIds
        .filter((optId: number) => !votedOptionIds.includes(optId))
        .map((optId: number) => ({
          voteId,
          optionId: optId,
          userId: body.userId,
        }));

      if (newResponsesToInsert.length > 0) {
        await tx.insert(voteResponses).values(newResponsesToInsert);
      }
    }

    return { success: true };
  });
});
