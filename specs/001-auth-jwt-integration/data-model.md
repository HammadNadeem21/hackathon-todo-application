# Data Model: JWT-based Authentication & Authorization

## Entities

### User
**Description**: Represents an authenticated user with unique identifier, email, and authentication status

**Fields**:
- id (UUID/string): Unique identifier for the user (primary key)
- email (string): User's email address (unique, required)
- created_at (timestamp): When the user account was created
- updated_at (timestamp): When the user account was last updated
- is_active (boolean): Whether the user account is active

**Validation rules**:
- Email must be a valid email format
- Email must be unique across all users
- ID must be unique and immutable after creation

### JWT Token
**Description**: Contains user identity claims and expiration, used for stateless authentication

**Claims**:
- sub (subject): User ID (matches User.id)
- email (string): User's email address
- exp (expiration): Unix timestamp when token expires
- iat (issued at): Unix timestamp when token was issued
- jti (JWT ID): Unique identifier for the token (optional for stateless validation)

**Validation rules**:
- Token must have valid signature using BETTER_AUTH_SECRET
- Token must not be expired (exp > current time)
- Subject (sub) must correspond to a valid User.id

### Todo Item
**Description**: Personal task data that belongs exclusively to a single user and is accessible only by that user

**Fields**:
- id (UUID/string): Unique identifier for the todo item (primary key)
- title (string): Title or description of the todo item (required)
- completed (boolean): Whether the todo item is completed
- user_id (UUID/string): Foreign key linking to the User who owns this todo
- created_at (timestamp): When the todo item was created
- updated_at (timestamp): When the todo item was last updated

**Validation rules**:
- Title must not be empty
- user_id must correspond to a valid User.id
- Only the user with matching user_id can access/modify the todo item

## Relationships
- User (1) : Todo Item (Many) - One user can have many todo items
- JWT Token (1) : User (1) - One JWT token represents one user identity

## State Transitions

### Todo Item States
- **Active**: Newly created todo item (completed = false)
- **Completed**: User marks todo as completed (completed = true)
- **Updated**: User modifies todo properties (updated_at timestamp changes)

### JWT Token States
- **Valid**: Token signature is verified and not expired
- **Expired**: Token has passed its expiration time
- **Invalid**: Token signature fails verification or is malformed