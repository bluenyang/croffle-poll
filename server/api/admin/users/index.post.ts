import { db } from '~~/server/utils/db';
import { users } from '~~/server/utils/schema';
import { UserAddRequestDto } from '~~/shared/dto';

export default defineEventHandler(async (event) => {
  const { email, password, nickname, role } = await readBody<UserAddRequestDto>(event);

  const hashedPassword = await hashPassword(password);

  // 비밀번호 해싱 후 저장
  await db.insert(users).values({
    email,
    passwordHash: hashedPassword,
    nickname,
    role,
  });

  return { success: true };
});
