import { consola } from 'consola';

export default defineEventHandler(async (event) => {
  const logger = consola.withTag('admin-guard');

  // Check with target paths
  if (!event.path.startsWith('/api/admin')) {
    return;
  }

  const session = await getUserSession(event);

  if (!session.user || session.user.role !== 'ADMIN') {
    logger.warn(`Access denied for ${session.user?.email ?? 'unauthenticated'} at ${event.path}`);
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: '접근 권한이 없습니다.',
    });
  }
});
