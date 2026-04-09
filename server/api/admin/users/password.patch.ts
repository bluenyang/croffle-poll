import { eq } from 'drizzle-orm';
import { users } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) throw createError({ statusCode: 401 });

  const user = session.user as {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
  };

  if (user.role !== 'ADMIN') throw createError({ statusCode: 403 });

  const { newPassword, userId } = await readBody(event);
  let targetUserId: number | null = userId;
  if (!targetUserId) {
    targetUserId = user.id;
  }

  const hashedNewPass = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash: hashedNewPass,
    })
    .where(eq(users.id, userId));

  return { success: true };
});
