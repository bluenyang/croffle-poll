import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { uuidv7 } from 'uuidv7';

export const pollTypeEnum = pgEnum('poll_type', ['VOTE', 'APPLICATION', 'OPINION']);
export const pollStatusEnum = pgEnum('poll_status', ['ACTIVE', 'CLOSED']);

export const polls = pgTable('polls', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  creatorId: uuid('creator_id').references(() => users.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: pollTypeEnum('type').notNull(),
  status: pollStatusEnum('status').default('ACTIVE').notNull(),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  isMultipleChoice: boolean('is_multiple_choice').default(false),
  allowCustomOptions: boolean('allow_custom_options').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  closedAt: timestamp('closed_at', { withTimezone: true }),
});
