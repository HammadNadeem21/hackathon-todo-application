# Data Model: Frontend UI & Frontend–Backend Connectivity Recovery

## Frontend State Models

### User Session State
- **authState**: Object containing authentication status
  - `isLoggedIn`: Boolean indicating if user is authenticated
  - `user`: User object with basic info (id, email, name)
  - `token`: JWT token string (stored securely)
  - `isLoading`: Boolean indicating auth loading state

### Task State
- **taskState**: Object containing task-related data
  - `tasks`: Array of task objects
  - `loading`: Boolean indicating loading state
  - `error`: Error message if any
  - `selectedTask`: Currently selected task for operations

### Task Object Structure
- **id**: String/Number - Unique identifier for the task
- **title**: String - Task title
- **description**: String - Task description
- **status**: String - Task status (e.g., "pending", "completed")
- **createdAt**: Date - Creation timestamp
- **updatedAt**: Date - Last update timestamp
- **userId**: String/Number - Associated user ID (for ownership)

## API Request/Response Models

### API Request Format
- **method**: String - HTTP method (GET, POST, PUT, DELETE)
- **url**: String - API endpoint URL
- **headers**: Object - Request headers including Authorization
- **body**: Object - Request payload (for POST/PUT)

### API Response Format
- **success**: Boolean - Indicates if request was successful
- **data**: Object/Array - Response data payload
- **error**: Object - Error details if request failed
- **status**: Number - HTTP status code

## Error State Model
- **errorCode**: Number - HTTP status code (401, 404, 500, etc.)
- **errorMessage**: String - User-friendly error message
- **errorType**: String - Type of error (auth, network, validation)
- **timestamp**: Date - When error occurred