from sqlmodel import Session, select
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from fastapi import HTTPException, status
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_task(session: Session, task: TaskCreate, user_id: uuid.UUID) -> Task:
    """
    Create a new task for the authenticated user.
    """
    logger.info(f"Creating new task for user {user_id}")

    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    logger.info(f"Successfully created task {db_task.id} for user {user_id}")
    return db_task


def get_tasks_by_user(session: Session, user_id: uuid.UUID) -> List[Task]:
    """
    Get all tasks for a specific user.
    """
    logger.info(f"Retrieving tasks for user {user_id}")

    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()

    logger.info(f"Found {len(tasks)} tasks for user {user_id}")
    return tasks


def get_task_by_id_and_user(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
    """
    Get a specific task by ID for a specific user (to ensure user isolation).
    """
    logger.info(f"Retrieving task {task_id} for user {user_id}")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if task:
        logger.info(f"Found task {task_id} for user {user_id}")
    else:
        logger.info(f"Task {task_id} not found for user {user_id}")

    return task


def update_task_by_id_and_user(session: Session, task_id: uuid.UUID, task_update: TaskUpdate, user_id: uuid.UUID) -> Optional[Task]:
    """
    Update a specific task by ID for a specific user (to ensure user isolation).
    """
    logger.info(f"Updating task {task_id} for user {user_id}")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        logger.warning(f"Attempted to update non-existent task {task_id} for user {user_id}")
        return None

    # Update the task with provided fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    logger.info(f"Successfully updated task {task_id} for user {user_id}")
    return db_task


def delete_task_by_id_and_user(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """
    Delete a specific task by ID for a specific user (to ensure user isolation).
    """
    logger.info(f"Deleting task {task_id} for user {user_id}")

    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    db_task = session.exec(statement).first()

    if not db_task:
        logger.warning(f"Attempted to delete non-existent task {task_id} for user {user_id}")
        return False

    session.delete(db_task)
    session.commit()

    logger.info(f"Successfully deleted task {task_id} for user {user_id}")
    return True