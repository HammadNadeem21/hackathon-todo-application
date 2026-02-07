# Data Model: Authentication Debugging & Recovery

## Entities

### User Identity
- **Description**: Represents authenticated user with unique identifier, email, and authentication status
- **Fields**:
  - id: unique identifier for the user
  - email: email address used for authentication
  - createdAt: timestamp when user was created
  - updatedAt: timestamp when user record was last updated
- **Relationships**: Owns multiple tasks in the system
- **Validation**: Email must be properly formatted, ID must be unique

### JWT Token
- **Description**: Contains user identity claims and is signed with BETTER_AUTH_SECRET for verification
- **Claims**:
  - sub: subject (user ID)
  - email: user's email address
  - iat: issued at timestamp
  - exp: expiration timestamp
  - jti: unique token identifier
- **Validation**: Signature must match shared secret, must not be expired, must contain valid user claims

### Authentication Session
- **Description**: Stateless authentication context established through JWT validation
- **Components**:
  - JWT token (client-stored)
  - User identity (extracted from token)
  - Request context (validated on each API call)
- **State**: No server-side storage required (stateless)

## State Transitions

### Authentication Flow
1. **Unauthenticated** → **Authenticating**: User initiates signup/login
2. **Authenticating** → **Authenticated**: Valid credentials provided, JWT issued
3. **Authenticated** → **Unauthenticated**: Token expires, is revoked, or user logs out

### Token Lifecycle
1. **Issued**: JWT created upon successful authentication
2. **Active**: Token is valid and accepted by backend
3. **Expired**: Token has exceeded its validity period
4. **Revoked**: Token is invalidated before expiration (logout)

## Validation Rules

### JWT Validation
- Signature must match BETTER_AUTH_SECRET
- Token must not be expired
- Claims must contain valid user identity
- Subject (sub) must correspond to a valid user in the system

### User Access Control
- Requested resource owner must match authenticated user ID
- No cross-user access without proper authorization
- Resource ownership verified for all CRUD operations

### Authentication Requirements
- All API requests must include valid JWT in Authorization header
- Requests without valid JWT return 401 Unauthorized
- Malformed or invalid tokens return 401 Unauthorized