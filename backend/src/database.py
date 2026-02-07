from sqlmodel import create_engine, Session
from typing import Generator
import os

# Database URL from environment variable - defaults to SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine with connection pooling for Neon serverless compatibility
# For SQLite, we need to add connect_args to handle multiple threads properly
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        echo=True,
        connect_args={"check_same_thread": False},
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300
    )
else:
    # Configure for Neon PostgreSQL with serverless compatibility
    engine = create_engine(
        DATABASE_URL,
        echo=True,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_timeout=30,
        max_identical=5,
        max_deduplication_age=60
    )

def get_session() -> Generator[Session, None, None]:
    """
    Get a database session.
    """
    with Session(engine) as session:
        yield session