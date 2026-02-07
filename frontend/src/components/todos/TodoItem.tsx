import React, { useState } from 'react';
import apiClient from '@/services/api_client';
import Button from '@/components/ui/Button';
import { Task } from '@/services/api_client';

interface TodoItemProps {
  todo: Task;
  onToggleComplete: (todo: Task) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editValue.trim()) return;

    setLoading(true);

    try {
      const response = await apiClient.updateTask(todo.id, {
        title: editValue,
        completed: todo.completed
      });

      onToggleComplete({ ...todo, title: response.title });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span
          className={`ml-3 text-gray-700 ${todo.completed ? 'line-through text-gray-500' : ''}`}
          onClick={() => !isEditing && onToggleComplete(todo)}
        >
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="flex items-center">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
                disabled={loading}
              />
              <Button
                type="submit"
                variant="primary"
                size="small"
                disabled={loading}
                className="ml-2"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(todo.title);
                }}
                className="ml-1"
              >
                Cancel
              </Button>
            </form>
          ) : (
            <span
              onDoubleClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              {todo.title}
            </span>
          )}
        </span>
      </div>
      <div className="flex space-x-2">
        {!isEditing && (
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </Button>
      </div>
    </li>
  );
};

export default TodoItem;