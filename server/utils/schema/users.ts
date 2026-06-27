import { pgEnum, pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MEMBER']);

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  email: varchar('email', { length: 100 }).notNull().unique(),
  nickname: varchar('nickname', { length: 50 }).notNull(),
  role: userRoleEnum('role').default('MEMBER').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
