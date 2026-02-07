import React, { useState, useEffect } from 'react';
import apiClient from '@/services/api_client';
import TodoItem from './TodoItem';
import { Task } from '@/services/api_client';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTasks();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteTask(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleToggleComplete = async (todo: Task) => {
    try {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed
      };

      const response = await apiClient.updateTask(todo.id, updatedTodo);

      setTodos(todos.map(t =>
        t.id === todo.id ? response : t
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tasks</h3>

      {todos.length === 0 ? (
        <p className="text-gray-500 italic">No tasks yet. Add a new task to get started!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;