'use client';
import { trpc } from '@/app/_utils/trpc/client';
import { useState } from 'react';
import { serverClientTRPC } from '@/app/_utils/trpc/server';

const TodoList = ({ initialTodos }: { initialTodos: Awaited<ReturnType<(typeof serverClientTRPC)['getTodos']>> }) => {
  const getTodos = trpc.getTodos.useQuery(undefined, { initialData: initialTodos });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const removeTodo = trpc.removeTodo.useMutation();

  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleAddTodo = async () => {
    try {
      if (content.trim() === '') {
        throw new Error('Todo content cannot be empty');
      }

      await addTodo.mutateAsync(content);
      setContent('');
      setError(null);
      await getTodos.refetch();
    } catch (error) {
      // @ts-ignore
      setError(error.message);
    }
  };

  const { data, isLoading } = getTodos;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleRemoveTodo = async (id: string) => {
    try {
      await removeTodo.mutateAsync(id);
      getTodos.refetch();
    } catch (error) {
      console.error('Error removing todo:', error);
    }
  };

  return (
    <div className='mt-4 w-full px-4'>
      {error && (
        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4'>
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
      <div className='flex mb-4'>
        <input
          className='border border-gray-300 p-2 flex-1 text-blue-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          type='text'
          placeholder='Enter todo content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg' onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>

      {getTodos.isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className='divide-y divide-gray-200'>
          {getTodos.data &&
            getTodos.data.map((todo) => (
              <li key={todo.id} className='flex items-center justify-between p-4 hover:bg-gray-50'>
                <span className={`font-medium ${todo.done ? 'text-green-600' : 'text-gray-800'}`}>{todo.content}</span>
                <div className='flex items-center space-x-2'>
                  <button
                    className='text-red-500 hover:text-red-700 transition-colors'
                    onClick={() => handleRemoveTodo(todo.id)}
                  >
                    Remove
                  </button>
                  <span className={`text-sm font-semibold ${todo.done ? 'text-green-600' : 'text-red-600'}`}>
                    {todo.done ? 'Done' : 'Not Done'}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
