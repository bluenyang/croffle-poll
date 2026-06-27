import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import type { UserAddRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { email, nickname, role } = await readBody<UserAddRequestDto>(event);

  await db.insert(users).values({
    email,
    nickname,
    role,
  });

  return { success: true };
});
