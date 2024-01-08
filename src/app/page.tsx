import TodoList from '@/app/_components/TodoList';
import { serverClientTRPC } from '@/app/_utils/trpc/server';

export default async function Home() {
  const initialTodos = await serverClientTRPC.getTodos();
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100'>
      <div className='z-10 max-w-5xl w-full flex flex-col items-center justify-between font-mono text-sm lg:flex lg:items-center lg:justify-between p-8 bg-white shadow-md rounded-md'>
        <h1 className='text-2xl font-bold mb-4'>Test with tRPC</h1>
        <TodoList initialTodos={initialTodos} />
      </div>
    </main>
  );
}
