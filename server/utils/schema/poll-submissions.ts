import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { polls } from './polls';
import { users } from './users';
import { uuidv7 } from 'uuidv7';

export const pollSubmissions = pgTable(
  'poll_submissions',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    pollId: uuid('poll_id')
      .notNull()
      .references(() => polls.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    textContent: text('text_content'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [unique('poll_submission_poll_user_unq').on(t.pollId, t.userId)]
);
