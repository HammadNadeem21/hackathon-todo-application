# Quickstart Guide: Backend API & Database Implementation

## Overview
This guide provides the essential information to get started with the task management backend API using FastAPI, SQLModel, and Neon Serverless PostgreSQL.

## Prerequisites
- Python 3.11+
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
- BETTER_AUTH_SECRET environment variable (shared with frontend)

## Environment Setup

### Backend (FastAPI)
```bash
# Install dependencies
pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] python-multipart psycopg2-binary

# Set environment variables
export BETTER_AUTH_SECRET="your-secret-key-here"
export DATABASE_URL="postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
```

## Key Components

### 1. SQLModel Database Models
- User model with authentication fields
- Task model with user association
- Proper relationships and validation rules
- Automatic schema generation

### 2. FastAPI Dependencies (Integration with Spec 01)
- JWT validation dependency
- Authenticated user extraction
- User ID verification from token claims
- 401 Unauthorized responses for invalid tokens

### 3. Database Services
- Task creation, retrieval, update, and deletion
- User-scoped data access filtering
- Transaction-safe operations
- Async database operations

### 4. API Routes
- RESTful endpoints for task CRUD operations
- JWT token validation on all endpoints
- Proper HTTP status codes and error handling
- User isolation enforcement

## API Flow

1. **Authentication**: JWT token validated from Authorization header
2. **User Extraction**: User ID extracted from JWT claims
3. **Data Access**: All queries filtered by authenticated user ID
4. **Operation**: Task CRUD operations with ownership verification
5. **Response**: JSON responses with appropriate status codes

## Security Features

- User-scoped data access (all queries filtered by user_id)
- JWT token validation on every request
- No cross-user data access possible
- 401 Unauthorized responses for invalid tokens
- 403 Forbidden responses for unauthorized access attempts

## Common Endpoints

### Task Endpoints
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Error Handling

- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Attempted access to another user's data
- **404 Not Found**: Requested resource doesn't exist
- **400 Bad Request**: Invalid request data
- **500 Internal Server Error**: Database or server errors

## Database Schema

### User Table
- id (UUID, Primary Key)
- email (String, Unique, Not Null)
- created_at (DateTime)
- updated_at (DateTime)
- is_active (Boolean)

### Task Table
- id (UUID, Primary Key)
- title (String, Not Null)
- description (String, Nullable)
- completed (Boolean)
- user_id (UUID, Foreign Key to User)
- created_at (DateTime)
- updated_at (DateTime)