/**
 * Unit tests for task components
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from '@/components/todos/TodoList';
import TodoForm from '@/components/todos/TodoForm';
import TodoItem from '@/components/todos/TodoItem';
import apiClient from '@/services/api_client';

// Mock the API client
jest.mock('@/services/api_client');

describe('Task Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TodoForm', () => {
    it('allows user to add a new task', async () => {
      const mockTask = { id: '1', title: 'Test task', completed: false };
      apiClient.createTask.mockResolvedValue(mockTask);

      render(<TodoForm />);

      // Find form elements
      const input = screen.getByPlaceholderText(/enter task title/i);
      const addButton = screen.getByText(/add task/i);

      // Fill in and submit form
      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.click(addButton);

      // Wait for async operations
      await waitFor(() => {
        expect(apiClient.createTask).toHaveBeenCalledWith({ title: 'Test task', completed: false });
      });
    });

    it('shows error when task title is empty', async () => {
      render(<TodoForm />);

      // Find form elements
      const input = screen.getByPlaceholderText(/enter task title/i);
      const addButton = screen.getByText(/add task/i);

      // Submit form without filling in title
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Check for error message
      expect(screen.getByText(/task title is required/i)).toBeInTheDocument();
    });
  });

  describe('TodoItem', () => {
    const mockTodo = { id: '1', title: 'Sample task', completed: false };

    it('renders task correctly', () => {
      render(<TodoItem todo={mockTodo} onToggleComplete={jest.fn()} onDelete={jest.fn()} />);

      expect(screen.getByText('Sample task')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('calls onToggleComplete when checkbox is clicked', () => {
      const toggleSpy = jest.fn();
      render(<TodoItem todo={mockTodo} onToggleComplete={toggleSpy} onDelete={jest.fn()} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(toggleSpy).toHaveBeenCalledWith(mockTodo);
    });

    it('calls onDelete when delete button is clicked', () => {
      const deleteSpy = jest.fn();
      render(<TodoItem todo={mockTodo} onToggleComplete={jest.fn()} onDelete={deleteSpy} />);

      const deleteButton = screen.getByText(/delete/i);
      fireEvent.click(deleteButton);

      expect(deleteSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('TodoList', () => {
    it('displays tasks when they are available', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true }
      ];
      apiClient.getTasks.mockResolvedValue(mockTasks);

      render(<TodoList />);

      // Wait for tasks to load
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });
    });

    it('shows message when no tasks are available', async () => {
      apiClient.getTasks.mockResolvedValue([]);

      render(<TodoList />);

      // Wait for tasks to load
      await waitFor(() => {
        expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
      });
    });
  });
});