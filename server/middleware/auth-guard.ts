export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (event.method === 'POST' && event.path.startsWith('/api/auth/login')) {
    return;
  }

  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: '로그인 후 이용 가능합니다.',
    });
  }
});
