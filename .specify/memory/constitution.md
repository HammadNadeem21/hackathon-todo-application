<!-- SYNC IMPACT REPORT
Version change: 1.2.0 → 1.3.0
Modified principles: API-first design → Spec-driven development, Database schema integrity → Security-first architecture, Type safety → Correctness over speed, RESTful conventions → Clear separation of concerns, Testability → Reproducible development, No authentication in this spec → No manual coding
Added sections: Key Standards, Technical Constraints, Security Constraints, Development Constraints, Success Criteria
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution (Hackathon Phase 02)

## Core Principles

### Spec-driven development
Spec-driven development using the Agentic Dev Stack workflow; All features must be derived directly from written specs; No manual coding; all implementation via Claude Code; Follow spec → plan → tasks → implementation workflow strictly; Each spec must be independently verifiable

### Security-first architecture
Security-first architecture with strict user isolation; Authentication required on all API endpoints; Task ownership enforced at every data operation; JWT verification must occur server-side on every request; Database operations must be scoped to authenticated users only; All protected routes require a valid JWT; Requests without or with invalid tokens return 401 Unauthorized; User identity must be derived from JWT, not client input; No cross-user data access under any condition; JWT tokens must have expiration and signature validation

### Correctness over speed
Correctness over speed (no feature shortcuts); No undocumented behavior or implicit assumptions; All flows (auth, CRUD, completion) function end-to-end; Project passes functional, security, and spec-compliance review

### Clear separation of concerns
Clear separation of frontend, backend, and authentication concerns; Frontend: Next.js 16+ using App Router; Backend: Python FastAPI; Authentication: Better Auth with JWT tokens

### Reproducible development
Reproducible, reviewable, and prompt-driven development; All features must be derived directly from written specs; Prompts and iterations are part of the evaluation; All flows (auth, CRUD, completion) function end-to-end

### No manual coding
No manual coding; all implementation via Claude Code; REST APIs must follow consistent, documented contracts; Each spec must be independently verifiable; No undocumented behavior or implicit assumptions

## Key Standards

All features must be derived directly from written specs; No manual coding; all implementation via Claude Code; REST APIs must follow consistent, documented contracts; Authentication required on all API endpoints; Task ownership enforced at every data operation; JWT verification must occur server-side on every request; Database operations must be scoped to authenticated users only

## Technical Constraints

Frontend: Next.js 16+ using App Router; Backend: Python FastAPI; ORM: SQLModel; Database: Neon Serverless PostgreSQL; Authentication: Better Auth with JWT tokens; Shared secret: BETTER_AUTH_SECRET used by frontend and backend; API format: JSON over HTTP with standard status codes

## Security Constraints

All protected routes require a valid JWT; Requests without or with invalid tokens return 401 Unauthorized; User identity must be derived from JWT, not client input; No cross-user data access under any condition; JWT tokens must have expiration and signature validation

## Development Constraints

Follow spec → plan → tasks → implementation workflow strictly; Each spec must be independently verifiable; Prompts and iterations are part of the evaluation; No undocumented behavior or implicit assumptions

## Success Criteria

All 5 basic-level features implemented as a web application; Multi-user support with strict data isolation; Fully functional REST API with authentication; Persistent storage using Neon PostgreSQL; Responsive frontend UI integrated with backend APIs; All flows (auth, CRUD, completion) function end-to-end; Project passes functional, security, and spec-compliance review

## Governance

All implementations must follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. All changes must be reviewed for compliance with these principles and architectural decisions.

**Version**: 1.3.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04