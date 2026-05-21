import { consola } from 'consola';
import { eq } from 'drizzle-orm';

import { db } from '../utils/db';
import { users } from '../utils/schema/users';

export default defineNitroPlugin(async () => {
  const logger = consola.withTag('init-admin');

  logger.info('Checking initial Admin account via Drizzle...');

  try {
    const existingAdmin = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'ADMIN'))
      .limit(1);

    if (existingAdmin.length > 0) {
      logger.info('Admin account already exists. Skipping initialization.');
      return;
    }

    const config = useRuntimeConfig();
    const { initEmail, password } = config.initAdmin;

    if (!initEmail || !password) {
      logger.warn('INIT_ADMIN_USERNAME or INIT_ADMIN_PASSWORD not set. Skipping initialization.');
      return;
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      email: initEmail,
      passwordHash: hashedPassword,
      nickname: 'Admin',
      role: 'ADMIN',
    });

    logger.info('Admin account created successfully.');
  } catch (error) {
    logger.error('Failed to initialize admin account:', error);
  }
});
