/**
 * Integration tests for task flows
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import apiClient from '@/services/api_client';

// Mock the API client
jest.mock('@/services/api_client');

// Mock the auth service
jest.mock('@/services/auth_service', () => ({
  default: {
    isAuthenticated: jest.fn().mockReturnValue(true),
    getCurrentUser: jest.fn().mockReturnValue({ email: 'test@example.com' }),
    logout: jest.fn().mockResolvedValue({ success: true, message: 'Logged out successfully' }),
  },
}));

// Mock next/router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Task Management Flows Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full Task Management Flow', () => {
    it('allows user to create, update, and delete tasks', async () => {
      // Mock initial tasks
      apiClient.getTasks.mockResolvedValue([]);

      // Mock task creation
      const newTask = { id: '1', title: 'New task', completed: false };
      apiClient.createTask.mockResolvedValue(newTask);

      // Mock task update
      const updatedTask = { id: '1', title: 'Updated task', completed: true };
      apiClient.updateTask.mockResolvedValue(updatedTask);

      // Mock task deletion
      apiClient.deleteTask.mockResolvedValue({ success: true });

      render(<DashboardPage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/manage your tasks/i)).toBeInTheDocument();
      });

      // Add a new task
      const taskInput = screen.getByPlaceholderText(/enter task title/i);
      const addTaskButton = screen.getByText(/add task/i);

      fireEvent.change(taskInput, { target: { value: 'New task' } });
      fireEvent.click(addTaskButton);

      // Wait for task to be added
      await waitFor(() => {
        expect(apiClient.createTask).toHaveBeenCalledWith({ title: 'New task', completed: false });
        expect(screen.getByText('New task')).toBeInTheDocument();
      });

      // Update the task (mark as complete)
      const taskCheckbox = screen.getByRole('checkbox');
      fireEvent.click(taskCheckbox);

      await waitFor(() => {
        expect(apiClient.updateTask).toHaveBeenCalledWith('1', {
          ...newTask,
          completed: true
        });
      });

      // Delete the task
      const deleteButton = screen.getByText(/delete/i);
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(apiClient.deleteTask).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock error when fetching tasks
      apiClient.getTasks.mockRejectedValue(new Error('Failed to load tasks'));

      render(<DashboardPage />);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
      });
    });

    it('handles task creation errors', async () => {
      // Mock initial state
      apiClient.getTasks.mockResolvedValue([]);

      // Mock error when creating task
      apiClient.createTask.mockRejectedValue(new Error('Failed to create task'));

      render(<DashboardPage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/manage your tasks/i)).toBeInTheDocument();
      });

      // Attempt to add a task that will fail
      const taskInput = screen.getByPlaceholderText(/enter task title/i);
      const addTaskButton = screen.getByText(/add task/i);

      fireEvent.change(taskInput, { target: { value: 'Failing task' } });
      fireEvent.click(addTaskButton);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
      });
    });
  });
});