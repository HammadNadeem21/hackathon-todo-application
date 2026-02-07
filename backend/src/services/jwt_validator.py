from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from sqlmodel import Session
from ..models.user import UserRead

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")

if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable must be set")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with the provided data.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """
    Verify a JWT token and return the payload if valid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Check if token is expired
        exp = payload.get("exp")
        if exp:
            if isinstance(exp, (int, float)):
                exp_timestamp = datetime.utcfromtimestamp(int(exp))
                if exp_timestamp < datetime.utcnow():
                    return None
            else:
                return None

        return payload
    except JWTError:
        return None

def get_token_from_header(authorization: str = None):
    """
    Extract token from Authorization header.
    Expected format: "Bearer <token>"
    """
    if not authorization:
        return None

    if authorization.startswith("Bearer "):
        return authorization[7:]

    return authorization

def get_current_user_payload(token: str = None) -> Optional[dict]:
    """
    Get the current user's payload from the JWT token.
    """
    if not token:
        return None

    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload

def get_current_user_id_from_token(token: str = None) -> Optional[str]:
    """
    Get the current user ID from the JWT token.
    """
    if not token:
        return None

    payload = verify_token(token)
    if not payload:
        return None

    user_id = payload.get("sub")
    return user_id

def get_current_user_from_token(token: str = None) -> Optional[str]:
    """
    Get current user ID from token, handling the header extraction.
    """
    actual_token = get_token_from_header(token)
    if not actual_token:
        return None
    return get_current_user_id_from_token(actual_token)