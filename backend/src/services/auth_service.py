"""
Authentication service for handling authentication logic.
"""
from typing import Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from datetime import timedelta
import uuid
from ..models.user import User, UserCreate
from ..utils.auth import verify_password, hash_password, create_access_token, verify_token, get_current_user_id_from_token
from ..database import get_session
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

security = HTTPBearer()

def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """
    Authenticate a user by email and password.
    """
    logger.info(f"Attempting to authenticate user with email: {email}")

    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()

    if not user:
        logger.warning("Authentication failed: User not found")
        # Still verify password to prevent timing attacks
        verify_password(password, "dummy_hash_for_timing_attack_prevention")
        return None

    if not verify_password(password, user.password):
        logger.warning(f"Authentication failed: Invalid password for user {email}")
        return None

    logger.info(f"Successfully authenticated user: {user.id}")
    return user

def create_user(session: Session, user_create: UserCreate) -> User:
    """
    Create a new user with hashed password.
    """
    logger.info(f"Creating new user with email: {user_create.email}")

    hashed_password = hash_password(user_create.password)

    db_user = User(
        email=user_create.email,
        password=hashed_password,
        is_active=True
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    logger.info(f"Successfully created user: {db_user.id}")
    return db_user

def get_current_user_id_from_token(token: str = None) -> Optional[uuid.UUID]:
    """
    Extract the current user ID from the JWT token.
    """
    if not token:
        return None

    payload = verify_token(token)
    if not payload:
        return None

    user_id_str = payload.get("sub")
    if not user_id_str:
        return None

    try:
        user_id = uuid.UUID(user_id_str)
        return user_id
    except ValueError:
        return None

def validate_user_ownership(current_user_id: uuid.UUID, target_user_id: uuid.UUID) -> bool:
    """
    Validate that the current user can access resources belonging to target user.
    """
    return current_user_id == target_user_id

def get_current_user_from_token(token: str) -> Optional[uuid.UUID]:
    """
    Get current user ID from token, handling the header extraction.
    """
    from .jwt_validator import get_token_from_header
    actual_token = get_token_from_header(token)
    return get_current_user_id_from_token(actual_token)

def require_valid_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to require a valid token for protected endpoints.
    """
    token = credentials.credentials
    user_id = get_current_user_id_from_token(token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id