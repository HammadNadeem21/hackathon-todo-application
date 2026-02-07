# API Contract: Authentication Endpoints

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Register a new user account

**Request**:
- Headers: Content-Type: application/json
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

**Responses**:
- 200: User registered successfully
  ```json
  {
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "token": "jwt-token-string"
  }
  ```
- 400: Invalid input data
- 409: User already exists

### POST /api/auth/signin
**Description**: Authenticate existing user and return JWT token

**Request**:
- Headers: Content-Type: application/json
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

**Responses**:
- 200: Authentication successful
  ```json
  {
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "token": "jwt-token-string"
  }
  ```
- 400: Invalid input data
- 401: Invalid credentials

### GET /api/tasks
**Description**: Retrieve user's tasks (requires authentication)

**Request**:
- Headers: Authorization: Bearer {jwt-token}

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
- 401: Unauthorized (invalid or missing token)

## Authentication Validation Requirements

1. All protected endpoints must validate JWT token in Authorization header
2. Token must be in format: "Bearer {token}"
3. JWT must be signed with BETTER_AUTH_SECRET
4. User identity must be extracted from JWT claims
5. Requested resources must be validated against authenticated user ID
6. Invalid tokens must result in 401 Unauthorized responses