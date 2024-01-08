'use client';

import { trpc } from '@/app/_utils/trpc/client';
import { useEffect, useState } from 'react';
import { serverClientTRPC } from '@/app/_utils/trpc/server';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

type TodosType = Awaited<ReturnType<(typeof serverClientTRPC)['getTodos']>>;
const TodoList = ({ initialTodos }: { initialTodos: TodosType }) => {
  const getTodos = trpc.getTodos.useQuery(undefined, { initialData: initialTodos });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const removeTodo = trpc.removeTodo.useMutation();

  const { data, isLoading } = getTodos;

  const [todos, setTodos] = useState(data);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      setTodos(data);
    }
  }, [data]);

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

  const handleRemoveTodo = async (id: string) => {
    try {
      await removeTodo.mutateAsync(id);
      getTodos.refetch();
    } catch (error) {
      console.error('Error removing todo:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  }

  return (
    !isLoading && (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className='mt-4'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4'>
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className='flex mb-4 space-x-2'>
            <input
              className='border p-2 flex-1 text-black'
              type='text'
              placeholder='Enter todo content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handleAddTodo}>
              Add Todo
            </button>
          </div>
          {data && todos && (
            <Droppable droppableId='droppable'>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='divide-y bg-white shadow border rounded-lg'
                >
                  {todos.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='p-4 flex items-center justify-between'
                        >
                          <span className='font-semibold text-gray-700'>{todo.content}</span>
                          <div className='flex items-center space-x-2'>
                            <button
                              className='px-2 py-1 border-2 border-red-500 text-red-600 hover:text-red-800 rounded-md'
                              onClick={() => handleRemoveTodo(todo.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          )}
        </div>
        )
      </DragDropContext>
    )
  );
};

export default TodoList;
