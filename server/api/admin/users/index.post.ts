import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import { UserAddRequestSchema } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { email, nickname, role } = await readValidatedBody(event, UserAddRequestSchema.parse);

  await db.insert(users).values({
    email,
    nickname,
    role,
  });

  return { success: true };
});
