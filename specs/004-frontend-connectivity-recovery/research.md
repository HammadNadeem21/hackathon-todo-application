# Research: Frontend UI & Frontend–Backend Connectivity Recovery

## Decision: Frontend Framework and Technology Stack
**Rationale**: Based on the feature specification and existing project structure, the frontend uses Next.js 16+ with App Router as required. The technology stack has been confirmed through project inspection.

**Alternatives considered**:
- React with Create React App: Would require more manual setup
- Vanilla JavaScript: Would lack modern features and routing
- Vue/Nuxt: Would not align with existing project structure

## Decision: API Communication Method
**Rationale**: Using fetch API or axios for HTTP requests with proper JWT token inclusion in Authorization header. This aligns with the requirement to attach JWT tokens to every protected API request.

**Alternatives considered**:
- GraphQL: Would require backend changes not in scope
- WebSocket: Not required for basic CRUD operations
- REST with custom headers: Standard fetch with Authorization header is simpler

## Decision: Authentication State Management
**Rationale**: Using Better Auth for authentication state management with JWT tokens stored securely in browser storage. This aligns with the existing Better Auth integration mentioned in the constraints.

**Alternatives considered**:
- Custom auth state management: Would reinvent existing solution
- Third-party auth providers only: Would not align with Better Auth constraint
- Cookie-based auth: Would complicate JWT token handling

## Decision: Error Handling Strategy
**Rationale**: Implement centralized error handling with proper status code checking (401, 404, 500) and user-friendly messages. This addresses the requirement to handle errors gracefully in UI.

**Alternatives considered**:
- Per-component error handling: Would lead to inconsistency
- Generic error handling only: Would not address specific error types
- No error handling: Would violate requirements

## Decision: CORS Configuration
**Rationale**: Configure CORS to allow communication between frontend and backend domains. Since both are running locally during development, need to ensure proper configuration for both development and production.

**Alternatives considered**:
- Disable CORS: Would not work in production
- Proxy requests: Would add unnecessary complexity
- JSONP: Obsolete and insecure method

## Decision: Environment Configuration
**Rationale**: Use environment variables for API base URL and other configuration to ensure environment parity between local and deployed setups.

**Alternatives considered**:
- Hardcoded URLs: Would not allow environment flexibility
- Runtime configuration: Would complicate deployment
- Static configuration files: Would not allow environment-specific settings