# Hackathon Todo Application

A full-stack web application with JWT-based authentication and multi-user support.

## Features

- User registration and authentication with JWT tokens
- Secure task management with user isolation
- Session management across browser sessions
- Responsive web interface

## Tech Stack

- **Frontend**: Next.js 16+, React
- **Backend**: Python FastAPI
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **ORM**: SQLModel

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

   Or if you don't have the file yet, install manually:
   ```bash
   pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] python-multipart psycopg2-binary
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and set your BETTER_AUTH_SECRET and DATABASE_URL
   ```

4. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set your NEXT_PUBLIC_BETTER_AUTH_URL and NEXT_PUBLIC_API_URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout user

### Task Management
- `GET /tasks` - Get all tasks for the authenticated user
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a specific task
- `DELETE /tasks/{id}` - Delete a specific task

## Security Features

- JWT-based authentication with token validation
- User data isolation - users can only access their own tasks
- Password hashing with bcrypt
- Stateless authentication (no server-side sessions)
- Protected routes requiring valid JWT tokens
- Secure secret handling (no hardcoded secrets)
- Configurable CORS settings (no wildcard origins in production)
- Proper host validation (no wildcard hosts in production)
- Secure logging (no sensitive data exposure)

## Development

### Running the Application

1. Start the backend server on port 8000
2. Start the frontend server on port 3000
3. Access the application at `http://localhost:3000`

### API Documentation

The backend provides automatic API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

### Backend (.env)
- `BETTER_AUTH_SECRET`: Secret key for JWT signing (use a strong random value)
- `DATABASE_URL`: Connection string for the PostgreSQL database

### Frontend (.env.local)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Base URL for Better Auth
- `NEXT_PUBLIC_API_URL`: Base URL for the backend API (e.g., http://localhost:8000)

**Note**: The `BETTER_AUTH_SECRET` has been removed from frontend configuration for security reasons. Secrets should never be exposed to client-side code.

## Architecture

The application follows a clear separation of concerns:
- **Frontend**: Handles UI, user interactions, and API calls
- **Backend**: Manages business logic, authentication, and database operations
- **Authentication**: JWT-based system with stateless validation
- **Database**: Neon Serverless PostgreSQL for data persistence

## Testing

To test the authentication flow:
1. Register a new user at `/register`
2. Login with the registered credentials at `/login`
3. Access the dashboard to manage tasks
4. Tasks are automatically isolated by user

## Troubleshooting

- If you get authentication errors, ensure the `BETTER_AUTH_SECRET` is identical in both frontend and backend
- Make sure the backend API is running before starting the frontend
- Check that CORS settings allow requests from your frontend origin