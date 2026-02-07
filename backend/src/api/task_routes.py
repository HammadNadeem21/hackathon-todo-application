from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models.task import Task, TaskRead, TaskCreate, TaskUpdate
from ..services.task_service import get_tasks_by_user, create_task as create_task_service, get_task_by_id_and_user, update_task_by_id_and_user, delete_task_by_id_and_user
from .dependencies import get_current_user_id
import uuid

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=List[TaskRead])
def get_tasks(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user.
    """
    tasks = get_tasks_by_user(session, current_user_id)
    return tasks


@router.post("/", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    # Verify the user exists
    from ..models.user import User
    user_statement = select(User).where(User.id == current_user_id)
    user = session.exec(user_statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create the new task
    db_task = create_task_service(session, task, current_user_id)
    return db_task


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user.
    """
    task = get_task_by_id_and_user(session, task_id, current_user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: uuid.UUID,
    task_update: TaskUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID for the authenticated user.
    """
    updated_task = update_task_by_id_and_user(session, task_id, task_update, current_user_id)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return updated_task


@router.delete("/{task_id}")
def delete_task(
    task_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID for the authenticated user.
    """
    success = delete_task_by_id_and_user(session, task_id, current_user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"success": True, "message": "Task deleted successfully"}