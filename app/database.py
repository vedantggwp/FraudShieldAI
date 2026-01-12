"""
FraudShield Database Configuration

SQLAlchemy setup for PostgreSQL database.
"""

import os
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

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

# Track if database is available
_db_available = True

try:
    # Create engine with connection pool settings
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using
        pool_size=5,
        max_overflow=10,
        connect_args={"timeout": 5},  # 5 second timeout
    )
    
    # Test connection on startup
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
    except Exception as e:
        print(f"Warning: Database connection failed: {e}")
        _db_available = False
except Exception as e:
    print(f"Warning: Could not create database engine: {e}")
    _db_available = False
    # Create a dummy engine for sqlite in-memory as fallback
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
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


def is_db_available() -> bool:
    """Check if database is available."""
    return _db_available

    try:
        yield db
    finally:
        db.close()
