"""
Database initialization module for creating tables and initial setup
"""

from sqlmodel import SQLModel, create_engine
from .models.user import User
from .models.task import Task
import os

def create_db_and_tables():
    """Create database tables if they don't exist."""
    # Use the same DATABASE_URL as in database.py
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)

    # Create all tables
    print("Creating database tables...")
    SQLModel.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    create_db_and_tables()