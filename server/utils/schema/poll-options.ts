import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { polls } from './polls';
import { users } from './users';

export const pollOptions = pgTable('poll_options', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  pollId: uuid('poll_id')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),
  content: varchar('content', { length: 255 }).notNull(),
  addedBy: uuid('added_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
