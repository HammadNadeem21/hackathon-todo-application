# API Contract: Backend Database Connectivity Endpoints

## Core API Endpoints

### GET /health
**Description**: Check backend and database connectivity health

**Request**:
- Headers: None required
- Parameters: None

**Responses**:
- 200: System healthy
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2026-02-06T10:30:00Z"
  }
  ```
- 503: Service unavailable (database connection issues)

### GET /api/tasks
**Description**: Retrieve user's tasks (requires authentication)

**Request**:
- Headers: Authorization: Bearer {jwt-token}
- Query Parameters:
  - limit: Maximum number of tasks to return (default: 20, max: 100)
  - offset: Number of tasks to skip (default: 0)

**Responses**:
- 200: Tasks retrieved successfully
  ```json
  [
    {
      "id": "task-id",
      "title": "Task title",
      "completed": false,
      "userId": "user-id"
    }
  ]
  ```
- 401: Unauthorized (invalid or missing token)
- 500: Internal server error (database connectivity issues)

### POST /api/tasks
**Description**: Create a new task (requires authentication)

**Request**:
- Headers: Authorization: Bearer {jwt-token}
- Body:
  ```json
  {
    "title": "New task",
    "completed": false
  }
  ```

**Responses**:
- 201: Task created successfully
  ```json
  {
    "id": "task-id",
    "title": "New task",
    "completed": false,
    "userId": "user-id"
  }
  ```
- 400: Invalid input data
- 401: Unauthorized (invalid or missing token)
- 500: Internal server error (database connectivity issues)

### GET /api/users/me
**Description**: Retrieve current user information (requires authentication)

**Request**:
- Headers: Authorization: Bearer {jwt-token}

**Responses**:
- 200: User information retrieved successfully
  ```json
  {
    "id": "user-id",
    "email": "user@example.com"
  }
  ```
- 401: Unauthorized (invalid or missing token)
- 500: Internal server error (database connectivity issues)

## Database Connectivity Requirements

1. All endpoints must validate database connectivity before processing
2. Connection pooling must be implemented for concurrent request handling
3. Database operations must timeout gracefully after 30 seconds
4. All queries must be properly parameterized to prevent SQL injection
5. Transactions must be used for multi-step operations to ensure data consistency
6. Error handling must provide appropriate HTTP status codes for database errors
7. Connection limits must be respected to prevent database overload
8. SSL must be enforced for all database connections in production