# Data Model: Frontend UI & Integration

## Entities

### User
**Description**: Represents an authenticated user interacting with the frontend UI

**Fields**:
- id (string/UUID): Unique identifier for the user
- email (string): User's email address
- createdAt (date/time): When the user account was created
- updatedAt (date/time): When the user account was last updated

**Validation rules**:
- Email must be a valid email format
- ID must be unique and immutable after creation

### Task
**Description**: Represents a user's personal task displayed and managed through the UI

**Fields**:
- id (string/UUID): Unique identifier for the task
- title (string): Title or description of the task
- completed (boolean): Whether the task is completed
- userId (string/UUID): Foreign key linking to the User who owns this task
- createdAt (date/time): When the task was created
- updatedAt (date/time): When the task was last updated

**Validation rules**:
- Title must not be empty
- userId must correspond to a valid User.id
- Only the user with matching userId can access/modify the task

### Authentication State
**Description**: Contains user session information and JWT token for API requests

**Fields**:
- isAuthenticated (boolean): Whether the user is currently authenticated
- user (object): User object containing user information (id, email)
- token (string): JWT token for API authentication
- expiresAt (date/time): When the token expires

**Validation rules**:
- Token must be present when isAuthenticated is true
- Token must not be expired (expiresAt > current time)
- User information must be valid when present

## State Transitions

### Task States
- **Pending**: Newly created task (completed = false)
- **Completed**: User marks task as completed (completed = true)
- **Updated**: User modifies task properties (updatedAt timestamp changes)
- **Deleted**: Task is removed from the UI and backend

### Authentication States
- **Unauthenticated**: User not logged in (isAuthenticated = false)
- **Logging In**: User submitting credentials (loading state)
- **Authenticated**: User logged in with valid token (isAuthenticated = true, token present)
- **Logging Out**: User initiating logout process (transitioning to unauthenticated)

## UI Components

### Page Components
- **Register Page**: User registration form with email and password fields
- **Login Page**: User authentication form with email and password fields
- **Dashboard Page**: Main application page displaying user's tasks
- **Protected Route Wrapper**: Component that checks authentication and redirects if needed

### UI Components
- **Task List**: Displays all user tasks with completion status
- **Task Item**: Individual task with title, completion toggle, edit/delete buttons
- **Task Form**: Form for creating and editing tasks
- **Navigation**: Header with user authentication status and navigation links

### Service Components
- **API Client**: Centralized service for making authenticated API requests
- **Auth Service**: Service for handling authentication state and token management
- **Task Service**: Service for task-specific operations (CRUD operations)