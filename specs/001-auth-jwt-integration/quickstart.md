# Quickstart Guide: JWT-based Authentication

## Overview
This guide provides the essential information to get started with the JWT-based authentication system using Better Auth and FastAPI.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.11+ for backend
- Neon Serverless PostgreSQL database
- BETTER_AUTH_SECRET environment variable

## Environment Setup

### Backend (FastAPI)
```bash
# Install dependencies
pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] python-multipart

# Set environment variables
export BETTER_AUTH_SECRET="your-secret-key-here"
export DATABASE_URL="postgresql://username:password@localhost/dbname"
```

### Frontend (Next.js)
```bash
# Install dependencies
npm install @better-auth/react @better-auth/next-js better-auth

# Set environment variables
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
```

## Key Components

### 1. Better Auth Configuration (Frontend)
- Configure Better Auth with JWT plugin
- Set shared secret via BETTER_AUTH_SECRET
- Ensure JWT is generated on successful login
- Token stored client-side for API requests

### 2. FastAPI JWT Validation (Backend)
- Create JWT validation dependency
- Verify token signature using shared secret
- Validate token expiration and required claims
- Extract user ID from token claims for authorization

### 3. API Client Integration (Frontend)
- Attach JWT to Authorization header for every request
- Handle 401 Unauthorized responses globally
- Prevent API calls when user is unauthenticated

## Authentication Flow

1. **Registration**: User registers via Better Auth
2. **Login**: User authenticates and receives JWT token
3. **API Access**: JWT token attached to all subsequent requests
4. **Validation**: Backend validates JWT and extracts user identity
5. **Authorization**: Backend enforces user-specific data access

## Security Features

- Stateless authentication (no server-side sessions)
- JWT signature validation on every request
- User data isolation through JWT claims verification
- 401 Unauthorized responses for invalid tokens
- No client-provided user identity trust

## Common Endpoints

### Auth Endpoints
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate and get JWT
- `POST /auth/logout` - End session

### Todo Endpoints
- `GET /todos` - Get user's todo items
- `POST /todos` - Create new todo item
- `PUT /todos/{id}` - Update todo item
- `DELETE /todos/{id}` - Delete todo item

## Error Handling

- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Attempted access to another user's data
- **404 Not Found**: Requested resource doesn't exist
- **400 Bad Request**: Invalid request data