import TodoList from '@/app/_components/TodoList';
import { serverClientTRPC } from '@/app/_utils/trpc/server';

export default async function Home() {
  const initialTodos = await serverClientTRPC.getTodos();
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 px-4'>
      <div className='max-w-4xl w-full flex flex-col items-center bg-white shadow-lg rounded-lg overflow-hidden'>
        <h1 className='text-3xl font-bold text-gray-700 py-4'>Test of App Router with tRPC</h1>
        <TodoList initialTodos={initialTodos} />
      </div>
    </main>
  );
}
