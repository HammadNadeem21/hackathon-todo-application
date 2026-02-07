# Data Model: Backend API & Database (Task Management)

## Entities

### User
**Description**: Represents an authenticated user with unique identifier used for task ownership

**Fields**:
- id (UUID/string): Unique identifier for the user (primary key)
- email (string): User's email address (unique, required)
- created_at (datetime): When the user account was created
- updated_at (datetime): When the user account was last updated
- is_active (boolean): Whether the user account is active

**Validation rules**:
- Email must be a valid email format
- Email must be unique across all users
- ID must be unique and immutable after creation

### Task
**Description**: Represents a user's personal task with title, description, completion status, and timestamps

**Fields**:
- id (UUID/string): Unique identifier for the task (primary key)
- title (string): Title or description of the task (required)
- description (string): Detailed description of the task (optional)
- completed (boolean): Whether the task is completed
- user_id (UUID/string): Foreign key linking to the User who owns this task
- created_at (datetime): When the task was created
- updated_at (datetime): When the task was last updated

**Validation rules**:
- Title must not be empty
- user_id must correspond to a valid User.id
- Only the user with matching user_id can access/modify the task
- Description, if provided, must be less than 1000 characters

### JWT Token
**Description**: Contains user identity claims used for authentication and authorization

**Claims**:
- sub (subject): User ID (matches User.id)
- email (string): User's email address
- exp (expiration): Unix timestamp when token expires
- iat (issued at): Unix timestamp when token was issued
- jti (JWT ID): Unique identifier for the token

**Validation rules**:
- Token must have valid signature using shared secret
- Token must not be expired (exp > current time)
- Subject (sub) must correspond to a valid User.id

## Relationships
- User (1) : Task (Many) - One user can have many tasks
- JWT Token (1) : User (1) - One JWT token represents one user identity

## State Transitions

### Task States
- **Pending**: Newly created task (completed = false)
- **Completed**: User marks task as completed (completed = true)
- **Updated**: User modifies task properties (updated_at timestamp changes)
- **Deleted**: Task is removed from the system

### User States
- **Active**: User account is active and can access the system (is_active = true)
- **Inactive**: User account is deactivated (is_active = false)
- **Updated**: User information is modified (updated_at timestamp changes)

## Indexes and Performance Considerations

### Required Indexes
- User.email: For fast authentication lookups
- Task.user_id: For efficient user-scoped queries
- Task.created_at: For chronological sorting of tasks
- Task.updated_at: For change tracking and ordering

### Query Patterns
- Get all tasks for a specific user: Filter by user_id
- Get a specific task by ID: Primary key lookup
- Update task status: Update by task ID with user verification
- Delete task: Delete by task ID with user verification