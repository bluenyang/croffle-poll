import { eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import type { PasswordChangeRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { newPassword } = await readBody<PasswordChangeRequestDto>(event);
  const hashedPassword = await hashPassword(newPassword);

  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: '인증이 필요합니다.' });
  }

  await db
    .update(users)
    .set({
      passwordHash: hashedPassword,
    })
    .where(eq(users.id, session.user.id));

  return { success: true };
});
