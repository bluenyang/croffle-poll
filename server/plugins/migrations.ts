import path from 'node:path';

import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { db } from '~~/server/utils/db';

export default defineNitroPlugin(async () => {
  // 로컬 개발 환경(dev)에서는 HMR 등으로 인해 여러 번 실행될 수 있으므로
  // 프로덕션 환경(배포)에서만 자동 마이그레이션이 동작하도록 설정합니다.
  if (process.env.NODE_ENV !== 'production') return;

  try {
    console.log('⏳ Starting automatic database migrations...');
    // Dockerfile에서 복사해둔 drizzle 폴더의 물리적 경로를 지정합니다.
    const folder = path.resolve(process.cwd(), './drizzle');
    
    await migrate(db, { migrationsFolder: folder });
    console.log('✅ Automatic database migrations completed');
  } catch (error) {
    console.error('❌ Automatic database migrations failed:', error);
  }
});
