import { eq } from 'drizzle-orm';
import type { UserDeleteRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { userId } = await readBody<UserDeleteRequestDto>(event);

  if (!userId) throw createError({ statusCode: 400, message: 'User ID is required' });

  await db.delete(users).where(eq(users.id, userId));

  return { success: true };
});
