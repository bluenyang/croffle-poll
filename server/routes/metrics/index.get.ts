export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user || session.user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  return {
    status: 'ok',
    message: 'Prometheus metrics mock endpoint'
  }
})
