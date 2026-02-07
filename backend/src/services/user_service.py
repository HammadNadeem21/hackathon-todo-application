from sqlmodel import Session, select
from typing import Optional
from ..models.user import User, UserCreate, UserUpdate
from fastapi import HTTPException, status
import uuid
from ..utils.auth import hash_password


def get_user_by_id(session: Session, user_id: uuid.UUID) -> Optional[User]:
    """
    Get a user by their ID.
    """
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    return user


def get_user_by_email(session: Session, email: str) -> Optional[User]:
    """
    Get a user by their email address.
    """
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()

    return user


def create_user(session: Session, user: UserCreate) -> User:
    """
    Create a new user with hashed password.
    """
    # Hash the password before storing
    hashed_password = hash_password(user.password)

    db_user = User(
        email=user.email,
        password=hashed_password,
        is_active=user.is_active
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def update_user(session: Session, user_id: uuid.UUID, user_update: UserUpdate) -> Optional[User]:
    """
    Update a user's information.
    """
    db_user = get_user_by_id(session, user_id)

    if not db_user:
        return None

    # Update the user with provided fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def delete_user(session: Session, user_id: uuid.UUID) -> bool:
    """
    Delete a user.
    """
    db_user = get_user_by_id(session, user_id)

    if not db_user:
        return False

    session.delete(db_user)
    session.commit()

    return True


def deactivate_user(session: Session, user_id: uuid.UUID) -> bool:
    """
    Deactivate a user account.
    """
    db_user = get_user_by_id(session, user_id)

    if not db_user:
        return False

    db_user.is_active = False
    session.add(db_user)
    session.commit()

    return True