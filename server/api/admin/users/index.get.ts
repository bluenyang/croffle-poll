import { asc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  return await db.select().from(users).orderBy(asc(users.id));
});
