# Integration Glue Skills

This document outlines the skills and capabilities of the integration-glue agent when implementing or debugging features that span frontend and backend components in the todo application project.

## Core Capabilities

### Frontend-Backend Integration
- Implementing end-to-end feature flows (create → API → UI update)
- Debugging cross-layer integration issues
- Ensuring API contracts match frontend expectations
- Validating data flow between client and server
- Coordinating feature development across frontend and backend
- Identifying and resolving interface contract mismatches

### API Contract Validation
- Verifying frontend API calls match backend implementations
- Identifying field name/type mismatches between layers
- Ensuring request/response schemas align
- Validating HTTP method and status code usage
- Testing API endpoint integration with UI components
- Resolving content-type and serialization issues

### Authentication Flow Integration
- Debugging JWT/auth flow end-to-end
- Testing full login → protected route flows
- Identifying CORS and authentication header issues
- Validating session management across layers
- Ensuring consistent token handling between frontend and backend
- Resolving 401/403 authentication errors in flows

### Data Synchronization
- Ensuring consistent data models between frontend and backend
- Validating serialization and deserialization processes
- Testing real-time data updates and synchronization
- Identifying timing and race condition issues
- Ensuring proper error handling across service boundaries
- Validating data transformation layers

### Error Handling & Debugging
- Tracing errors across frontend-backend boundaries
- Identifying network and connectivity issues
- Debugging request/response cycles
- Validating error message consistency
- Testing edge cases and failure scenarios
- Creating comprehensive integration tests

### Testing & Validation
- Implementing end-to-end testing strategies
- Creating integration test suites
- Validating API integration points
- Testing data flow and transformations
- Verifying user workflow completion
- Ensuring cross-layer feature functionality

### Performance Optimization
- Identifying performance bottlenecks in integration layers
- Optimizing API call efficiency
- Implementing proper loading and caching strategies
- Validating response time across service boundaries
- Testing scalability of integrated components
- Ensuring efficient data transfer between layers

### Monitoring & Observability
- Implementing cross-layer logging strategies
- Creating integrated monitoring solutions
- Setting up error tracking across services
- Validating observability in distributed flows
- Ensuring consistent monitoring across components
- Creating alerting for integration failures

### Type Safety & Validation
- Ensuring consistent type definitions across layers
- Validating API response type safety
- Implementing proper validation layers
- Testing serialization/deserialization processes
- Ensuring consistent error type handling
- Maintaining type contracts between services

### Deployment & Configuration
- Validating integration in different environments
- Testing API endpoint configuration
- Ensuring proper environment variable handling
- Validating CORS and security configurations
- Testing deployment-related integration issues
- Ensuring consistent behavior across environments

## Integration with Todo Application
- Implementing end-to-end todo CRUD operations with proper UI feedback
- Validating authentication flow between Next.js frontend and FastAPI backend
- Ensuring JWT tokens are properly handled across frontend/backend boundary
- Testing todo creation → API → UI update flows
- Resolving data model inconsistencies between frontend and backend
- Validating user isolation (ensuring users only see their own todos)
- Ensuring proper error handling in todo management workflows
- Testing real-time updates if implemented in the todo application
- Validating API response consistency with frontend component expectations