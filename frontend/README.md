# Todo Application Frontend

A Next.js frontend for the Todo application with authentication and task management features.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth integration
- **State Management**: React hooks

## Features

- User registration and login
- Protected routes for authenticated users
- Task creation, viewing, updating, and deletion
- Responsive design for all device sizes
- JWT-based authentication
- Secure API communication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Running the Application

1. Development mode:
```bash
npm run dev
```

2. Production build:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Protected dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # Basic UI components (Button, Input, etc.)
│   ├── todos/            # Todo-specific components
│   └── HOC/              # Higher-order components
├── services/              # Service layer (API client, auth service)
└── ...
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., http://localhost:8000)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Better Auth URL (e.g., http://localhost:3000)

## API Integration

The application communicates with the backend API through the `APIClient` service, which handles:
- JWT token management
- Authentication headers
- Error handling
- Request/response formatting

## Security Features

- JWT token storage in browser localStorage
- Protected routes with authentication checks
- Secure API communication
- Input validation and sanitization
- Error handling without sensitive data exposure

## Authentication Flow

1. User registers or logs in via the frontend
2. Authentication service stores JWT token
3. API client attaches token to all authenticated requests
4. Unauthorized users are redirected to login
5. Tokens are validated and refreshed as needed

## Responsive Design

The application uses Tailwind CSS utility classes to ensure:
- Mobile-first responsive layout
- Proper touch interactions
- Accessible color contrast
- Semantic HTML elements
