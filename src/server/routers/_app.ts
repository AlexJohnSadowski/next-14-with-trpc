import { publicProcedure, router } from '@/server/trpc/trpc';
import { db } from '@/server/db';
import { todos } from '@/server/db/schemas/schema';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    try {
      return await db.select().from(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    const content = opts.input.trim(); // Trim any leading or trailing whitespace

    if (content === '') {
      throw new Error('Todo content cannot be empty');
    }
    await db.insert(todos).values({ content, done: 0, id: nanoid() });
  }),
  removeTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    await db.delete(todos).where(eq(todos.id, opts.input));
  }),
});

export type AppRouter = typeof appRouter;
