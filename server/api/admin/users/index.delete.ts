import { eq } from 'drizzle-orm';

import { UserDeleteRequestSchema } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const { userId } = await readValidatedBody(event, UserDeleteRequestSchema.parse);

  if (session.user?.id === userId) {
    throw createError({ statusCode: 400, message: '자기 자신은 삭제할 수 없습니다.' });
  }

  await db.delete(users).where(eq(users.id, userId));

  return { success: true };
});
