from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models.todo import Todo, TodoCreate, TodoRead, TodoUpdate
from ..models.user import User
from ..api.jwt_dependency import get_current_user_id
from ..services.auth import validate_user_ownership
import uuid

router = APIRouter(prefix="/todos", tags=["Todos"])

@router.get("/", response_model=List[TodoRead])
def get_todos(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get all todos for the authenticated user.
    """
    statement = select(Todo).where(Todo.user_id == current_user_id)
    todos = session.exec(statement).all()

    return todos


@router.post("/", response_model=TodoRead)
def create_todo(
    todo: TodoCreate,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new todo for the authenticated user.
    """
    # Verify the user exists
    user_statement = select(User).where(User.id == current_user_id)
    user = session.exec(user_statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create the new todo item
    db_todo = Todo(
        title=todo.title,
        completed=todo.completed,
        user_id=current_user_id
    )

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)

    return db_todo


@router.get("/{todo_id}", response_model=TodoRead)
def get_todo(
    todo_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get a specific todo by ID for the authenticated user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user_id)
    todo = session.exec(statement).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo item not found"
        )

    return todo


@router.put("/{todo_id}", response_model=TodoRead)
def update_todo(
    todo_id: uuid.UUID,
    todo_update: TodoUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a specific todo by ID for the authenticated user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user_id)
    db_todo = session.exec(statement).first()

    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo item not found"
        )

    # Update the todo with provided fields
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)

    return db_todo


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo by ID for the authenticated user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user_id)
    db_todo = session.exec(statement).first()

    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo item not found"
        )

    session.delete(db_todo)
    session.commit()

    return {"success": True, "message": "Todo deleted successfully"}