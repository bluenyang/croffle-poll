import { eq } from 'drizzle-orm';

import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import type { LoginRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { email: reqEmail, password } = await readBody<LoginRequestDto>(event);

  const [user] = await db.select().from(users).where(eq(users.email, reqEmail));

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, message: '아이디 또는 비밀번호가 틀렸습니다.' });
  }

  const { id, email, nickname, role } = user;

  await setUserSession(event, {
    user: {
      id,
      email,
      nickname,
      role,
    },
  });

  return { success: true };
});
