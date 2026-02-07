# Quickstart Guide: Authentication Debugging & Recovery

## Overview
This guide provides the essential steps to set up and test the authentication system after debugging and recovery.

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- BETTER_AUTH_SECRET configured in both frontend and backend
- Neon Serverless PostgreSQL database running

## Setup Steps

### 1. Environment Configuration
Set up environment variables for both frontend and backend:
```bash
# Backend (.env in backend directory)
BETTER_AUTH_SECRET=your-shared-secret-key
DATABASE_URL=postgresql://username:password@host:port/database
ALLOWED_ORIGINS=http://localhost:3000
```

```bash
# Frontend (.env in frontend directory)
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_SECRET=your-shared-secret-key
```

### 2. Start Backend Server
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --port 8000
```

### 3. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```

## Testing Authentication Flow

### 1. User Registration
1. Navigate to the signup page in the frontend
2. Submit valid email and password
3. Verify that a JWT token is received and stored

### 2. User Login
1. Navigate to the login page in the frontend
2. Submit existing user credentials
3. Verify that a JWT token is received and stored

### 3. Protected API Access
1. Ensure JWT token is included in Authorization header
2. Make API requests to protected endpoints
3. Verify that requests succeed with valid tokens

### 4. Unauthorized Access Protection
1. Make API requests without a token
2. Verify that 401 Unauthorized responses are returned

## Common Issues and Solutions

### Issue: JWT Validation Fails
**Solution**: Verify that BETTER_AUTH_SECRET is identical in both frontend and backend configurations.

### Issue: Cross-User Access Possible
**Solution**: Ensure backend validates that requested resources belong to the authenticated user ID extracted from the JWT.

### Issue: Token Not Stored Properly
**Solution**: Check that frontend properly stores and retrieves JWT from browser storage and attaches it to API requests.

## Verification Checklist
- [ ] Users can register and receive JWT tokens
- [ ] Users can log in and receive JWT tokens
- [ ] API requests with valid JWT succeed
- [ ] API requests without JWT return 401
- [ ] Users can only access their own resources
- [ ] JWT validation occurs server-side on every request
- [ ] Token expiration is enforced