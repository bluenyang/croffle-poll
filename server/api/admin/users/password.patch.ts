import { eq } from 'drizzle-orm';

import { users } from '~~/server/utils/schema';
import type { UserPasswordChangeRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { newPassword, userId } = await readBody<UserPasswordChangeRequestDto>(event);

  let targetUserId: string | null = userId || null;
  if (!targetUserId) {
    const session = await getUserSession(event);
    if (!session.user) throw createError({ statusCode: 401 });
    targetUserId = session.user.id;
  }

  const hashedNewPass = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash: hashedNewPass,
    })
    .where(eq(users.id, targetUserId));

  return { success: true };
});
