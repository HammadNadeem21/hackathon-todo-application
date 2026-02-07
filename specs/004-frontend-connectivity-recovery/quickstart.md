# Quickstart Guide: Frontend UI & Frontend–Backend Connectivity Recovery

## Prerequisites
- Node.js 18+ installed
- Python 3.11+ installed
- Access to Neon Serverless PostgreSQL database
- Better Auth configured with JWT tokens

## Setup Instructions

### 1. Environment Configuration
```bash
# In frontend directory
cp .env.example .env.local
# Update the following variables:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key
```

### 2. Install Dependencies
```bash
# Backend setup
cd backend
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 3. Running the Applications

#### Start Backend Server
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

#### Start Frontend Server
```bash
cd frontend
npm run dev
```

## API Communication Pattern

### Making Authenticated Requests
```javascript
// Example of how frontend should make authenticated API calls
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('jwt_token'); // Or however token is stored

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Handle unauthorized access
    // Redirect to login or clear session
  }

  return response;
};
```

### Error Handling Pattern
```javascript
// Centralized error handling
const handleApiError = (error) => {
  switch(error.status) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 404:
      // Show not found message
      console.error('Resource not found');
      break;
    case 500:
      // Show generic error message
      console.error('Server error occurred');
      break;
    default:
      // Handle other errors
      console.error('An error occurred:', error.message);
  }
};
```

## Key Integration Points

1. **Authentication Integration**: Ensure Better Auth properly sets JWT tokens
2. **Token Storage**: Securely store JWT tokens in browser storage
3. **Request Interception**: Intercept all API requests to include JWT tokens
4. **Response Handling**: Properly handle different response status codes
5. **Session Management**: Maintain session state across page navigations