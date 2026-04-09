import { eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({ statusCode: 401, message: '인증이 필요합니다.' });
  }

  const user = session.user as {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
  };

  const { newPassword } = await readBody(event);
  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash: hashedPassword,
    })
    .where(eq(users.id, user.id));

  return { success: true };
});
