# Quickstart Guide: Frontend UI & Integration

## Overview
This guide provides essential information to get started with the Next.js frontend application featuring user authentication and task management.

## Prerequisites
- Node.js 18+
- npm or yarn package manager
- Access to backend API (from Spec 02 implementation)

## Setup Instructions

### 1. Project Initialization
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration
Create a `.env.local` file with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-shared-secret-key

# Next.js Configuration
NEXT_PUBLIC_APP_NAME="Todo Application"
```

### 3. Development Server
```bash
# Start the development server
npm run dev
# or
yarn dev

# Application will be available at http://localhost:3000
```

## Key Components

### 1. App Router Structure
- `(auth)` directory: Authentication-related pages (register, login)
- `dashboard` directory: Protected user dashboard with task management
- `layout.js`: Root layout with global providers and navigation
- `globals.css`: Global styles and Tailwind CSS configuration

### 2. Authentication Flow
- Better Auth integration for user registration/login
- JWT token management in browser storage
- Protected route middleware for access control
- Global authentication state management

### 3. API Integration
- Centralized API client with JWT token attachment
- Error handling and loading state management
- Consistent request/response patterns
- 401 Unauthorized response handling

### 4. Task Management UI
- Task list component with responsive design
- Task creation, update, and deletion interfaces
- Completion status toggling
- Real-time UI updates reflecting backend state

## Common Workflows

### User Registration Flow
1. User navigates to `/register`
2. User submits email and password
3. Better Auth processes registration
4. User redirected to login page

### User Login Flow
1. User navigates to `/login`
2. User submits credentials
3. Better Auth validates credentials and returns JWT
4. JWT stored in browser storage
5. User redirected to dashboard

### Task Management Flow
1. Authenticated user accesses dashboard
2. API client automatically attaches JWT to requests
3. User creates/updates/deletes tasks via UI
4. Changes synchronized with backend API
5. UI updates to reflect backend state

## Security Features

- JWT token validation on every API request
- Protected routes preventing unauthorized access
- Secure token storage in browser (avoiding XSS vulnerabilities)
- Proper error handling to prevent information leakage
- Input validation and sanitization

## Responsive Design

- Mobile-first approach using Tailwind CSS
- Responsive breakpoints for mobile, tablet, desktop
- Touch-friendly interface elements
- Optimized layouts for different screen sizes

## Error Handling

- Global error boundaries for unexpected errors
- API error responses with user-friendly messages
- Loading states during API requests
- Network error handling with retry mechanisms