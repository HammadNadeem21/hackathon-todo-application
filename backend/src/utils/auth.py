"""
Authentication utility functions for the backend.
"""
import os
from typing import Optional
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..models.user import UserRead
from sqlmodel import Session
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load environment variables
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    Hash a plain password.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with the provided data.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

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

def get_current_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract the current user ID from the JWT token.
    """
    if not token:
        return None

    payload = verify_token(token)
    if not payload:
        return None

    user_id = payload.get("sub")
    return user_id

def validate_user_ownership(current_user_id: str, target_user_id: str) -> bool:
    """
    Validate that the current user can access resources belonging to target user.
    """
    return current_user_id == target_user_id