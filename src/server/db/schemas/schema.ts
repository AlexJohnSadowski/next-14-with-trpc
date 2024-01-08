import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const todos = mysqlTable('todos', {
  id: varchar('id', { length: 36 }).primaryKey(),
  content: varchar('name', { length: 256 }),
  done: int('done'),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
});
