from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta
from ..database import get_session
from ..models.user import User, UserCreate, UserRead
from ..services.auth import create_user, authenticate_user
from ..services.jwt_validator import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserRead)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user account.
    """
    # Check if user already exists
    existing_user = session.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create the new user
    db_user = create_user(session, user)
    return db_user


@router.post("/login")
def login_user(user_credentials: dict, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token.
    Expected input: {"email": "user@example.com", "password": "password"}
    """
    email = user_credentials.get("email")
    password = user_credentials.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    user = authenticate_user(session, email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh")
def refresh_token():
    """
    Refresh JWT token (not implemented in stateless JWT approach).
    In a real implementation, you would have refresh tokens stored in a database
    to allow refreshing access tokens without re-authentication.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh not implemented in this stateless JWT approach"
    )


@router.post("/logout")
def logout_user():
    """
    Logout user (client-side token removal).
    """
    # Since we're using stateless JWT, logout is handled on the client-side
    # by removing the token from storage. This endpoint is kept for consistency.
    return {"success": True, "message": "Logged out successfully"}