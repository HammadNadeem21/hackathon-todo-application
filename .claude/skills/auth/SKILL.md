# Authentication Guard Skills

This document outlines the skills and capabilities of the auth-guard-agent when building, reviewing, or debugging authentication, authorization, token, or security-related features in the todo application.

## Core Capabilities

### Authentication Implementation
- Implementing secure SignUp and SignIn flows
- Password hashing and verification (bcrypt, argon2)
- User credential validation and sanitization
- Account verification and activation processes
- Multi-factor authentication (MFA) implementation
- Password reset and recovery mechanisms

### Authorization & Access Control
- Role-based access control (RBAC) implementation
- Permission management and validation
- Resource-level access control
- API endpoint protection
- Session-based vs token-based authorization
- Fine-grained permission systems

### JWT & Token Management
- JWT token generation and validation
- JWKS (JSON Web Key Set) integration
- Token refresh and rotation mechanisms
- Token expiration and renewal strategies
- Secure token storage and transmission
- Token-based session management

### Security Implementation
- Input validation and sanitization
- Protection against common attacks (XSS, CSRF, SQL injection)
- Secure API endpoint design
- Rate limiting for auth endpoints
- Session hijacking prevention
- Secure credential transmission

### Better Auth Integration
- Better Auth framework implementation
- Configuration and setup for Next.js applications
- Integration with FastAPI backend
- Custom authentication providers
- User session management
- Social login integration

### Middleware & Security Layers
- Authentication middleware development
- Request interception and validation
- Security header implementation
- CORS policy enforcement
- API rate limiting and throttling
- Bot detection and prevention

### Error Handling & Security
- Graceful failure handling for auth systems
- Secure error message generation
- Attack detection and mitigation
- Login attempt monitoring and alerts
- Account lockout mechanisms
- Audit logging for security events

### Database Security
- Secure user data storage and retrieval
- Password policy enforcement
- User session management in databases
- Secure token storage strategies
- Data encryption at rest and in transit
- Privacy compliance implementation

### Testing & Validation
- Security testing for authentication flows
- Penetration testing of auth systems
- Vulnerability scanning and assessment
- Authentication flow testing
- Token validation testing
- Edge case and failure scenario testing

### Compliance & Standards
- Following security best practices
- Compliance with privacy regulations (GDPR, CCPA)
- Password policy enforcement
- Secure API design principles
- OAuth2 and OpenID Connect implementation
- Security audit preparation

## Integration with Todo Application
- Implementing user authentication for todo features
- Ensuring users can only access their own todos
- Securing API endpoints for todo operations
- Integrating authentication with frontend components
- Managing user sessions across application components
- Creating secure authentication flows between Next.js frontend and FastAPI backend
- Implementing proper authentication guards for protected routes
- Ensuring secure token handling between frontend and backend