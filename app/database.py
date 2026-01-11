"""
FraudShield Database Configuration

SQLAlchemy setup for PostgreSQL database.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL from environment variable
# Format: postgresql://user:password@host:port/database
# For local: postgresql://postgres:postgres@localhost:5432/fraudshield
# For Render: provided via DATABASE_URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/fraudshield"
)

# Render provides DATABASE_URL with postgres:// which SQLAlchemy doesn't support
# Need to replace with postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,
    max_overflow=10,
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for FastAPI to get database session.
    
    Usage:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            return db.query(Transaction).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
