from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from typing import Optional
import logging
from ..services.jwt_validator import verify_token, get_token_from_header

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JWTValidationMiddleware:
    """
    Middleware to validate JWT tokens for protected routes.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        request = Request(scope)

        # Get the path and method
        path = request.url.path
        method = request.method

        # Define public routes that don't require authentication
        public_routes = [
            "/docs", "/redoc", "/openapi.json",  # Documentation
            "/auth/login", "/auth/register", "/auth/token",  # Authentication
            "/health", "/",  # Health check and root
        ]

        # Check if the route is public
        is_public_route = False
        for public_route in public_routes:
            if path.startswith(public_route):
                is_public_route = True
                break

        # If it's not a public route, validate JWT token
        if not is_public_route:
            # Get authorization header
            auth_header = request.headers.get("authorization")

            if not auth_header:
                # For non-public routes, authentication is required
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Authorization header is missing"}
                )
                await response(scope, receive, send)
                return

            # Extract token from header
            token = get_token_from_header(auth_header)

            if not token:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid authorization header format"}
                )
                await response(scope, receive, send)
                return

            # Verify the token
            payload = verify_token(token)

            if not payload:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid or expired token"}
                )
                await response(scope, receive, send)
                return

            # Add user info to request state for use in route handlers
            request.state.user_id = payload.get("sub")
            request.state.user_email = payload.get("email")

        # Continue with the request
        await self.app(scope, receive, send)