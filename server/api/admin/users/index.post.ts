import { z } from 'zod';
import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import type { UserAddRequestDto } from '~~/shared/dto';

const userSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(1),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = userSchema.safeParse(body);

  if (!result.success) {
    throw createError({ statusCode: 400, message: 'Invalid input data' });
  }

  const { email, nickname, role } = result.data;

  await db.insert(users).values({
    email,
    nickname,
    role,
  });

  return { success: true };
});
