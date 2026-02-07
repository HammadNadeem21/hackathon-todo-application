# API Contracts: Frontend UI & Frontend–Backend Connectivity Recovery

## Authentication Endpoints

### GET /api/auth/status
**Description**: Check authentication status and return user info if authenticated
**Headers**:
- Authorization: Bearer {jwt_token} (optional for this endpoint)

**Response**:
- 200: { "authenticated": true, "user": { "id": string, "email": string } }
- 401: { "error": "Unauthorized", "message": "Invalid or expired token" }

### POST /api/auth/login
**Description**: Authenticate user and return JWT token
**Body**: { "email": string, "password": string }
**Response**:
- 200: { "token": string, "user": { "id": string, "email": string } }
- 401: { "error": "Unauthorized", "message": "Invalid credentials" }

### POST /api/auth/logout
**Description**: Logout user and invalidate session
**Headers**:
- Authorization: Bearer {jwt_token}
**Response**:
- 200: { "success": true }
- 401: { "error": "Unauthorized" }

## Task Management Endpoints

### GET /api/tasks
**Description**: Retrieve all tasks for the authenticated user
**Headers**:
- Authorization: Bearer {jwt_token}
**Response**:
- 200: { "tasks": [{ "id": string, "title": string, "description": string, "status": "pending|completed", "userId": string }] }
- 401: { "error": "Unauthorized" }
- 500: { "error": "Internal Server Error" }

### POST /api/tasks
**Description**: Create a new task for the authenticated user
**Headers**:
- Authorization: Bearer {jwt_token}
**Body**: { "title": string, "description": string, "status": "pending|completed" }
**Response**:
- 201: { "task": { "id": string, "title": string, "description": string, "status": "pending|completed", "userId": string } }
- 401: { "error": "Unauthorized" }
- 400: { "error": "Bad Request", "message": "Validation error" }
- 500: { "error": "Internal Server Error" }

### PUT /api/tasks/{id}
**Description**: Update an existing task for the authenticated user
**Headers**:
- Authorization: Bearer {jwt_token}
**Body**: { "title": string, "description": string, "status": "pending|completed" }
**Response**:
- 200: { "task": { "id": string, "title": string, "description": string, "status": "pending|completed", "userId": string } }
- 401: { "error": "Unauthorized" }
- 404: { "error": "Not Found", "message": "Task not found" }
- 500: { "error": "Internal Server Error" }

### DELETE /api/tasks/{id}
**Description**: Delete a task for the authenticated user
**Headers**:
- Authorization: Bearer {jwt_token}
**Response**:
- 200: { "success": true }
- 401: { "error": "Unauthorized" }
- 404: { "error": "Not Found", "message": "Task not found" }
- 500: { "error": "Internal Server Error" }